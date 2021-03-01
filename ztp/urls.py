from django.conf import settings
from django.conf.urls import url
from django.urls import path

from . import views

urlpatterns = [
    # Home
    path('', views.HomeView.as_view(), name='home'),
    path('about/', views.AboutView.as_view(), name='about'),

    # ZTP Scripts
    url('^' + settings.ZTP_BOOTSTRAP_URL + '(?P<name>[A-Za-z0-9_.-]+)$', views.ztp_download, name='ztpDownload'),
    path('ztpscript/', views.ZtpListView.as_view(), name='ztpList'),
    path('ztpscript/new/', views.ZtpCreateView.as_view(), name='ztpCreate'),
    path('ztpscript/<pk>/', views.ZtpDetailView.as_view(), name='ztpDetail'),
    path('ztpscript/<pk>/edit/', views.ZtpUpdateView.as_view(), name='ztpUpdate'),
    path('ztpscript/<pk>/delete/', views.ZtpDeleteView.as_view(), name='ztpDelete'),

    # Configurations
    url('^' + settings.ZTP_CONFIG_URL + '(?P<name>[A-Za-z0-9_.-]+)$', views.config_download, name='configDownload'),
    path('configuration/', views.ConfigListView.as_view(), name='configList'),
    path('configuration/new/', views.ConfigCreateView.as_view(), name='configCreate'),
    path('configuration/<pk>/', views.ConfigDetailView.as_view(), name='configDetail'),
    path('configuration/<pk>/edit/', views.ConfigUpdateView.as_view(), name='configUpdate'),
    path('configuration/<pk>/delete/', views.ConfigDeleteView.as_view(), name='configDelete'),

    # Firmwares
    url('^' + settings.ZTP_FIRMWARES_URL + '(?P<filename>[A-Za-z0-9_.-]+)$', views.firmware_download, name='firmwareDownload'),
    path('firmware/', views.FirmwareListView.as_view(), name='firmwareList'),
    path('firmware/new/', views.FirmwareCreateView.as_view(), name='firmwareCreate'),
    path('firmware/<pk>/', views.FirmwareDetailView.as_view(), name='firmwareDetail'),
    path('firmware/<pk>/edit/', views.FirmwareUpdateView.as_view(), name='firmwareUpdate'),
    path('firmware/<pk>/delete/', views.FirmwareDeleteView.as_view(), name='firmwareDelete'),

    # Platforms
    path('platform/', views.PlatformListView.as_view(), name='platformList'),
    path('platform/new/', views.PlatformCreateView.as_view(), name='platformCreate'),
    # path('platform/<pk>/', views.PlatformDetailView.as_view(), name='platformDetail'),
    path('platform/<pk>/edit/', views.PlatformUpdateView.as_view(), name='platformUpdate'),
    path('platform/<pk>/delete/', views.PlatformDeleteView.as_view(), name='platformDelete'),

    # Vendors
    path('vendor/', views.VendorListView.as_view(), name='vendorList'),
    path('vendor/new/', views.VendorCreateView.as_view(), name='vendorCreate'),
    # path('vendor/<pk>/', views.VendorDetailView.as_view(), name='vendorDetail'),
    path('vendor/<pk>/edit/', views.VendorUpdateView.as_view(), name='vendorUpdate'),
    path('vendor/<pk>/delete/', views.VendorDeleteView.as_view(), name='vendorDelete'),

    # Logs
    path('logs/', views.LogListView.as_view(), name='logs'),
]

