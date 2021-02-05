from django.urls import path

from . import views


urlpatterns = [
    # Platforms
    path('platform/', views.PlatformListView.as_view(), name='platformList'),
    path('platform/new/', views.PlatformCreateView.as_view(), name='platformCreate'),
#   path('platform/<pk>/', views.PlatformDetailView.as_view(), name='platformDetail'),
    path('platform/<pk>/edit/', views.PlatformUpdateView.as_view(), name='platformUpdate'),
    path('platform/<pk>/delete/', views.PlatformDeleteView.as_view(), name='platformDelete'),

    # Vendors
    path('vendor/', views.VendorListView.as_view(), name='vendorList'),
    path('vendor/new/', views.VendorCreateView.as_view(), name='vendorCreate'),
#   path('vendor/<pk>/', views.VendorDetailView.as_view(), name='vendorDetail'),
    path('vendor/<pk>/edit/', views.VendorUpdateView.as_view(), name='vendorUpdate'),
    path('vendor/<pk>/delete/', views.VendorDeleteView.as_view(), name='vendorDelete'),
]
