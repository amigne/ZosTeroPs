# Installation
## Information
At the current stage, **ZosTeroPs** is functional and in use on production by
the developer.

**ZosTeroPs** successfully works on Linux systems running Python 3.7+ and Django
3.1.7+: A Pipfile is provided to ease the installation of the main dependencies.
Additional packages may be installed to support extra features (e.g. specific
database, LDAP authentication, WSGI application server).

This page documents the installation of **ZosTeroPs** on a Linux Debian 10.8
system, with a MySQL database, uWSGI as an application server, and Nginx as web
server. This guide presents the minimum steps to install **ZosTeroPs** and make
it run. Customization and security hardening is left to the system administrator
to ensure its specific requirements are fulfilled.

## Installation steps
### Database setup
Prior to installing **ZosTeroPs**, we ensure a database management system is
installed and a database is created.

Debian 10.8 comes with MariaDB 10.3 as a replacement of MySQL. Let's install it
(`libmardiadbclient-dev` is a requirement for the Python `mysqlclient` package):
```
apt install mariadb-server libmariadbclient-dev
```

After the MariaDB server is installed, we must create an empty database for use
with **ZosTeroPs**. For the example, we define the following values:
* database name: _zosterops_
* username: _zosterops_
* password: _password_

After connecting to the databse with `mysql`, we create the database and grant
the privileges for our user with the following commands:
```
CREATE DATABASE zosterops;
GRANT ALL PRIVILEGES ON zosterops.* TO zosterops@localhost IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
QUIT
```

### ZosTeroPs installation
Install Python 3 (Debian 10.8 packages Python 3.7) and the virtual environment
_pipenv_. Git is also installed, as **ZosTeroPs** will be installed from the
Github repository.
```shell
apt install python3 pipenv virtualenv git
```

We will install **ZosTeroPs** into `/opt`, let's move there and clone the GitHub
repository:
```shell
cd /opt
git clone https://github.com/amigne/ZosTeroPs.git
```

The service will run as user `zosterops` and group `zosterops`. Let's
create them:
```shell
/usr/sbin/useradd -d/opt/ZosTeroPs -c"ZosTeroPs account" -r -s/bin/bash -U zosterops
```

We change the rights of the file to be owned by the user `zosterops`:
```shell
chown -R zosterops:zosterops ZosTeroPs
cd ZosTeroPs
```

We now become user `zosterops`:
```shell
su - zosterops
```

Let's checkout the right to the version we would like to use, for the example,
I use the current release (at the time of writing) `v0.0.5`.
```shell
git checkout v0.0.5
```

We are ready to create the virtual environment (in the directory `.venv` that
we create) with the minimum dependencies mentioned in `Pipfile`,:
```shell
mkdir .venv
pipenv install
```

Once pipenv is installed, we should enter its shell in order to be in the
right environment:
```shell
pipenv shell
```

As we planned to use _MariaDB_ database, we add `mysqlclient` package. For the
application server, we will use _uWSGI_ and add `uwsgi` package. Let's install
them. In order to prevent to alter the `Pipfile` and `Pipfile.lock` files that
would create issues with future `git pull`, we use the command `pip`:
```shell
pip install mysqlclient uwsgi
```

The next step is the creation of the ZosTeroPs configuration file. The config
file will need a unique secret key. Let's generate it:
```shell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

The above command returned `-ntw2a7k4mh@iu-ov-*48b1tb4l4mcw9+di4xzi=fa3*f1o50i`
that will be copied into the configuration file.

Let's create and edit the production configuration file:
```shell
vi ZosTeroPs/settings/prod.py
```

Edit the file so it contains:
```python
from .base import *

DEBUG = False
SECRET_KEY = '-ntw2a7k4mh@iu-ov-*48b1tb4l4mcw9+di4xzi=fa3*f1o50i'
# Replace 'ztp.local' with your 
ALLOWED_HOSTS = ['ztp.local']

# Databases configuration
# (https://docs.djangoproject.com/en/3.1/ref/databases/)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'zosterops',
        'USER': 'zosterops',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '3306',
        'CHARSET': 'utf8mb4'
    }
}


# e-mail sending configuration
# Replace the below settings with the appropriate information.
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'yourusername@gmail.com'
EMAIL_HOST_PASSWORD = 'yourpassword'
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
DEFAULT_FROM_EMAIL= 'yourusername@gmail.com'
```

**ZosTeroPs** requires the settings to have `RUNNING_ENV` set to either `env` or
`prod` to load the right configuration file. We have edited `prod`
configuration, so let's set the environment variabel to this value:
```shell
export RUNNING_ENV=prod
```

At this point, we can update the database schema, we collect the static files
into `/opt/ZosTeroPs/static`.
```shell
python manage.py migrate
python manage.py collectstatic
```

**ZosTeroPs** GUI requires users to be authenticated. You should create a
superuser account. This account will permit you to create regular users through
the admin portal.
```shell
python manage.py createsuperuser
```

### Application server configuration

uWSGI is used as application server. We put its configuration in 
`config/uwsgi.ini`:
```shell
vi config/uwsgi.ini
```

Let's edit the file so it contains:
```ini
[uwsgi]
projectname = ZosTeroPs
base = /opt/ZosTeroPs

master = true
virtualenv = %(base)/.venv
pythonpath = %(base)
chdir = %(base)
module = %(projectname).wsgi:application
socket = /tmp/%(projectname).sock
chmod-socket = 666
```

**ZosTeroPs** should be started as a service. Let's go back to root account and
create a systemd file:
```shell
exit
exit
vi /etc/systemd/system/ZosTeroPs.service
```

Edit its content:
```ini
[Unit]
Description=ZosTeroPs
After=network.target

[Service]
Type=simple
User=root
ExecStart=bash -c 'cd /opt/ZosTeroPs/; source /opt/ZosTeroPs/.venv/bin/activate; RUNNING_ENV=prod uwsgi --ini config/uwsgi.ini --uid zosterops --gid zosterops'

[Install]
WantedBy=multi-user.target
```

Apply the change to the systemctl and start **ZosTeroPs**:
```shell
systemctl daemon-reload
systemctl enable ZosTeroPs
systemctl start ZosTeroPs
```

The application server open an Unix socket that will receives requests from the
Nginx front-end server.

### Nginx setup
Nginx is used as web front-end server that will relay the requests to the
uWSGI application server.

Nginx should serves both HTTP and HTTPS requests to uWSGI so it can serve
pages to the devices using HTTP protocol, but enforce HTTPS to GUI pages for
management purpose. If HTTPS is not desired and/or not enabled on Nginx,
enforcement must be disabled in the **ZosTeroPs** configuration file (BUT note
this is a bad practice on production deployment and should be reserved for
evaluation purpose or development systems only).

First step, let's install Nginx:
```shell
apt install nginx
```

Then, let's create a file:
```shell
vi /etc/nginx/sites-available/zosterops
```

Edit it so it contains:
```
upstream ZosTeroPs {
    server      unix:///tmp/ZosTeroPs.sock;
}

server {
    listen      80;
    server_name ztp.local;

    access_log  off;
    error_log   /var/log/nginx/zosterops_error.log;

    location / {
        include     /etc/nginx/uwsgi_params;
        uwsgi_pass  ZosTeroPs;
    }

    location /static/ {
        alias /opt/ZosTeroPs/static/;
    }

    client_max_body_size 5000M;
}

server {
    listen              443 ssl;
    server_name         ztp.local;

    # This assumes you own SSL certificate and key
    ssl_certificate     /etc/ssl/zosterops/zosterops.crt;
    ssl_certificate_key /etc/ssl/zosterops/zosterops.key;

    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!aMD5;

    access_log          off;
    error_log           /var/log/nginx/zosterops_error.log;

    location / {
        include         /etc/nginx/uwsgi_params;
        uwsgi_pass      ZosTeroPs;
    }

    location /static/ {
        alias           /opt/ZosTeroPs/static/;
    }

    client_max_body_size 5000M;     
}
```

Enable the site:
```shell
ln -s /etc/nginx/sites-available/zosterops /etc/nginx/sites-enabled/zosterops
```

Restart the server:
```shell
systemctl reload nginx
```

Congratulations! You now have your **ZosTeroPs** service running and available
at http://ztp.local (or any other site you have configured).

### Additional information
You have configured the **ZosTeroPs** service. For the ZTP service to work as
expected, you may need to have your DHCP server that serves IP address to your
ZTP-enabled device returning additional data. Refer to your device vendor to
determine the exact information that should be provided and configure your DHCP
server accordingly.

### Extra: creating a self-signed certificate
The Nginx configuration assumes you have SSL certificates. If you don't, 
you can generate **for testing purposes only** self-signed certificates.
For production system, you should use SSL certificates emitted by a certificate
authority or use [certbot](https://certbot.eff.org/).

If you want to generate your self-signed certificate, you can proceed this way:
```shell
cd /etc/ssl/
mkdir zosterops
cd zosterops
openssl req -newkey rsa:4096 -x509 -sha256 -days 3650 -nodes -out zosterops.crt -keyout zosterops.key
```
As this will be a fake test-only certificate, you can answer the questions the
last command asks with the defaults.

## Database support
Database must support JSON fields. The following databases are supported:
* MariaDB 10.2.7+
* MySQL 5.7.8+
* Oracle
* PostgreSQL  
* SQLite 3.9.0+ (with JSON1 extension)

Prior to installing **ZosTeroPs**, install MySQL or MariaDB and create an empty
database. Note down the database name and credentials.

## Upgrade
Before upgrading, **BACKUP YOUR DATABASE**.
