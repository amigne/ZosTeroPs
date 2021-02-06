from django.db import migrations


def populate_ztp_scripts(apps, schema_editor):
    ZtpScript = apps.get_model('ztp', 'ZtpScript')
    ztp_script = ZtpScript(
        name='ios-xe.py',
        accept_query_string=False,
        description='Cisco IOS XE ZTP bootstrap script. Based on the work of Tim Dorssers.',
        template='""" Zero-Touch Provisioning Script\nThis script downloads and installs software, performs stack renumbering, applies\na configuration template with $-based placeholders for variable substitutions\nand can execute commands upon script completion, such as smart licensing\nregistration. A simple web server can be used to serve the script and software\nto the device and standard syslog server can be used for script monitoring.\nFinally, a DHCP server configured for option 67 is required.\n\nAdapt the SYSLOG, JSON and DATA constants to your needs.\n\nSupported platforms, software versions and other details can be found at:\nhttps://cs.co/ztp_provisioning\n\nAuthor:  Tim Dorssers\nVersion: 1.1\n"""\n\nimport os\nimport re\nimport cli\nimport sys\nimport json\nimport time\nimport base64\nfrom string import Template\nfrom xml.dom import minidom\ntry:\n    from urlparse import urljoin\nexcept ImportError:\n    from urllib.parse import urljoin\n\n##### CONSTANTS ################################################################\n\nSYSLOG = \'10.0.0.1\'  # Syslog IP address string, empty string disables syslog\nLOGAPI = \'http://10.0.0.1:8080/log\'  # URL to log API, empty string disables\n\n# JSON is a string with URL of the JSON encoded DATA object as specified below.\n# Empty string disables downloading of external device data.\nJSON = \'http://10.0.0.1:8080/data\'\n\n# DATA is a list of dicts that defines device data. To specify device defaults,\n# omit the key named \'stack\' from one dict. Empty list disables the internal\n# data of the script. Valid keys and values are:\n# \'stack\'   : dict with target switch number as key and serial number as value\n# \'version\' : string with target version used to determine if upgrade is needed\n# \'base_url\': string with base URL to optionally join with install/config URL\n# \'install\' : string with URL of target IOS to download\n# \'config\'  : string with URL of configuration template to download\n# \'subst\'   : dict with keys that match the placeholders in the template\n# \'cli\'     : string of final IOS commands, or Python if within {{...}}\n# \'save\'    : boolean to indicate to save configuration at script completion\n# \'template\': string holding configuration template with $-based placeholders\nDATA = []\n\n##### GLOBALS ##################################################################\n\nztp = dict(logbuf=\'\')\n\n##### CLASSES ##################################################################\n\nclass Stack():\n    """ Object with matching device data. Provides attribute-like access """\n    def __init__(self, data, serials):\n        """ Initializes object with data and serials """\n        # absence of stack key indicates defaults dict\n        self.defaults = next((dct for dct in data if not \'stack\' in dct), {})\n        # find dict with at least one common serial number in stack dict\n        self.stack_dict = next((dct for dct in data if \'stack\' in dct\n                                and len(set(dct[\'stack\'].values())\n                                        & set(serials.values()))), {})\n\n    def __getattr__(self, name):\n        """ x.__getattr__(y) <==> x.y """\n        return self.stack_dict.get(name, self.defaults.get(name, None))\n\n##### FUNCTIONS ################################################################\n\ndef log(severity, message):\n    """ Sends string representation of message to stdout and IOS logging """\n    ztp[\'logbuf\'] += \'\\n\' + str(message)\n    print(\'\\n%s\' % str(message))\n    sys.stdout.flush()  # force writing everything in the buffer to the terminal\n    if SYSLOG:\n        for line in str(message).splitlines():\n            cli.execute(\'send log %d "%s"\' % (severity, line))\n\ndef get_serials():\n    """ Returns a dict with switch number as key and serial number as value """\n    inventory = cli.execute(\'show inventory | format\')  # xml formatted output\n    doc = minidom.parseString(inventory)\n    serials = {}\n    for node in doc.getElementsByTagName(\'InventoryEntry\'):\n        chassis = node.getElementsByTagName(\'ChassisName\')[0]\n        # non-stackable\n        if chassis.firstChild.data == \'"Chassis"\':\n            serials[0] = node.getElementsByTagName(\'SN\')[0].firstChild.data\n\n        # stackable\n        match = re.match(\'"Switch ([0-9])"\', chassis.firstChild.data)\n        if match:\n            unit = int(match.group(1))\n            serials[unit] = node.getElementsByTagName(\'SN\')[0].firstChild.data\n\n    return serials\n\ndef is_iosxe_package(url):\n    """ Returns True if the given file is an IOS XE package """\n    info = cli.execute(\'show file information %s\' % url)\n    # log error message if any and terminate script in case of failure\n    match = re.match(\'^(%Error .*)\', info)\n    if match:\n        log(3, match.group(1))\n        shutdown(save=False, abnormal=True)\n\n    return bool(re.search(\'IFS|NOVA|IOSXE_PACKAGE\', info))\n\ndef get_version():\n    """ Returns a string with the IOS version """\n    version = cli.execute(\'show version\')\n    # extract version string\n    match = re.search(\'Version ([A-Za-z0-9.:()]+)\', version)\n    # remove leading zeros from numbers\n    ver_str = re.sub(r\'\\b0+(\\d)\', r\'\\1\', match.group(1)) if match else \'unknown\'\n    # extract boot string\n    match = re.search(\'System image file is "(.*)"\', version)\n    # check if the device started in bundle mode\n    ver_str += \' bundle\' if match and is_iosxe_package(match.group(1)) else \'\'\n    return ver_str\n\ndef upload(**kwargs):\n    """ Adds given named arguments to dict and sends data to log API """\n    ztp.update(kwargs)\n    if LOGAPI:\n        try:\n            with open(\'/bootflash/temp.json\', \'w\') as outfile:\n                json.dump(ztp, outfile)\n        except (IOError, ValueError) as e:\n            log(3, e)\n            return\n\n        for retry in range(3):\n            log(6, \'Storing %s...\' % LOGAPI)\n            result = cli.execute(\'copy temp.json %s\' % LOGAPI)\n            # log error message in case of failure\n            match = re.search(\'^(%Error .*)\', result, re.MULTILINE)\n            if match:\n                log(3, match.group(1))\n            else:\n                break\n\n        try:\n            os.remove(\'/bootflash/temp.json\')\n        except OSError as e:\n            log(3, e)\n\ndef shutdown(save=False, abnormal=False):\n    """ Cleansup and saves config if needed and terminates script """\n    if save:\n        log(6, \'Saving configuration upon script termination\')\n\n    # store script state to LOGAPI if specified\n    upload(status=\'Failed\' if abnormal else \'Finished\')\n\n    if SYSLOG:\n        cli.configure(\'\'\'no logging host %s\n            no logging discriminator ztp\'\'\' % SYSLOG)\n\n    if save:\n        cli.execute(\'copy running-config startup-config\')\n\n    # terminate script with exit status\n    sys.exit(int(abnormal))\n\ndef renumber_stack(stack, serials):\n    """ Returns True if stack is renumbered or False otherwise """\n    if stack is None:\n        return False\n\n    # get current switch number and priorities as list of tuples\n    switch = cli.execute(\'show switch\')\n    match = re.findall(\'(\\d)\\s+\\S+\\s+\\S+\\s+(\\d+)\', switch)\n    # renumber switches\n    renumber = False\n    for old_num in serials:\n        # lookup new switch number\n        new_num = next((n for n in stack if serials[old_num] == stack[n]), None)\n        if new_num and old_num != int(new_num):\n            renumber = True\n            # renumber switch and log error message in case of failure\n            try:\n                cli.execute(\'switch {} renumber {}\'.format(old_num, new_num))\n                log(6, \'Renumbered switch {} to {}\'.format(old_num, new_num))\n            except cli.CLISyntaxError as e:\n                log(3, e)\n                shutdown(save=False, abnormal=True)  # terminate script\n\n        if new_num:\n            # calculate new switch priority\n            new_prio = 16 - int(new_num)\n            # lookup current switch priority\n            old_prio = next((p for n, p in match if int(n) == old_num), 1)\n            if int(old_prio) != new_prio:\n                # check if top switch is not active\n                if switch.find(\'*{}\'.format(sorted(serials.keys())[0])) == -1:\n                    renumber = True\n\n                # set switch priority and log error message in case of failure\n                try:\n                    cli.execute(\'switch %s priority %d\' % (old_num, new_prio))\n                    log(6, \'Switch %s priority set to %d\' % (old_num, new_prio))\n                except cli.CLISyntaxError as e:\n                    log(3, e)\n                    shutdown(save=False, abnormal=True)  # terminate script\n\n    if renumber:\n        for num in serials.keys():\n            # to prevent recovery from backup nvram\n            try:\n                cli.execute(\'delete flash-%s:nvram_config*\' % num)\n            except cli.CLISyntaxError as e:\n                pass\n\n    return renumber\n\ndef install(target, is_chassis):\n    """ Returns True if install script is configured or False otherwise """\n    # remove leading zeros from required version numbers and compare\n    if (target.version is None or target.install is None\n        or ztp[\'version\'] == re.sub(r\'\\b0+(\\d)\', r\'\\1\', target.version.strip())):\n            return False\n\n    install_url = urljoin(target.base_url, target.install)\n    # terminate script in case of invalid file\n    log(6, \'Checking %s\' % install_url)\n    if not is_iosxe_package(install_url):\n        log(3, \'%s is not valid image file\' % install_url)\n        shutdown(save=False, abnormal=True)\n\n    # change boot mode if device is in bundle mode\n    if \'bundle\' in ztp[\'version\']:\n        fs = \'bootflash:\' if is_chassis else \'flash:\'\n        log(6, \'Changing the Boot Mode\')\n        cli.configure(\'\'\'no boot system\n            boot system {}packages.conf\'\'\'.format(fs))\n        cli.execute(\'write memory\')\n        cli.execute(\'write erase\')\n        # install command needs confirmation on changed boot config\n        confirm_bm = \'\'\'pattern "\\[y\\/n\\]|#"\n            action 5.3 cli command "y"\'\'\'\n    else:\n        confirm_bm = \'\'\n\n    # Configure EEM applet for interactive command execution\n    cli.configure(\'\'\'event manager applet upgrade\n        event none maxrun 900\n        action 1.0 cli command "enable"\n        action 2.0 syslog msg "Removing inactive images..."\n        action 3.0 cli command "install remove inactive" pattern "\\[y\\/n\\]|#"\n        action 3.1 cli command "y"\n        action 4.0 syslog msg "Downloading and installing image..."\n        action 5.0 cli command "install add file %s activate commit" pattern "\\[y\\/n\\/q\\]|#"\n        action 5.1 cli command "n" pattern "\\[y\\/n\\]|#"\n        action 5.2 cli command "y" %s\n        action 6.0 syslog msg "Reloading stack..."\n        action 7.0 reload\'\'\' % (install_url, confirm_bm))\n    return True\n\ndef autoupgrade():\n    """ Returns True if autoupgrade script is configured or False otherwise """\n    switch = cli.execute(\'show switch\')\n    # look for a switch in version mismatch state\n    if switch.find(\'V-Mismatch\') > -1:\n        # Workaround to execute interactive marked commands from guestshell\n        cli.configure(\'\'\'event manager applet upgrade\n            event none maxrun 600\n            action 1.0 cli command "enable"\n            action 2.0 cli command "request platform software package install autoupgrade"\n            action 3.0 syslog msg "Reloading stack..."\n            action 4.0 reload\'\'\')\n        return True\n    else:\n        return False\n\ndef parse_hex(fmt):\n    """ Converts the hex/text format of the IOS more command to string """\n    match = re.findall(\'\\S{8}: +(\\S{8} +\\S{8} +\\S{8} +\\S{8})\', fmt)\n    parts = [base64.b16decode(re.sub(\' |X\', \'\', line)) for line in match]\n    return \'\'.join(parts) if match else fmt\n\ndef download(file_url):\n    """ Returns file contents or empty string in case of failure """\n    if file_url:\n        for retry in range(3):\n            log(6, \'Downloading %s...\' % file_url)\n            result = cli.execute(\'more %s\' % file_url)\n            # log error message in case of failure\n            match = re.match(\'^(%Error .*)\', result)\n            if match:\n                log(3, match.group(1))\n            else:\n                break\n\n        # extract file contents from output\n        match = re.search(\'^Loading %s (.*)\' % file_url, result, re.DOTALL)\n        return parse_hex(match.group(1)) if match else \'\'\n    else:\n        return \'\'\n\ndef apply_config(target):\n    """ Returns True if configuration template is applied successfully """\n    cfg_url = urljoin(target.base_url, target.config) if target.config else None\n\n    # remove keyword \'end\' from downloaded configuration\n    conf = re.sub(\'^\\s*end\\s*$\', \'\', download(cfg_url), flags=re.MULTILINE)\n    if target.template:\n        conf += \'\\n\' + target.template if len(conf) else target.template\n\n    if len(conf) == 0:\n        return False\n\n    # build configuration from template by $-based substitutions\n    if target.subst:\n        conf = Template(conf).safe_substitute(target.subst)\n\n    # apply configuration and log error message in case of failure\n    try:\n        cli.configure(conf)\n    except cli.CLIConfigurationError as e:\n        log(3, \'Failed configurations:\\n\' + \'\\n\'.join(map(str, e.failed)))\n        shutdown(save=False, abnormal=True)  # terminate script\n    else:\n        return True\n\ndef blue_beacon(sw_nums):\n    """ Turns on blue beacon of given switch number list, if supported """\n    for num in sw_nums:\n        # up to and including 16.8.x\n        try:\n            cli.cli(\'configure terminal ; hw-module beacon on switch %d\' % num)\n        except (cli.errors.cli_syntax_error, cli.errors.cli_exec_error):\n            pass\n        # from 16.9.x onwards\n        try:\n            cli.execute(\'hw-module beacon slot %d on\' % num)\n        except cli.CLISyntaxError:\n            pass\n\n        log(6, \'Switch %d beacon LED turned on\' % num)\n\ndef final_cli(command):\n    """ Returns True if given command string is executed succesfully """\n    success = False\n    if command is not None:\n        success = True\n        for cmd in command.splitlines():\n            # look for python expressions within {{...}}\n            match = re.search(\'{{(.*?)}}\', cmd)\n            if match:\n                try:\n                    result = eval(match.group(1))  # evaluate expression\n                except Exception as e:\n                    log(3, \'Final command failure: %s\' % e)\n                    success = False\n                    continue\n                else:\n                    if result is None:\n                        continue\n\n                # replace expression with result\n                cmd = cmd.replace(match.group(0), str(result))\n\n            try:\n                output = cli.execute(cmd)  # execute command\n            except cli.CLISyntaxError as e:\n                log(3, \'Final command failure: %s\' % e)\n                success = False\n            else:\n                # append command output to cli item of global dict ztp\n                fmt = \'{}{:-^60.54}\\n\\n{}\\n\\n\'\n                ztp[\'cli\'] = fmt.format(ztp.get(\'cli\', \'\'), cmd, output)\n\n    return success\n\ndef main():\n    # setup IOS syslog for our own messages if server IP is specified\n    if SYSLOG:\n        cli.configure(\'\'\'logging discriminator ztp msg-body includes Message from|HA_EM|INSTALL\n            logging host %s discriminator ztp\'\'\' % SYSLOG)\n        time.sleep(2)\n\n    # show script name\n    log(6, \'*** Running %s ***\' % os.path.basename(sys.argv[0]))\n    # get platform serial numers and software version\n    serials = get_serials()\n    log(6, \'Platform serial number(s): %s\' % \', \'.join(serials.values()))\n    ztp[\'version\'] = get_version()\n    log(6, \'Platform software version: %s\' % ztp[\'version\'])\n    # load JSON formatted data if URL is specified and concatenate it to DATA\n    json_str = download(JSON)\n    try:\n        data = DATA + json.loads(json_str) if len(json_str) else DATA\n    except ValueError as e:\n        log(3, e)\n        shutdown(save=False, abnormal=True)  # malformed data; terminate script\n\n    # lookup stack in dataset, if not found turn on beacon\n    target = Stack(data, serials)\n    if target.stack is None:\n        log(4, \'% Stack not found in dataset\')\n        blue_beacon(serials.keys())\n        ztp[\'serial\'] = serials[sorted(serials.keys())[0]]\n    else:\n        ztp[\'serial\'] = target.stack[sorted(target.stack.keys())[0]]\n        # check if all specified switches are found, turn on beacon if not\n        missing = set(target.stack.values()) - set(serials.values())\n        if len(missing):\n            log(4, \'Missing switch(es): %s\' % \', \'.join(missing))\n            blue_beacon(serials.keys())\n\n        # check if all found switches are specified, turn on beacon if not\n        extra = set(serials.values()) - set(target.stack.values())\n        if len(extra):\n            log(4, \'Extra switch(es): %s\' % \', \'.join(extra))\n            blue_beacon(serials.keys())\n\n    is_chassis = bool(0 in serials)\n    # first, check version and install software if needed\n    if install(target, is_chassis):\n        log(6, \'Software upgrade starting asynchronously...\')\n        upload(status=\'Upgrading\')\n        cli.execute(\'event manager run upgrade\')\n    else:\n        # second, check v-mismatch and perform autoupgrade if needed\n        if not is_chassis and autoupgrade():\n            log(6, \'V-Mismatch detected, upgrade starting asynchronously...\')\n            upload(status=\'Upgrading\')\n            cli.execute(\'event manager run upgrade\')\n        else:\n            log(6, \'No software upgrade required\')\n            # third, check switch numbering and renumber stack if needed\n            if not is_chassis and renumber_stack(target.stack, serials):\n                log(6, \'Stack renumbered, reloading stack...\')\n                upload(status=\'Renumbered\')\n                cli.execute(\'reload\')\n            else:\n                log(6, \'No need to renumber stack\')\n                # fourth, apply configuration template if specified\n                if apply_config(target):\n                    log(6, \'Configuration template applied successfully\')\n                # fifth, execute final cli if specified\n                if final_cli(target.cli):\n                    log(6, \'Final command(s) executed successfully\')\n\n                # cleanup after step 4 or 5 and save config if specified\n                log(6, \'End of workflow reached\')\n                shutdown(save=target.save, abnormal=False)\n\nif __name__ == "__main__":\n    main()')
    ztp_script.save()


class Migration(migrations.Migration):
    dependencies = [
        ('ztp', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_ztp_scripts),
    ]