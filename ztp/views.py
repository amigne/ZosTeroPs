from django.contrib.messages.views import SuccessMessageMixin
from django.db import transaction
from django.http import Http404, HttpResponse
from django.template import Context, Template
from django.template.response import SimpleTemplateResponse
from django.urls import reverse_lazy
from django.views.generic import DetailView, ListView
from django.views.generic.edit import CreateView, DeleteView, UpdateView

from .forms import ConfigForm, ZtpScriptForm
from .formset import ConfigParameterFormSet, ZtpParameterFormSet
from .models import Config, Firmware, Platform, Vendor, ZtpScript

import locale


def home(request):
    return SimpleTemplateResponse('ztp/home.html', {'menuitem': 'home'})


def ztp_download(request, name):
    try:
        ztp_script = ZtpScript.objects.get(name=name)
    except ZtpScript.DoesNotExist:
        raise Http404('ZTP Script does not exist!')

    if not ztp_script.render_template:
        return HttpResponse(ztp_script.template, content_type='text/plain')

    query_string_context_dict = {}
    if ztp_script.accept_query_string:
        arguments = request.GET.dict()
        for key in arguments.keys():
            query_string_context_dict[key] = arguments[key]

    parameters_context_dict = {}
    if ztp_script.use_parameters:
        for param in ztp_script.parameters.values():
            parameters_context_dict[param['name']] = param['value']

    if ztp_script.priority_query_string_over_arguments:
        context_dict = parameters_context_dict | query_string_context_dict
    else:
        context_dict = query_string_context_dict | parameters_context_dict

    template = Template(ztp_script.template)
    return HttpResponse(template.render(Context(context_dict)), content_type='text/plain')


class ZtpCreateView(CreateView):
    model = ZtpScript
    template_name = 'ztp/ztpscript_form.html'
    form_class = ZtpScriptForm
    success_url = None

    def get_context_data(self, **kwargs):
        data = super(ZtpCreateView, self).get_context_data(**kwargs)
        if self.request.POST:
            data['formset'] = ZtpParameterFormSet(self.request.POST)
        else:
            data['formset'] = ZtpParameterFormSet()
        return data

    def post(self, request, *args, **kwargs):
        self.object = None
        context = self.get_context_data()

        form = self.get_form()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            with transaction.atomic():
                self.object = form.save()
                formset.instance = self.object
                formset.save()
        return super(ZtpCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse_lazy('ztpDetail', kwargs={'pk': self.object.pk})


class ZtpDeleteView(DeleteView):
    model = ZtpScript
    context_object_name = 'ztpscript'
    success_url = reverse_lazy('ztpList')

    def get_context_data(self, **kwargs):
        context = super(ZtpDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'ztpScript'
        return context


class ZtpDetailView(DetailView):
    model = ZtpScript
    context_object_name = 'ztpscript'

    def get_context_data(self, **kwargs):
        context = super(ZtpDetailView, self).get_context_data(**kwargs)
        context['menuitem'] = 'ztpScript'
        return context


class ZtpListView(ListView):
    model = ZtpScript
    context_object_name = 'ztpscripts'

    def get_context_data(self, **kwargs):
        context = super(ZtpListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'ztpScript'
        return context


class ZtpUpdateView(UpdateView):
    model = ZtpScript
    template_name = 'ztp/ztpscript_form.html'
    form_class = ZtpScriptForm
    success_url = None

    def get_context_data(self, **kwargs):
        data = super(ZtpUpdateView, self).get_context_data(**kwargs)
        if self.request.POST:
            data['formset'] = ZtpParameterFormSet(self.request.POST, instance=self.object)
        else:
            data['formset'] = ZtpParameterFormSet(instance=self.object)
        return data

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data()

        form = self.get_form()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            with transaction.atomic():
                self.object = form.save()
                formset.instance = self.object
                formset.save()
        return super(ZtpUpdateView, self).form_valid(form)

    def get_success_url(self):
        return reverse_lazy('ztpDetail', kwargs={'pk': self.object.pk})


def config_download(request, name):
    try:
        configuration = Config.objects.get(name=name)
    except Config.DoesNotExist:
        raise Http404('Configuration does not exist!')

    context_dict = dict()

    arguments = request.GET.dict()
    if len(arguments):
        # We have arguments so let's process them and the stored parameters' data
        parameters = configuration.data_to_dict()

        for key in arguments.keys():
            if key in parameters:
                value = arguments[key]
                if value in parameters[key]:
                    context_dict.update(parameters[key][value])

    template = Template(configuration.template)
    return HttpResponse(template.render(Context(context_dict)), content_type='text/plain')


class ConfigCreateView(CreateView):
    model = Config
    template_name = 'ztp/config_form.html'
    form_class = ConfigForm
    success_url = None

    def get_context_data(self, **kwargs):
        context = super(ConfigCreateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'config'
        if self.request.POST:
            context['formset'] = ConfigParameterFormSet(self.request.POST)
        else:
            context['formset'] = ConfigParameterFormSet()
        return context

    def post(self, request, *args, **kwargs):
        self.object = None
        context = self.get_context_data()

        form = self.get_form()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            with transaction.atomic():
                self.object = form.save()
                formset.instance = self.object
                formset.save()
        return super(ConfigCreateView, self).form_valid(form)

    def get_success_url(self):
        return reverse_lazy('configDetail', kwargs={'pk': self.object.pk})


class ConfigDeleteView(DeleteView):
    model = Config
    context_object_name = 'config'
    success_url = reverse_lazy('configList')

    def get_context_data(self, **kwargs):
        context = super(ConfigDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'config'
        return context


class ConfigDetailView(DetailView):
    model = Config
    context_object_name = 'config'

    def get_context_data(self, **kwargs):
        context = super(ConfigDetailView, self).get_context_data(**kwargs)
        context['menuitem'] = 'config'
        return context


class ConfigListView(ListView):
    model = Config
    context_object_name = 'configs'

    def get_context_data(self, **kwargs):
        context = super(ConfigListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'config'
        return context


class ConfigUpdateView(UpdateView):
    model = Config
    template_name = 'ztp/config_form.html'
    form_class = ConfigForm
    success_url = None

    def get_context_data(self, **kwargs):
        data = super(ConfigUpdateView, self).get_context_data(**kwargs)
        if self.request.POST:
            data['formset'] = ConfigParameterFormSet(self.request.POST, instance=self.object)
        else:
            data['formset'] = ConfigParameterFormSet(instance=self.object)
        return data

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        context = self.get_context_data()

        form = self.get_form()
        formset = context['formset']
        if form.is_valid() and formset.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            with transaction.atomic():
                self.object = form.save()
                formset.instance = self.object
                formset.save()
        return super(ConfigUpdateView, self).form_valid(form)

    def get_success_url(self):
        return reverse_lazy('configDetail', kwargs={'pk': self.object.pk})


def firmware_download(request, filename):
    try:
        p = Firmware.objects.get(file=filename)
    except Firmware.DoesNotExist:
        raise Http404('Firmware does not exist!')
    return HttpResponse(p.file.open('rb'), content_type='application/octet-stream')


class FirmwareCreateView(SuccessMessageMixin, CreateView):
    model = Firmware
    fields = ['platform', 'file', 'description']
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
        return f"Firmware {instance.file.name} successfully created! File size is {instance.filesize:n} bytes." \
               f" MD5 hash is {instance.md5_hash}. SHA512 hash is {instance.sha512_hash}."


class FirmwareDeleteView(DeleteView):
    model = Firmware
    context_object_name = 'firmware'
    success_url = reverse_lazy('firmwareList')

    def get_context_data(self, **kwargs):
        context = super(FirmwareDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'firmware'
        return context


class FirmwareDetailView(DetailView):
    model = Firmware
    context_object_name = 'firmware'

    def get_context_data(self, **kwargs):
        context = super(FirmwareDetailView, self).get_context_data(**kwargs)
        context['menuitem'] = 'firmware'
        return context


class FirmwareListView(ListView):
    model = Firmware
    context_object_name = 'firmwares'

    def get_context_data(self, **kwargs):
        context = super(FirmwareListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'firmware'
        return context


class FirmwareUpdateView(SuccessMessageMixin, UpdateView):
    model = Firmware
    fields = ['platform', 'file', 'description']
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
        return f"Firmware {instance.file.name} successfully modified! File size is {instance.filesize:n} bytes. " \
               f"MD5 hash is {instance.md5_hash}. SHA512 hash is {instance.sha512_hash}."


class PlatformCreateView(CreateView):
    model = Platform
    fields = ['vendor', 'name', 'description']
    context_object_name = 'platform'
    success_url = reverse_lazy('platformList')

    def get_context_data(self, **kwargs):
        context = super(PlatformCreateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'platform'
        return context


class PlatformDeleteView(DeleteView):
    model = Platform
    context_object_name = 'platform'
    success_url = reverse_lazy('platformList')

    def get_context_data(self, **kwargs):
        context = super(PlatformDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'platform'
        return context


class PlatformListView(ListView):
    model = Platform
    context_object_name = 'platforms'

    def get_context_data(self, **kwargs):
        context = super(PlatformListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'platform'
        return context


class PlatformUpdateView(UpdateView):
    model = Platform
    fields = ['vendor', 'name', 'description']
    context_object_name = 'platform'
    success_url = reverse_lazy('platformList')

    def get_context_data(self, **kwargs):
        context = super(PlatformUpdateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'platform'
        return context


class VendorCreateView(CreateView):
    model = Vendor
    fields = ['name', 'description']
    context_object_name = 'vendor'
    success_url = reverse_lazy('vendorList')

    def get_context_data(self, **kwargs):
        context = super(VendorCreateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context


class VendorDeleteView(DeleteView):
    model = Vendor
    context_object_name = 'vendor'
    success_url = reverse_lazy('vendorList')

    def get_context_data(self, **kwargs):
        context = super(VendorDeleteView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context


class VendorListView(ListView):
    model = Vendor
    context_object_name = 'vendors'

    def get_context_data(self, **kwargs):
        context = super(VendorListView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context


class VendorUpdateView(UpdateView):
    model = Vendor
    fields = ['name', 'description']
    context_object_name = 'vendor'
    success_url = reverse_lazy('vendorList')

    def get_context_data(self, **kwargs):
        context = super(VendorUpdateView, self).get_context_data(**kwargs)
        context['menuitem'] = 'vendor'
        return context
