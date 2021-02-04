from django.urls import path

from . import views


urlpatterns = [
    path('vendor/', views.VendorListView.as_view(), name='vendorList'),
#    path('vendor/new', views.vendors_new, name='vendors_new'),
#    path('vendor/<int:pk>', views.vendors_view, name='vendors_view'),
    path('vendor/<int:pk>/edit', views.VendorUpdateView.as_view(), name='vendorUpdate'),
#    path('vendor/<int:pk>/delete', views.vendors_delete, name='vendors_delete'),
]
