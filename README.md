# ZosTeroPs
  
Zosterops is a genus of passerine birds containing the typical white-eyes in  the white-eye family Zosteropidae. (Source: [Wikipedia](https://en.wikipedia.org/wiki/Zosterops))  
  
But **Z**os**T**ero**P**s is a **ZTP** (*Zero Touch Provisioning*) server that aims to support provisioning of devices on different platforms from different vendors.

It's a current WIP (*Work In Progress*) project, but it's expected to be fully operational and to include more and more advanced features as the development progresses. I have adopted an incremental development approach: It is expected to have a minimal working platform in the early development stage, with the addition of more advanced and customizing features over the time.

**ZosTeroPs** is a web system developed in Python using the Django framework.

And now, give back to Caesar what belongs to Caesar: The idea of developing ZosTeroPs is consecutive to the discover of the [Tim Dorssers' ZTP project](https://github.com/tdorssers/ztp). This may explain some resemblance of the GUI or some code reuse. Tim's work as well as ZosTeroPs are both under MIT license.

## Releases
* v0.0.3 (under development)
  * Addition of Edit and Delete buttons on the Detail views
  * Add of URL on ZTP script, configuration, and firmware Detail views
  * Change default extra and min_num values for ZTP script, and configuration formsets
  * Improve jsTable behavior (removal of empty lines when form is submitted, add a single empty line when editing the configurations)
  * Addition of a "preprocessor" to add CONFIG, FIRMWARE, and ZTP data
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
