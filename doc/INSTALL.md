# Installation
At the current stage, **ZosTeroPs** is functional and in use on production by
the developer.

It is trivial to install and deploy the tool for some system administrators that have already deployed a Django project.

**BUT while the project is still under initial development and until it has not reached release v1.0.0**, no support is provided and the users of **ZosTeroPs** must have sufficient knowledge and experience to manage and operate the tool on their own. For this reason, no detailed installation steps are provided, yet.

## Prerequisites
**ZosTeroPs** is developed to work with Python 3.7+ and Django 3.1.7+. It is
provided with its Pipfile to support pipenv deployment. The Pipfile only
specifies minimum dependencies: Other packages may be added to provide
additional features.

The installation procedure below assumes Python 3.7+ is insalled and the 
`pipenv` tool is present.

**ZosTeroPs** has successfully been deployed using the uWSGI application server
with a Nginx front-end HTTP server.

### Databases
Database must support JSON fields. The following databases are supported:
* MariaDB 10.2.7+
* MySQL 5.7.8+
* Oracle
* PostgreSQL  
* SQLite 3.9.0+ (with JSON1 extension)

Database other than SQLite requires appropriate Python packages:
* MySQL/MariaDB require the package `mysqlclient`

For productive system, it is recommended to use a server-based database, such
as MySQL. Ensure to create an empty database.

## Installation
**ZosTeroPs** can be installed from the GitHub sources in the directory of your
choice. In this example, `/opt/ZosTeroPs/` is the installation directory:
```
mkdir /opt
cd /opt
git clone https://github.com/amigne/ZosTeroPs.git
```

Checkout to the desired version. It is suggested to use the most recent version
(refer to https://github.com/amigne/ZosTeroPs/ to determine the most recent
version). In this example, version `v0.0.5` is assumed.
```
cd /opt/ZosTeroPs
git checkout v0.0.5
```

The virtual environment is created using `pipenv`:
```
pipenv install
```

The virtual environment can be entered:
```
pipenv shell
```

Optionally, add LDAP support (from inside the virtual environment). No support
is provided for `django-auth-ldap` or its dependencies installation.
```
pip install django-auth-ldap
```

For use with MySQL database, add the `mysqlclient` package:
```
pip install mysqlclient
```

## Configuration
Configuration files are in the directory `ZosTeroPs\settings`. The file
`base.py` contains the main settings. This file should not be changed
directly, as it is tracked with the versioning system.

Installation specific details must be declared either in `dev.py` for a
development system or `prod.py` for a production one. An example file for each
environment type is provided in `dev.example.py` and in `prod.example.py`.

## Upgrade
Please note that the database models may have some backward-incompatibilities
between successive v0.x.y development releases. Before upgrading, more than
ever, **BACKUP YOUR DATABASE** before upgrading.
