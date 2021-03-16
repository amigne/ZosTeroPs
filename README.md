# ZosTeroPs
  
Zosterops is a genus of passerine birds containing the typical white-eyes in the
white-eye family Zosteropidae. (Source: 
[Wikipedia](https://en.wikipedia.org/wiki/Zosterops))  
  
But **Z**os**T**ero**P**s is a **ZTP** (*Zero Touch Provisioning*) server that
aims to support provisioning of devices on different platforms from different
vendors.

It's a current WIP (*Work In Progress*) project, but it's expected to be fully
operational and to include more and more advanced features as the development
progresses. I have adopted an incremental development approach: It is expected
to have a minimal working platform in the early development stage, with the
addition of more advanced and customizing features over the time.

**ZosTeroPs** is a web system developed in Python using the Django framework.

## Guided tour
### Vendors and Platforms
**ZosTeroPs** permits to create vendors and platforms that are used to classify
firmwares.

![Vendors' list][vendors_list]
List of vendors page

![Platforms' list][platforms_list]
List of platforms page

### Firmwares
**ZosTeroPs** hosts firmwares and delivers them by HTTP upon device request.
When files are downloaded, SHA512 and MD5 checksums are calculated. This permits
to ensure the image is not alterated. This also serves as a local registry of
checksums to ensure the image has correctly been transferred to the network
device, if it permits to make such verifications.

![Firmwares' list][firmwares_list]
List of available firmwares

![Firmware's detail][firmwares_detail]
Details of a specific firmware

![Firmware's edit][firmwares_edit]
Edition of a firmware

### Configurations
Configurations are template-based text files that are rendered with
device-specific content such hostnames, IP addresses, firmwares, ...

Configurations is well suited for providing configuration files or data
structures (for instance JSON or YAML content). Specific data are determined
using one or multiple parameters added to the request URL. These parameters are
compared with the key values of configuration tables.

![Configurations' list][config_list]
List of defined configurations

![Config's detail][config_config_detail]
Example of one templated-Cisco configuration. The specific values are determined
upon the MAC (the first column of the table is the key) address of the device
that has to be passed (mandatory parameter) at the end of the URL (using the
`?MAC=0011.2233.4455` syntax).

![Config's edit][config_config_edit]
Creation/edition of a configuration is easy.

![Config's download][config_config_download]
When correctly requested, the configuration is rendered using the substitution
data (here for the MAC 0011.2233.4455)


Configuration is also suitable to deliver configuration data, for instance, a
JSON file:
![Data's detail][config_data_detail]
Example of one templated-JSON data file. Note that this configuration uses
[preprocessor](#Preprocessor) elements, such as `@@FIRMWARE[2].URL@@`. This is
typically well suited to pass values such as an firmware URL download link, or a
checksum value.

![Data's detail][config_data_edit]
Creation/edition of a data template is easy.

![Data's download][config_data_download]
Example of a downloaded JSON data file for the MAC 0011.2233.4455

### ZTP Scripts
ZTP scripts are usually the scripts that are loaded by the device during the
initial configuration process. They are generally more general than
configuration as the URL to retrieve them is most of the time specified in DHCP
responses. 

ZosTeroPs permits to define a script template in any textual form that is
supported by the network device. ZosTeroPs permits to substitute some parameters
with different custom values. These are simple substitutions that make it easy
to set/change values. These parameters can be referenced in the template using
double curly braces. If the parameter `DEBUG` is set to `True`, the syntax
`{{ DEBUG }}` in the template would be replaced with `True`.

The parameter-value substitution has to be enabled by checking the "Render
template" value and "Use parameters".

Substitution values may also be given using the URL query string (the part that
comes after the page name followed by a question mark). This needs to be enabled
with "Accept query string".

When both "Use parameters" and "Accept query string" are checked, parameters can
overwrite query string values if both define the same name. Checking "Priority
query string over arguments" makes query string values overwrite parameters when
both have the same name.

In addition to parameter substitution, ZTP scripts also allows preprocessing.
Preprocessing occurs in any case (independently of the checkbox values) and
before parameter substitution. Both parameters and template can have
preprocessor values.

![ZTP scripts' list][ztp_list]
List of defined ZTP scripts

![ZTP scripts' list][ztp_detail]
Details of one ZTP script

![ZTP scripts' list][ztp_edit]
Edition of one ZTP script

## Preprocessor
The preprocessor substitutes the preprocessing elements with some values
determined by the system. Preprocessing elements are surrounded with double
at-signs, like `@@ HTTP_SERVER @@`. The substitution can be performed on any
parameter or any template of the ZTP script or Configuration sections.

Supported preprocessing elements are:
* `CONFIG[id]` returns the name of the configuration with index `id`
* `CONFIG[id].URL` returns the URL of the configuration with index `id`
* `CONFIG_PATH` which returns the path after the root URL used to access the
  Configurations. This is equals to the `ZTP_CONFIG_URL` setting.
* `FIRMWARE[id]` returns the file name for the firmware with index `id`
* `FIRMWARE[id].URL` returns the URL for the firmware with index `id`
* `FIRMWARE[id].SIZE` returns the file size of the firmware with index `id`
* `FIRMWARE[id].SHA512` returns the SHA512 checksum of the firmware with index
  `id`
* `FIRMWARE[id].MD5` returns the MD5 checksum of the firmware with index `id`
* `FIRMWARE_PATH` which returns the path after the root URL used to access the
  firmwares. This is equals to the `ZTP_FIRMWARES_URL` setting.
* `HTTP_SERVER` which returns the root URL in the form `protocol://server_name/`
  of the current request.
* `PORT` which returns the TCP port of the ZosTeroPs server
* `PROTOCOL` which returns 'http' or 'https' depending of the protocol used for
  the current request
* `SERVER_NAME` which returns the server name (or IP address) of the ZosTeroPs
  server (when the server responds to multiple addresses, the name returned is
  the one answering the query).
* `ZTP[id]` returns the name of the ZTP script with index `id`
* `ZTP[id].URL` returns the URL of the ZTP script with index `id`
* `ZTP_PATH` which returns the path after the root URL used to access the ZTP
  scripts. This is equals to the `ZTP_BOOTSTRAP_URL` setting.

**Note**: Unknown or syntactically incorrect preprocessing elements are ignored
and left as is (understand they are not substituted).

## Languages
Currently, **ZosTeroPs** supports English and French. Language is determined 
based on the user browser-settings.

## Releases
* v0.0.6 (under development)
  * Addition of VERSION file used as single source of version inside the 
    application through `settings.VERSION` and in templates throug `VERSION`
    context value
  * Addition of French translations for the Javascript DataTables component
  * Detail the installation procedure in [doc/INSTALL.md](doc/INSTALL.md)
* v0.0.5 (March 14th, 2021)
  * Minor fix: Plaform relationship in Firmware is no more mandatory
  * UI: Use AdminLTE UI
  * .env configuration imposed many restrictions with complex settings such as
    list or dict structures. A new configuration model has been adopted to
    provide much more flexibility
* v0.0.4 (March 6th, 2021)
  * Getting rid of table for forms
  * Configuration parameter table does not overflow the screen anymore
  * Addition of a confirmation request before deleting a configuration parameter
    table
  * Minor fixes and corrections
  * Logging and views for displaying logs
  * Settings for e-mail better integrated in .env
  * Many-to-many relationship between firmwares and platforms support added
* v0.0.3 (February 25th, 2021)
  * Addition of Edit and Delete buttons on the Detail views
  * Add of URL on ZTP script, configuration, and firmware Detail views
  * Change default extra and min_num values for ZTP script, and configuration 
    formsets
  * Improve jsTable behavior (removal of empty lines when form is submitted, add
    a single empty line when editing the configurations)
  * Addition of a "preprocessor" to add `CONFIG`, `CONFIG_PATH`, `FIRMWARE`, 
    `FIRMWARE_PATH`, `HTTP_SERVER`, `ZTP`, and `ZTP_PATH` elements.
* v0.0.2b (February 22nd, 2021)
  * Fixing settings.py missing STATIC_ROOT 
  * Removal of comments at end of lines on .env.prod
* v0.0.2a (February 21st, 2021)
  * Fixing data migration issue
* v0.0.2 (February 21st, 2021)
  * Addition of authentication and permission mechanisms
  * Addition of LDAP support
  * Addition of .env support.
* v0.0.1 (February 17th, 2021)
  * Refactoring
  * Use of a lighter Javascript table editor.
* v0.0.0a (February 14th, 2021)
  * Fixing a regression with an obsolete CDN Javascript library. This library is
    now embedded into this package.
* v0.0.0 (February 11th, 2021)
  * Functional mockup. Tool should not be used for production, or only if you
    know what you're doing. Please note that the software design is not
    finalized and some features may evolve without consideration for backward
    compatibility.

[vendors_list]: doc/img/vendors_list.png "Vendors' list"
[platforms_list]: doc/img/platforms_list.png "Platforms' list"
[firmwares_list]: doc/img/firmwares_list.png "Firmwares' list"
[firmwares_detail]: doc/img/firmwares_detail.png "Firmware's detail"
[firmwares_edit]: doc/img/firmwares_edit.png "Firmware's edit"
[config_list]: doc/img/config_list.png "Configurations' list"
[config_config_detail]: doc/img/config_config_details.png "Configuration's detail"
[config_config_edit]: doc/img/config_config_edit.png "Configuration's edit"
[config_config_download]: doc/img/config_config_download.png "Configuration's download"
[config_data_detail]: doc/img/config_data_details.png "Data's detail"
[config_data_edit]: doc/img/config_data_edit.png "Data's edit"
[config_data_download]: doc/img/config_data_download.png "Data's download"
[ztp_list]: doc/img/ztp_list.png "ZTP scripts' list"
[ztp_detail]: doc/img/ztp_details.png "ZTP script's detail"
[ztp_edit]: doc/img/ztp_edit.png "ZTP script's edit"

## Credits
And now, give back to Caesar what belongs to Caesar: The idea of developing
ZosTeroPs is consecutive to the discover of the
[Tim Dorssers' ZTP project](https://github.com/tdorssers/ztp). This may explain
some resemblance of the GUI or some code reuse. Tim's work as well as ZosTeroPs
are both under MIT license.

ZosTeroPs includes all or some part of code from the following projects:
* Tim Dorssers' ZTP: Copyright (c) 2019 Tim Dorssers
* django-auditlog: Copyright (c) 2013-2020 Jan-Jelle Kester
* jQuery: Copyright OpenJS Foundation and other contributors, 
  https://openjsf.org/
* jsTable: Which is a fork of Jexcel, removing unused code in order to make it
  lighter and without confusing features (such as formulas, ...)
* jQuery Formset: Copyright (c) 2009, Stanislaus Madueke
* stayhomech: Copyright (c) 2020 Alexandre Georges for the support with multiple
  settings file
