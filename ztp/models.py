import hashlib
import os

from django.core.files.storage import FileSystemStorage
from django.core.validators import RegexValidator
from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.urls import reverse_lazy

from django.utils.translation import gettext_lazy as _

from logs.registry import model_change_logger
from utils.models import DateUserBaseModel


@model_change_logger.register(include_fields=['name', 'description'])
class Vendor(DateUserBaseModel):
    name = models.CharField(_('name'), max_length=50,
                            unique=True)
    description = models.TextField(_('description'), blank=True)

    def __str__(self):
        return self.name

    @property
    def url_delete(self):
        return reverse_lazy('vendorDelete', kwargs={'pk': self.id}) if self.platforms.count() == 0 else None

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
        verbose_name = _('Vendor')
        verbose_name_plural = _('Vendors')


@model_change_logger.register(include_fields=['vendor', 'name', 'description'])
class Platform(DateUserBaseModel):
    vendor = models.ForeignKey(Vendor,
                               related_name='platforms',
                               on_delete=models.PROTECT)
    name = models.CharField(_('name'), max_length=50)
    description = models.TextField(_('description'), blank=True)


    def __str__(self):
        return self.name

    @property
    def url_delete(self):
        return reverse_lazy('platformDelete', kwargs={'pk': self.id}) if self.firmwares.count() == 0 else None

    @property
    def url_detail(self):
        return reverse_lazy('platformDetail', kwargs={'pk': self.id})

    @property
    def url_update(self):
        return reverse_lazy('platformUpdate', kwargs={'pk': self.id})

    class Meta:
        unique_together = ('vendor', 'name',)
        permissions = (
            ('list_platform', _('Can list platform')),
        )
        verbose_name = _('Platform')
        verbose_name_plural = _('Platforms')


@model_change_logger.register(include_fields=['file', 'description', 'filesize', 'md5_hash', 'sha512_hash'])
class Firmware(DateUserBaseModel):
    file = models.FileField(_('file'), unique=True,
                            storage=FileSystemStorage(location=settings.ZTP_FIRMWARES_PATH,
                                                      base_url=f'/{settings.ZTP_FIRMWARES_URL}'))
    description = models.TextField(_('description'), blank=True)
    filesize = models.IntegerField(_('filesize'))
    md5_hash = models.CharField(_('MD5 hash'), max_length=32)
    sha512_hash = models.CharField(_('SHA512 hash'), max_length=128)
    platforms = models.ManyToManyField(Platform,
                                       verbose_name=_('supported platforms'),
                                       related_name='firmwares',
                                       through='PlatformFirmwareSupport',
                                       blank=True)

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
    def name(self):
        return self.file.name

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
        verbose_name = _('Firmware')
        verbose_name_plural = _('Firmwares')

@model_change_logger.register(include_fields=['platform', 'firmware', 'is_default'])
class PlatformFirmwareSupport(DateUserBaseModel):
    platform = models.ForeignKey(Platform, on_delete=models.CASCADE)
    firmware = models.ForeignKey(Firmware, on_delete=models.CASCADE)
    is_default = models.BooleanField(null=True)

    def __str__(self):
        return f'{self.firmware.name}: {self.platform.name}'

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['platform', 'is_default'], name='unique default firmware')
        ]


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


class Languages:
    CHOICES = [
        ('clike', 'C-like (C, C++, C#, Java, Kotlin, ...)'),
        ('go', 'Go'),
        ('javascript', 'Javascript'),
        ('perl', 'Perl'),
        ('php', 'PHP'),
        ('python', 'Python'),
        ('ruby', 'Ruby'),
        ('rust', 'Rust'),
        ('tcl', 'Tcl'),
        ('xml', 'XML'),
        ('yaml', 'YAML'),
    ]


@model_change_logger.register(include_fields=['name', 'description',
                                              'language', 'template'])
class Config(DateUserBaseModel):
    configNameValidator = RegexValidator(
        r'^[0-9a-zA-Z._-]+$',
        'Only alphanumeric characters, dot ".", underscore "_", and hyphen "-" symbols are allowed.')

    name = models.CharField(_('name'), max_length=50,
                            validators=[configNameValidator],
                            unique=True)
    language = models.CharField(_('language'),
                                max_length=15,
                                choices=Languages.CHOICES,
                                blank=True)
    template = models.TextField(_('template'), blank=True)
    description = models.TextField(_('description'), blank=True)

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
        verbose_name = _('Configuration')
        verbose_name_plural = _('Configurations')


@model_change_logger.register(include_fields=['config', 'name', 'data', 'description', 'is_mandatory'])
class ConfigParameter(DateUserBaseModel):
    configParameterNameValidator = RegexValidator(r'^[a-zA-Z_][0-9a-zA-Z._-]*$',
                                                  'Only alphanumeric characters, dot ".", underscore "_", and hyphen '
                                                  '"-" symbols are allowed.')

    config = models.ForeignKey(Config,
                               related_name='parameters',
                               on_delete=models.CASCADE)
    name = models.CharField(_('name'), max_length=50,
                            blank=False,
                            validators=[configParameterNameValidator])
    data = models.TextField(_('data'), blank=True)
    is_mandatory = models.BooleanField(_('mandatory parameter'),
                                       blank=False,
                                       default=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('config', 'name',)
        verbose_name = _("Configuration's parameter")
        verbose_name_plural = _("Configuration's parameters")


@model_change_logger.register(include_fields=['name', 'description', 'language',
                                              'template', 'render_template',
                                              'use_parameters',
                                              'accept_query_string',
                                              'priority_query_string_over_arguments'])
class ZtpScript(DateUserBaseModel):
    ztpNameValidator = RegexValidator(
        r'^[0-9a-zA-Z._-]+$',
        'Only alphanumeric characters, dot ".", underscore "_", and hyphen "-" symbols are allowed.')

    name = models.CharField(_('name'), max_length=50,
                            validators=[ztpNameValidator],
                            unique=True)
    render_template = models.BooleanField(_('render template'), blank=False,
                                          default=True)
    use_parameters = models.BooleanField(_('use parameters'), blank=False,
                                         default=True)
    accept_query_string = models.BooleanField(_('accept_query_string'), blank=False,
                                              default=False)
    priority_query_string_over_arguments = models.BooleanField(_('priority query string over arguments'),
                                                               blank=False,
                                                               default=False)
    language = models.CharField(_('language'),
                                max_length=15,
                                choices=Languages.CHOICES,
                                blank=True)
    template = models.TextField(_('template'), blank=True)
    description = models.TextField(_('description'), blank=True)

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
        verbose_name = _('ZTP script')
        verbose_name_plural = _('ZTP scripts')


@model_change_logger.register(include_fields=['ztpScript', 'name', 'value'])
class ZtpParameter(DateUserBaseModel):
    ztpParameterNameValidator = RegexValidator(r'^[a-zA-Z_][0-9a-zA-Z._-]*$',
                                               'Only alphanumeric characters, dot ".", underscore "_", and hyphen "-" '
                                               'symbols are allowed.')

    ztpScript = models.ForeignKey(ZtpScript,
                                  related_name='parameters',
                                  on_delete=models.CASCADE)
    name = models.CharField(_('name'), max_length=50,
                            blank=False,
                            validators=[ztpParameterNameValidator])
    value = models.CharField(_('value'), max_length=200,
                             blank=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('ztpScript', 'name',)
        verbose_name = _("ZTP script's parameter")
        verbose_name_plural = _("ZTP script's parameters")
