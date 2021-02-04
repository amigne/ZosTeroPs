from django.db import models


class Vendor(models.Model):
    name = models.CharField(max_length=50)
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


class Firmware(models.Model):
    platform = models.ForeignKey(Platform,
                                 related_name='firmwares',
                                 on_delete=models.CASCADE)
    filename = models.CharField(max_length=250)
    md5_hash = models.CharField(max_length=32)
    sh512_hash = models.CharField(max_length=128)

    def __str__(self):
        return self.filename
