from django.urls import path
from .views import PasswordResetView, AgencijaView, CustomAuthToken, KorisnikView, MojePutovanjeView, PlaniranaPutovanjaView, ZahtjevView, KorisnikViewId, AgencijaViewId, MojePutovanjeAgencijaView, MojePutovanjeKorisnikView
from django.contrib.auth.views import PasswordResetDoneView, PasswordResetConfirmView, PasswordResetCompleteView
from django.urls import reverse_lazy

urlpatterns = [

    path('api/korisnik/', KorisnikView.as_view()),
    path('api/agencija/<int:id>/', AgencijaView.as_view()),
    path('api/agencija/', AgencijaView.as_view()),
    path('api/sveagencije/', AgencijaView.as_view()),
    path('login/', CustomAuthToken.as_view(), name='auth-token'),

    path('spremi/mojeputovanje/', MojePutovanjeView.as_view()),
    path('mojeputovanjeAgencija/<int:id>/', MojePutovanjeAgencijaView.as_view()),
    path('mojeputovanjeKorisnik/<int:id>/', MojePutovanjeKorisnikView.as_view()),
    path('home/<int:id>/', MojePutovanjeView.as_view()),
    path('reset-password/', PasswordResetView.as_view(success_url=reverse_lazy('crm:password_reset_confirm')), name='reset_password'),
    path('reset-password/done/', PasswordResetDoneView.as_view(), name='reset_password_done'),
    path('reset-password/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset-password/complete/', PasswordResetCompleteView.as_view(), name='reset_password_complete'),
    
    path('spremi/planiranoputovanje/', PlaniranaPutovanjaView.as_view()),
    path('planiranaputovanja/', PlaniranaPutovanjaView.as_view()),
    path('planiranaputovanja/agencija/<int:id>/', PlaniranaPutovanjaView.as_view()),
    path('obrisi/planiranaputovanja/<int:id>/', PlaniranaPutovanjaView.as_view()),
    path('spremi/zahtjev/', ZahtjevView.as_view()),
    path('zahtjevi/<int:id>/<int:tip>/', ZahtjevView.as_view()),

    #id
    path('korisnikId/<int:id>/', KorisnikViewId.as_view()),
    path('agencijaId/<int:id>/', AgencijaViewId.as_view())
]