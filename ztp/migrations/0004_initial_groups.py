from django.contrib.auth.management import create_permissions
from django.contrib.auth.models import Group, Permission
from django.db import migrations


def populate_auth_groups(apps, schema_editor):
    for app_config in apps.get_app_configs():
        app_config.models_module = True
        create_permissions(app_config, apps=apps, verbosity=0)
        app_config.models_module = None

    can_list_vendor = Permission.objects.get(codename='list_vendor')
    can_view_vendor = Permission.objects.get(codename='view_vendor')
    can_add_vendor = Permission.objects.get(codename='add_vendor')
    can_change_vendor = Permission.objects.get(codename='change_vendor')
    can_delete_vendor = Permission.objects.get(codename='delete_vendor')
    can_list_platform = Permission.objects.get(codename='list_platform')
    can_view_platform = Permission.objects.get(codename='view_platform')
    can_add_platform = Permission.objects.get(codename='add_platform')
    can_change_platform = Permission.objects.get(codename='change_platform')
    can_delete_platform = Permission.objects.get(codename='delete_platform')
    can_list_firmware = Permission.objects.get(codename='list_firmware')
    can_view_firmware = Permission.objects.get(codename='view_firmware')
    can_add_firmware = Permission.objects.get(codename='add_firmware')
    can_change_firmware = Permission.objects.get(codename='change_firmware')
    can_delete_firmware = Permission.objects.get(codename='delete_firmware')
    can_list_config = Permission.objects.get(codename='list_config')
    can_view_config = Permission.objects.get(codename='view_config')
    can_add_config = Permission.objects.get(codename='add_config')
    can_change_config = Permission.objects.get(codename='change_config')
    can_delete_config = Permission.objects.get(codename='delete_config')
    can_list_ztpscript = Permission.objects.get(codename='list_ztpscript')
    can_view_ztpscript = Permission.objects.get(codename='view_ztpscript')
    can_add_ztpscript = Permission.objects.get(codename='add_ztpscript')
    can_change_ztpscript = Permission.objects.get(codename='change_ztpscript')
    can_delete_ztpscript = Permission.objects.get(codename='delete_ztpscript')

    observers_permissions = [
        can_list_vendor, can_list_platform, can_list_firmware, can_list_config,
        can_list_ztpscript,
    ]
    observers = Group(name='Observers')
    observers.save()
    observers.permissions.set(observers_permissions)

    readers_permissions = observers_permissions + [
        can_view_vendor, can_view_platform, can_view_firmware, can_view_config,
        can_view_ztpscript,
    ]
    readers = Group(name='Readers')
    readers.save()
    readers.permissions.set(readers_permissions)

    operators_permissions = readers_permissions + [
        can_add_vendor, can_change_vendor, can_add_platform,
        can_change_platform, can_add_firmware, can_change_firmware,
        can_add_config, can_change_config, can_add_ztpscript,
        can_change_ztpscript,
    ]
    operators = Group(name='Operators')
    operators.save()
    operators.permissions.set(operators_permissions)

    administrators_permissions = operators_permissions + [
        can_delete_vendor, can_delete_platform, can_delete_firmware,
        can_delete_config, can_delete_ztpscript,
    ]
    administrators = Group(name='Administrators')
    administrators.save()
    administrators.permissions.set(administrators_permissions)



class Migration(migrations.Migration):
    dependencies = [
        ('ztp', '0003_auto_20210217_1632'),
    ]

    operations = [
        migrations.RunPython(populate_auth_groups),
    ]
