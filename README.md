# ZosTeroPs
  
Zosterops is a genus of passerine birds containing the typical white-eyes in  the white-eye family Zosteropidae. (Source: [Wikipedia](https://en.wikipedia.org/wiki/Zosterops))  
  
But **Z**os**T**ero**P**s is a **ZTP** (*Zero Touch Provisioning*) server that aims to support provisioning of devices on different platforms from different vendors.

It's a current WIP (*Work In Progress*) project, but it's expected to be fully operational and to include more and more advanced features as the development progresses. I have adopted an incremental development approach: It is expected to have a minimal working platform in the early development stage, with the addition of more advanced and customizing features over the time.

**ZosTeroPs** is a web system developed in Python using the Django framework.

And now, give back to Caesar what belongs to Caesar: The idea of developing ZosTeroPs is consecutive to the discover of the [Tim Dorssers' ZTP project](https://github.com/tdorssers/ztp). This may explain some resemblance of the GUI or some code reuse. Tim's work as well as ZosTeroPs are both under MIT license.

## ZTP Scripts
ZTP scripts are usually the scripts that are loaded by the device during the initial configuration process.

ZosTeroPs permits to define a script template in any textual form that is supported by the network device. ZosTeroPs permits to substitute some parameters with different custom values. These are simple substitutions that make it easy to set/change values. These parameters can be referenced in the template using double curly braces. If the parameter `DEBUG` is set to `True`, the syntax `{{ DEBUG }}` in the template would be replaced with `True`.

The parameter-value substitution has to be enabled by checking the "Render template" value and "Use parameters".

Substitution values may also be given using the URL query string (the part that comes after the page name followed by a question mark). This needs to be enabled with "Accept query string".

When both "Use parameters" and "Accept query string" are checked, parameters can overwrite query string values if both define the same name. Checking "Priority query string over arguments" makes query string values overwrite parameters when both have the same name.

In addition to parameter substitution, ZTP scripts also allows preprocessing. Preprocessing occurs in any case (independently of the checkbox values) and before parameter substitution. Both parameters and template can have preprocessor values.

## Preprocessor
The preprocessor substitutes the preprocessing elements with some values determined by the system. Preprocessing elements are surrounded with double at-signs, like `@@ HTTP_SERVER @@`. The substitution can be performed on any parameter or any template of the ZTP script or Configuration sections.

Supported preprocessing elements are:
* `HTTP_SERVER` which returns the root URL in the form `protocol://domain/` of the current request.
* `CONFIG_PATH` which returns the path after the root URL used to access the Configurations. This is equals to the `ZTP_CONFIG_URL` setting.
* `FIRMWARE_PATH` which returns the path after the root URL used to access the firmwares. This is equals to the `ZTP_FIRMWARES_URL` setting.
* `ZTP_PATH` which returns the path after the root URL used to access the ZTP scripts. This is equals to the `ZTP_BOOTSTRAP_URL` setting.
* `FIRMWARE[id]` returns the file name for the firmware with index `id`
* `FIRMWARE[id].URL` returns the URL for the firmware with index `id`
* `FIRMWARE[id].SIZE` returns the file size of the firmware with index `id`
* `FIRMWARE[id].SHA512` returns the SHA512 checksum of the firmware with index `id`
* `FIRMWARE[id].MD5` returns the MD5 checksum of the firmware with index `id`
* `CONFIG[id]` returns the name of the configuration with index `id`
* `CONFIG[id].URL` returns the URL of the configuration with index `id`
* `ZTP[id]` returns the name of the ZTP script with index `id`
* `ZTP[id].URL` returns the URL of the ZTP script with index `id`

**Note**: Unknown or syntactically incorrect preprocessing elements are ignored and left as is (understand they are not substituted).

## Releases
* v0.0.4 (under development)
  * Getting rid of table for forms
  * Configuration parameter table does not overflow the screen anymore
* v0.0.3 (February 25th, 2021)
  * Addition of Edit and Delete buttons on the Detail views
  * Add of URL on ZTP script, configuration, and firmware Detail views
  * Change default extra and min_num values for ZTP script, and configuration formsets
  * Improve jsTable behavior (removal of empty lines when form is submitted, add a single empty line when editing the configurations)
  * Addition of a "preprocessor" to add `CONFIG`, `CONFIG_PATH`, `FIRMWARE`, `FIRMWARE_PATH`, `HTTP_SERVER`, `ZTP`, and `ZTP_PATH` elements.
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
  * Fixing a regression with an obsolete CDN Javascript library. This library is now embedded into this package.
* v0.0.0 (February 11th, 2021)
  * Functional mockup. Tool should not be used for production, or only if you know what you're doing. Please note that the software design is not finalized and some features may evolve without consideration for backward compatibility. This includes data migrations! This warning will be persist until v1.0.0 is released. At that time, the development will have reached a certain level of maturity and backward compatibility will be ensured for any further v1.x.y versions.
