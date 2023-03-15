from django.contrib import admin
from .models import User, Agencija, Korisnik, MojePutovanje
from django.contrib.auth.admin import UserAdmin
admin.site.register(User)
admin.site.register(Agencija)
admin.site.register(Korisnik)


@admin.register(MojePutovanje)
class MojePutovanjeModel(admin.ModelAdmin):
    list_filter = ('korisnik','agencija', 'naslov', 'slika', 'opis', 'datum', 'tip1', 'prevoz')
    list_display = ('korisnik','agencija', 'naslov', 'slika', 'opis', 'datum', 'tip1', 'prevoz')
# Register your models here.

class AgencijaInline(admin.StackedInline):
    model = Agencija
    can_delete = True

class AccUserAdmin(UserAdmin):
    inlines = [AgencijaInline]

admin.site.unregister(User)
admin.site.register(User, AccUserAdmin)