from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.views import Token
from django.conf import settings

class User(AbstractUser):
    is_user = models.BooleanField('Is user', default=False)
    is_agencija = models.BooleanField('Is agencija', default=True)

    def __str__(self):
        return self.username

class Agencija(models.Model):
    user = models.OneToOneField(User, related_name="agencija", on_delete=models.CASCADE)
    username = models.CharField(max_length=100, null=False, blank=True)        # ID agencija
    naziv_agencije = models.CharField(max_length=100, null=False, blank=True)  # naziv agencije
    email = models.EmailField(null=False, blank=True)
    datum_osnivanja = models.DateField(null=True, blank=True)
    password = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.username

class Korisnik(models.Model):
    user = models.OneToOneField(User, related_name="korisnik", on_delete=models.CASCADE)
    first_name = models.CharField(max_length=40, null=True, blank=True)
    last_name = models.CharField(max_length=40, null=True, blank=True)
    username = models.CharField(max_length=40, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    password = models.CharField(max_length=40, null=True, blank=True)

    def __str__(self):
        return self.username

class MojePutovanje(models.Model):
    korisnik = models.ForeignKey(Korisnik, on_delete=models.CASCADE)
    agencija = models.ForeignKey(Agencija, on_delete=models.CASCADE)
    naslov = models.CharField(max_length=150)
    slika = models.CharField(max_length=255, null=True)
    opis = models.CharField(max_length=255)
    datum = models.DateField(null=True)
    
    class Tipovi1(models.IntegerChoices):
        SAMOSTALNO = 1
        ORGANIZOVANO = 2
  
    tip1 = models.IntegerField(choices=Tipovi1.choices)

    prevoz = models.CharField(max_length=255)

    def __str__(self):
        return self.opis

class PlaniranaPutovanja(models.Model):
    agencija = models.ForeignKey(Agencija, on_delete=models.CASCADE, related_name='agencija')
    naslov = models.CharField(max_length=150)
    opis = models.CharField(max_length=255)
    datum = models.DateField()

    def __str__(self):
        return self.naslov

class Zahtjev(models.Model):
    korisnik = models.ForeignKey(Korisnik, on_delete=models.CASCADE)
    putovanje = models.ForeignKey(PlaniranaPutovanja, on_delete=models.CASCADE)
    
    class Tipovi(models.IntegerChoices):
        CEKANJE = 1
        ODOBRENO = 2
        ODBIJENO = 3
  
    tip = models.IntegerField(choices=Tipovi.choices)