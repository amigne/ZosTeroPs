from django.contrib import admin
from .models import Firmware, Platform, Vendor


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ['vendor', 'name']
    list_display_links = ['name']


@admin.register(Firmware)
class FirmwareAdmin(admin.ModelAdmin):
    list_display = ['platform', 'filename']
    list_display_links = ['filename']
