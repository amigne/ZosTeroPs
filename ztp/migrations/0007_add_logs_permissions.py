from django.contrib.auth.management import create_permissions
from django.contrib.auth.models import Group, Permission
from django.db import migrations


def set_log_permissions(apps, schema_editor):
    can_list_log = Permission.objects.get(codename='list_log')
    can_view_log = Permission.objects.get(codename='view_log')

    # The administrators may have renamed the groups created in
    # '0004_initial_groups'. Arbitrarily, we decide to permit
    # 'list_log' to groups that already permits 'list_vendor',
    # 'list_platform', 'list_firmware', 'list_config',
    # 'list_ztpscript'.
    can_list_vendor = Permission.objects.get(codename='list_vendor')
    can_list_platform = Permission.objects.get(codename='list_platform')
    can_list_firmware = Permission.objects.get(codename='list_firmware')
    can_list_config = Permission.objects.get(codename='list_config')
    can_list_ztpscript = Permission.objects.get(codename='list_ztpscript')

    list_permissions = [
        can_list_vendor, can_list_platform, can_list_firmware, can_list_config,
        can_list_ztpscript,
    ]

    observers = Group.objects.filter(permissions__in=list_permissions).distinct()
    for observer in observers:
        observer.permissions.add(can_list_log)
        observer.save()

    # The administrators may have renamed the groups created in
    # '0004_initial_groups'. Arbitrarily, we decide to permit
    # 'view_log' to groups that already permits 'view_vendor',
    # 'view_platform', 'view_firmware', 'view_config',
    # 'view_ztpscript' and all previous 'list_*'.
    can_view_vendor = Permission.objects.get(codename='view_vendor')
    can_view_platform = Permission.objects.get(codename='view_platform')
    can_view_firmware = Permission.objects.get(codename='view_firmware')
    can_view_config = Permission.objects.get(codename='view_config')
    can_view_ztpscript = Permission.objects.get(codename='view_ztpscript')

    view_permissions = list_permissions + [
        can_view_vendor, can_view_platform, can_view_firmware, can_view_config,
        can_view_ztpscript,
    ]

    readers = Group.objects.filter(permissions__in=view_permissions).distinct()
    for reader in readers:
        reader.permissions.add(can_view_log)
        reader.save()


class Migration(migrations.Migration):
    dependencies = [
        ('ztp', '0006_auto_20210306_0949'),
        ('logs', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(set_log_permissions),
    ]
