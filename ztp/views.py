from django.urls import reverse_lazy
from django.views.generic import ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from . import models


class PlatformCreateView(CreateView):
    model = models.Platform
    fields = [ 'vendor', 'name', 'description' ]
    context_object_name = 'platform'
    success_url = reverse_lazy('platformList')

    def get_context_data(self, **kwargs):
        context = super(PlatformCreateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'platform'
        return context


class PlatformDeleteView(DeleteView):
    model = models.Platform
    context_object_name = 'platform'
    success_url = reverse_lazy('platformList')

    def get_context_data(self, **kwargs):
        context = super(PlatformDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'platform'
        return context


class PlatformListView(ListView):
    model = models.Platform
    context_object_name = 'platforms'

    def get_context_data(self, **kwargs):
        context = super(PlatformListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'platform'
        return context


class PlatformUpdateView(UpdateView):
    model = models.Platform
    fields = [ 'vendor', 'name', 'description' ]
    context_object_name = 'platform'
    success_url = reverse_lazy('platformList')

    def get_context_data(self, **kwargs):
        context = super(PlatformUpdateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'platform'
        return context


class VendorCreateView(CreateView):
    model = models.Vendor
    fields = [ 'name', 'description' ]
    context_object_name = 'vendor'
    success_url = reverse_lazy('vendorList')

    def get_context_data(self, **kwargs):
        context = super(VendorCreateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context


class VendorDeleteView(DeleteView):
    model = models.Vendor
    context_object_name = 'vendor'
    success_url = reverse_lazy('vendorList')

    def get_context_data(self, **kwargs):
        context = super(VendorDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context


class VendorListView(ListView):
    model = models.Vendor
    context_object_name = 'vendors'

    def get_context_data(self, **kwargs):
        context = super(VendorListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context


class VendorUpdateView(UpdateView):
    model = models.Vendor
    fields = [ 'name', 'description' ]
    context_object_name = 'vendor'
    success_url = reverse_lazy('vendorList')

    def get_context_data(self, **kwargs):
        context = super(VendorUpdateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context
