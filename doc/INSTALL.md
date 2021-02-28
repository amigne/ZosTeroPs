# Installation

At the current stage, **ZosTeroPs** is functional and in use on production by the developer.

It is trivial to install and deploy the tool for some system administrators that have already deployed a Django project.

**BUT while the project is still under initial development and until it has not reached release v1.0.0**, no support is provided and the users of **ZosTeroPs** must have sufficient knowledge and experience to manage and operate the tool on their own. For this reason, no detailed installation steps are provided, yet.

## Prerequisites
**ZosTeroPs** is developed to work with Python 3.7+ and Django 3.1.7+. It is provided with a Pipfile to support pipenv deployment.

LDAP support requires `python-ldap` and `django-auth-ldap` Python packages.

### Databases
Database must support JSON fields. The following databases are supported:
* MariaDB 10.2.7+
* MySQL 5.7.8+
* Oracle
* PostgreSQL  
* SQLite 3.9.0+ (with JSON1 extension)

Database other than SQLite requires appropriate Python packages:
* MySQL/MariaDB require the package `mysqlclient`

**ZosTeroPs** has successfully been deployed using the uWSGI application server with a Nginx front-end HTTP server.

## Configuration
Configuration should be done in a file `ZosTeroPs/.env` to be created. Examples are present in `ZosTeroPs\.env.dev` and `ZosTeroPs\.env.prod`. This prevents to modify the files that are tracked by Git and to create some issues with future `git pull`.

## i18n
Currently, **ZosTeroPs** supports English and French. Language is determined based on the user browser-settings.

## Upgrade
Please note that the database models may have some backward-incompatibilities between successive v0.x.y development releases. Before upgrading, more than ever, **BACKUP YOUR DATABASE** before upgrading.
