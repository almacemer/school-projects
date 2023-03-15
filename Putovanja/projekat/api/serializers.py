from rest_framework import serializers
from .models import Agencija, Korisnik, PlaniranaPutovanja, User, MojePutovanje, Zahtjev
from rest_framework.validators import UniqueValidator
from geopy.geocoders import Nominatim

geolocator = Nominatim(user_agent='api')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields=['username', 'email', 'is_agencija', 'is_user']

class AgencijaSerializer(serializers.ModelSerializer):
    password2=serializers.CharField(style={"input_type":"password"}, write_only=True)
    datum_osnivanja = serializers.DateField(input_formats=['%Y-%m-%d']) 
    class Meta:
        model = Agencija
        fields = ['id', 'username', 'naziv_agencije', 'email', 'datum_osnivanja', 'password', 'password2']

        extra_kwargs = {
        'password': {
            'write_only':True,
            'required':True
            }
        }
    
    def create(self, validated_data):
        agencija=Agencija(
            username = validated_data['username'],
            naziv_agencije = validated_data['naziv_agencije'],
            email = validated_data['email'],
            datum_osnivanja = validated_data['datum_osnivanja']
        )
        return Agencija(**validated_data)
    
    def save(self, **kwargs):
        user=User(
            username = self.validated_data['username'],
            email = self.validated_data['email']
        )
    
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({"error": "password is not same"})
        
        user.set_password(password)
        user.is_agencija=True
        user.is_user=False
        user.save()
        Agencija.objects.create(user=user).save()
        return user

class KorisnikSerializer(serializers.ModelSerializer):
    
    password2=serializers.CharField(style={"input_type":"password"}, write_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password', 'password2']

        extra_kwargs = {
        'password': {
            'write_only':True,
            'required':True
            }
        }
    
    
    def save(self, **kwargs):
        user=User(
            username = self.validated_data['username'],
            email = self.validated_data['email']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({"error": "password is not same"})
        user.set_password(password)
        user.is_user=True
        user.is_agencija=False
        user.save()
        Korisnik.objects.create(user=user)
        return user

class MojePutovanjeSerializer(serializers.ModelSerializer):
    #datum = serializers.DateField(input_formats=['%Y-%m-%d']) 
    #slika = serializers.ImageField(source='*', read_only=True)
    naslov = serializers.CharField(max_length=255)

    class Meta:
        model = MojePutovanje
        fields = '__all__'


class PlaniranaPutovanjaSerializer(serializers.ModelSerializer):
    datum = serializers.DateField(input_formats=['%Y-%m-%d'])
    naslov = serializers.CharField(max_length=255)

    class Meta:
        model = PlaniranaPutovanja
        fields = '__all__'
    
class ZahtjevSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zahtjev
        fields = '__all__'