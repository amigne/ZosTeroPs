from django.core.files.storage import FileSystemStorage
from django.core.validators import RegexValidator
from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _

import hashlib
import json
import os


class Vendor(models.Model):
    name = models.CharField(max_length=50,
                            unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    @property
    def url_delete(self):
        return reverse_lazy('vendorDelete', kwargs={'pk': self.id})

    @property
    def url_detail(self):
        return None
        # return reverse_lazy('vendorDetail', kwargs={'pk': self.id})

    @property
    def url_update(self):
        return reverse_lazy('vendorUpdate', kwargs={'pk': self.id})

    class Meta:
        permissions = (
            ('list_vendor', _('Can list vendor')),
        )


class Platform(models.Model):
    vendor = models.ForeignKey(Vendor,
                               related_name='platforms',
                               on_delete=models.PROTECT)
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    @property
    def url_delete(self):
        return reverse_lazy('platformDelete', kwargs={'pk': self.id})

    @property
    def url_detail(self):
        return None
        # return reverse_lazy('platformDetail', kwargs={'pk': self.id})

    @property
    def url_update(self):
        return reverse_lazy('platformUpdate', kwargs={'pk': self.id})

    class Meta:
        unique_together = ('vendor', 'name',)
        permissions = (
            ('list_platform', _('Can list platform')),
        )

class Firmware(models.Model):
    platform = models.ForeignKey(Platform,
                                 related_name='firmwares',
                                 on_delete=models.CASCADE)
    file = models.FileField(unique=True,
                            storage=FileSystemStorage(location=settings.ZTP_FIRMWARES_PATH,
                                                      base_url=settings.ZTP_FIRMWARES_URL))
    description = models.TextField(blank=True)
    filesize = models.IntegerField()
    md5_hash = models.CharField(max_length=32)
    sha512_hash = models.CharField(max_length=128)

    def __str__(self):
        return self.file.name

    def save(self, **kwargs):
        self.filesize = self.file.size
        md5 = hashlib.md5()
        sha512 = hashlib.sha512()
        content = self.file.read()
        md5.update(content)
        sha512.update(content)
        self.md5_hash = md5.hexdigest()
        self.sha512_hash = sha512.hexdigest()
        super().save(**kwargs)

    @property
    def url_delete(self):
        return reverse_lazy('firmwareDelete', kwargs={'pk': self.id})

    @property
    def url_detail(self):
        return reverse_lazy('firmwareDetail', kwargs={'pk': self.id})

    @property
    def url_update(self):
        return reverse_lazy('firmwareUpdate', kwargs={'pk': self.id})

    class Meta:
        permissions = (
            ('list_firmware', _('Can list firmware')),
        )


@receiver(models.signals.post_delete, sender=Firmware)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.file:
        if os.path.isfile(instance.file.path):
            os.remove(instance.file.path)


@receiver(models.signals.pre_save, sender=Firmware)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `MediaFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False

    try:
        old_file = Firmware.objects.get(pk=instance.pk).file
    except Firmware.DoesNotExist:
        return False

    new_file = instance.file
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)


class Config(models.Model):
    configNameValidator = RegexValidator(
        r'^[0-9a-zA-Z._-]+$',
        'Only alphanumeric characters, dot ".", underscore "_", and hyphen "-" symbols are allowed.')

    name = models.CharField(max_length=50,
                            validators=[configNameValidator],
                            unique=True)
    template = models.TextField()
    description = models.TextField(blank=True)

    def data_to_dict(self):
        result = dict()
        for parameter in self.parameters.all():
            result.update(parameter.data_to_dict())
        return result

    def __str__(self):
        return self.name

    @property
    def url_delete(self):
        return reverse_lazy('configDelete', kwargs={'pk': self.id})

    @property
    def url_detail(self):
        return reverse_lazy('configDetail', kwargs={'pk': self.id})

    @property
    def url_update(self):
        return reverse_lazy('configUpdate', kwargs={'pk': self.id})

    class Meta:
        permissions = (
            ('list_config', _('Can list config')),
        )


class ConfigParameter(models.Model):
    configParameterNameValidator = RegexValidator(r'^[a-zA-Z_][0-9a-zA-Z._-]*$',
                                                  'Only alphanumeric characters, dot ".", underscore "_", and hyphen "-" symbols are allowed.')

    config = models.ForeignKey(Config,
                               related_name='parameters',
                               on_delete=models.CASCADE)
    name = models.CharField(max_length=50,
                            blank=False,
                            validators=[configParameterNameValidator])
    data = models.TextField(blank=True)


    # TODO: Function to move out of the class
    def index_to_column_name(self, index):
        result = ''
        while result == '' or (index >= 0):
            r = index % 26
            result = chr(65 + r) + result
            index = (index // 26) - 1

        return result


    # TODO: Logic to move out of the class
    def data_to_dict(self):
        result = dict()

        if self.data == '': return result
        data_dict = json.loads(self.data)

        columns = (data_dict['columns'] if 'columns' in data_dict else {'columns': {}})
        columns_count = len(columns)
        columns_name = []
        for index in range(columns_count):
            title = columns[index]['title']
            if title == '':
                title = self.index_to_column_name(index)
            columns_name.append(title)

        parameter_name = self.name
        if not parameter_name:
            parameter_name = columns_name[0]
        elif parameter_name != columns_name[0]:
            columns_name[0] = parameter_name

        result[parameter_name] = dict()

        data_rows = data_dict['data'] if 'data' in data_dict else {}

        for data_row in data_rows:
            columns_in_row = len(data_row)

            if columns_in_row == 0:
                continue

            data_row_dict = dict()

            empty = True # Empty rows are not inserted in the result
            for index in range(min(len(columns_name), columns_in_row)):
                if index == 0:
                    key = data_row[index]
                else:
                    data_row_dict[columns_name[index]] = data_row[index]
                if data_row[index]:
                    empty = False
                index += 1

            if not empty:
                result[parameter_name][key] = data_row_dict

        return result

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('config', 'name',)


class ZtpScript(models.Model):
    ztpNameValidator = RegexValidator(
        r'^[0-9a-zA-Z._-]+$',
        'Only alphanumeric characters, dot ".", underscore "_", and hyphen "-" symbols are allowed.')

    name = models.CharField(max_length=50,
                            validators=[ztpNameValidator],
                            unique=True)
    render_template = models.BooleanField(blank=False,
                                          default=True)
    use_parameters = models.BooleanField(blank=False,
                                         default=True)
    accept_query_string = models.BooleanField(blank=False,
                                              default=False)
    priority_query_string_over_arguments = models.BooleanField(blank=False,
                                                               default=False)
    template = models.TextField()
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    @property
    def url_delete(self):
        return reverse_lazy('ztpDelete', kwargs={'pk': self.id})

    @property
    def url_detail(self):
        return reverse_lazy('ztpDetail', kwargs={'pk': self.id})

    @property
    def url_update(self):
        return reverse_lazy('ztpUpdate', kwargs={'pk': self.id})

    class Meta:
        permissions = (
            ('list_ztpscript', _('Can list ztp script')),
        )


class ZtpParameter(models.Model):
    ztpParameterNameValidator = RegexValidator(r'^[a-zA-Z_][0-9a-zA-Z._-]*$',
                                               'Only alphanumeric characters, dot ".", underscore "_", and hyphen "-" symbols are allowed.')

    ztpScript = models.ForeignKey(ZtpScript,
                                  related_name='parameters',
                                  on_delete=models.CASCADE)
    name = models.CharField(max_length=50,
                            blank=False,
                            validators=[ztpParameterNameValidator])
    value = models.CharField(max_length=200,
                             blank=True)

    def __str__(self):
        return self.value

    class Meta:
        unique_together = ('ztpScript', 'name',)
