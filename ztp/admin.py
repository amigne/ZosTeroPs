from django.contrib import admin
from .models import (Config, ConfigParameter, Firmware, Platform, Vendor,
                     ZtpParameter, ZtpScript)


@admin.register(ZtpScript)
class ZtpScriptAdmin(admin.ModelAdmin):
    list_display = ['name', 'render_template', 'use_parameters',
                    'accept_query_string', 'priority_query_string_over_arguments']


@admin.register(ZtpParameter)
class ZtpParameterAdmin(admin.ModelAdmin):
    list_display = ['ztpScript', 'name', 'value']


@admin.register(Config)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(ConfigParameter)
class ConfigParameterAdmin(admin.ModelAdmin):
    list_display = ['config', 'name', 'data']


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'name']
    list_display_links = ['name']


@admin.register(Firmware)
class FirmwareAdmin(admin.ModelAdmin):
    list_display = ['id', 'file', 'filesize']
    list_display_links = ['id']
