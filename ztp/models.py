from django.core.files.storage import FileSystemStorage
from django.core.validators import RegexValidator
from django.conf import settings
from django.db import models
from django.dispatch import receiver

import hashlib
import os


class Vendor(models.Model):
    name = models.CharField(max_length=50,
                            unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Platform(models.Model):
    vendor = models.ForeignKey(Vendor,
                               related_name='platforms',
                               on_delete=models.PROTECT)
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('vendor', 'name',)


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


class ZtpScript(models.Model):
    ztpNameValidator = RegexValidator(r'^[0-9a-zA-Z._-]+$', 'Only alphanumeric characters, dot ".", underscore "_", and hyphen "-" symbols are allowed.')

    name = models.CharField(max_length=50,
                            validators=[ztpNameValidator],
                            unique=True)
    accept_query_string = models.BooleanField(blank=False,
                                              default=False)
    template = models.TextField()
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
