from django.contrib.messages.views import SuccessMessageMixin
from django.http import Http404, HttpResponse
from django.template.response import SimpleTemplateResponse
from django.urls import reverse_lazy
from django.views.generic import DetailView, ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView
from . import models

import locale


def home(request):
    return SimpleTemplateResponse('ztp/home.html',  {'menuitem': 'home'})


def ztp_download(request, name):
    try:
        ztpScript = models.ZtpScript.objects.get(name=name)
    except models.ZtpScript.DoesNotExist:
        raise Http404('ZTP Script does not exist!')
    return HttpResponse(ztpScript.template, content_type='text/plain')


class ZtpCreateView(SuccessMessageMixin, CreateView):
    model = models.ZtpScript
    fields = [ 'name', 'accept_query_string', 'description', 'template' ]
    context_object_name = 'ztpscript'
    success_url = reverse_lazy('ztpList')

    def get_context_data(self, **kwargs):
        context = super(ZtpCreateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'ztpScript'
        return context

    def get_success_message(self, cleaned_data):
        return f"ZTP script {cleaned_data['name']} successfully created!"


class ZtpDeleteView(DeleteView):
    model = models.ZtpScript
    context_object_name = 'ztpscript'
    success_url = reverse_lazy('ztpList')

    def get_context_data(self, **kwargs):
        context = super(ZtpDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'ztpScript'
        return context


class ZtpDetailView(DetailView):
    model = models.ZtpScript
    context_object_name = 'ztpscript'

    def get_context_data(self, **kwargs):
        context = super(ZtpDetailView, self).get_context_data(**kwargs)
        context['menuitem'] = 'ztpScript'
        return context


class ZtpListView(ListView):
    model = models.ZtpScript
    context_object_name = 'ztpscripts'

    def get_context_data(self, **kwargs):
        context = super(ZtpListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'ztpScript'
        return context


class ZtpUpdateView(SuccessMessageMixin, UpdateView):
    model = models.ZtpScript
    fields = [ 'name', 'accept_query_string', 'description', 'template' ]
    context_object_name = 'ztpscript'
    success_url = reverse_lazy('ztpList')

    def get_context_data(self, **kwargs):
        context = super(ZtpUpdateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'ztpScript'
        return context

    def get_success_message(self, cleaned_data):
        return f"ZTP script {cleaned_data['name']} successfully updated!"


def firmware_download(request, filename):
    try:
        p = models.Firmware.objects.get(file=filename)
    except models.Firmware.DoesNotExist:
        raise Http404('Firmware does not exist!')
    return HttpResponse(p.file.open('rb'), content_type='application/octet-stream')


class FirmwareCreateView(SuccessMessageMixin, CreateView):
    model = models.Firmware
    fields = [ 'platform', 'file', 'description' ]
    context_object_name = 'firmware'
    success_url = reverse_lazy('firmwareList')

    def get_context_data(self, **kwargs):
        context = super(FirmwareCreateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'firmware'
        return context

    def get_success_message(self, cleaned_data):
        form = self.get_form()
        instance = form.instance
        locale.setlocale(locale.LC_ALL, '')
        return f"Firmware {instance.file.name} successfully created! File size is {instance.filesize:n} bytes. MD5 hash is {instance.md5_hash}. SHA512 hash is {instance.sha512_hash}."


class FirmwareDeleteView(DeleteView):
    model = models.Firmware
    context_object_name = 'firmware'
    success_url = reverse_lazy('firmwareList')

    def get_context_data(self, **kwargs):
        context = super(FirmwareDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'firmware'
        return context


class FirmwareDetailView(DetailView):
    model = models.Firmware
    context_object_name = 'firmware'

    def get_context_data(self, **kwargs):
        context = super(FirmwareDetailView, self).get_context_data(**kwargs)
        context['menuitem'] = 'firmware'
        return context


class FirmwareListView(ListView):
    model = models.Firmware
    context_object_name = 'firmwares'

    def get_context_data(self, **kwargs):
        context = super(FirmwareListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'firmware'
        return context


class FirmwareUpdateView(SuccessMessageMixin, UpdateView):
    model = models.Firmware
    fields = [ 'platform', 'file', 'description' ]
    context_object_name = 'firmware'
    success_url = reverse_lazy('firmwareList')

    def get_context_data(self, **kwargs):
        context = super(FirmwareUpdateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'firmware'
        return context

    def get_success_message(self, cleaned_data):
        form = self.get_form()
        instance = form.instance
        locale.setlocale(locale.LC_ALL, '')
        return f"Firmware {instance.file.name} successfully modified! File size is {instance.filesize:n} bytes. MD5 hash is {instance.md5_hash}. SHA512 hash is {instance.sha512_hash}."



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
