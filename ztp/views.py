from django.views.generic import ListView
from django.views.generic.edit import UpdateView

from . import models


class VendorListView(ListView):
    model = models.Vendor
    context_object_name = 'vendors'

    def get_context_data(self, **kwargs):
        context = super(VendorListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context


class VendorUpdateView(UpdateView):
    model = models.Vendor
    context_object_name = 'vendor'
