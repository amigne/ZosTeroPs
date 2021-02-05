from django.urls import path

from . import views


urlpatterns = [
    # Vendors
    path('vendor/', views.VendorListView.as_view(), name='vendorList'),
    path('vendor/new/', views.VendorCreateView.as_view(), name='vendorCreate'),
#   path('vendor/<pk>/', views.VendorDetailView.as_view(), name='vendorDetail'),
    path('vendor/<pk>/edit/', views.VendorUpdateView.as_view(), name='vendorUpdate'),
    path('vendor/<pk>/delete/', views.VendorDeleteView.as_view(), name='vendorDelete'),
]
