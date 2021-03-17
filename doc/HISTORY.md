# History
## Releases
* v0.1.0 (under development)
  * Addition of VERSION file used as single source of version inside the 
    application through `settings.VERSION` and in templates throug `VERSION`
    context value
  * Addition of French translations for the Javascript DataTables component
  * Detail the installation procedure in [doc/INSTALL.md](doc/INSTALL.md)
  * Improve template syntax coloring mechanism: language detection uses the
    object (ZTP script or Configuration) name, instead of an extra 'language'
    field
  * Some security improvements: Removal of default 'admin:admin' superuser
    account, SSL enforcement for GUI views
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