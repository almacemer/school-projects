from ast import Delete
from .models import Agencija, MojePutovanje, PlaniranaPutovanja, Zahtjev, Korisnik
from .serializers import AgencijaSerializer, KorisnikSerializer, MojePutovanjeSerializer, UserSerializer, PlaniranaPutovanjaSerializer, ZahtjevSerializer
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.views import Token, ObtainAuthToken
from rest_framework.views import APIView
from django.contrib.auth.views import PasswordResetView
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta

class AgencijaView(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        serializer = AgencijaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user":UserSerializer(user, context=self.get_serializer_context()).data,
            "token":Token.objects.get(user=user).key,
            "message": "account created successfully"
        })
    
    def get(self, request, id):
        agencija = Agencija.objects.filter(id=id).all() 
        serializer = AgencijaSerializer(agencija, many=True)
        return Response(serializer.data)

    def get(self, request):
        agencija = Agencija.objects.all() 
        serializer = AgencijaSerializer(agencija, many=True)
        return Response(serializer.data)

class KorisnikView(generics.GenericAPIView):
    
    serializer_class = KorisnikSerializer

    def post(self, request, *args, **kwargs):
        serializer = KorisnikSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user":UserSerializer(user, context=self.get_serializer_context()).data,
            "token":Token.objects.get(user=user).key,
            "message": "account created successfully"
        })

class KorisnikViewId(generics.GenericAPIView):
    def get(self, request, id):
        korisnik = Korisnik.objects.filter(user_id=id).only() 
        serializer = KorisnikSerializer(korisnik, many=True)
        return Response(serializer.data)

class AgencijaViewId(generics.GenericAPIView):
    def get(self, request, id):
        agencija = Agencija.objects.filter(user_id=id).only() 
        serializer = AgencijaSerializer(agencija, many=True)
        return Response(serializer.data)
    
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})      
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'id': user.id,
            'user_id': user.pk,
            'is_agencija': user.is_agencija,
        })

class PasswordResetView(PasswordResetView):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        request.csrf_processing_done = True
        return super().dispatch(request, *args, **kwargs)

class LogoutView(APIView):
    def post(self, request, format=None):
        request.auth.delete()
        return Response(status=status.HTTP_200_OK)


class MojePutovanjeView(generics.GenericAPIView):
    def post(self, request):
        serialiezer = MojePutovanjeSerializer(data=request.data)
        if serialiezer.is_valid():
            serialiezer.save()
            return Response(serialiezer.data, status=status.HTTP_201_CREATED)
        return Response(serialiezer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, id):
        enddate = datetime.today()
        startdate = enddate - timedelta(days=30)
        putovanja = MojePutovanje.objects.filter(korisnik=id, datum__range=[startdate, enddate]).all()
        if putovanja == []:
            putovanja = MojePutovanje.objects.filter(agencija=id).all()
        serializer = MojePutovanjeSerializer(putovanja, many=True)
        return Response(serializer.data)

class MojePutovanjeAgencijaView(generics.GenericAPIView):
    def get(self, request, id):
        putovanja = MojePutovanje.objects.filter(agencija=id).all().order_by('naslov')
        serializer = MojePutovanjeSerializer(putovanja, many=True)
        return Response(serializer.data)

class MojePutovanjeKorisnikView(generics.GenericAPIView):
    def get(self, request, id):
        putovanja = MojePutovanje.objects.filter(korisnik=id).all().order_by('naslov')
        serializer = MojePutovanjeSerializer(putovanja, many=True)
        return Response(serializer.data)

class PlaniranaPutovanjaView(generics.GenericAPIView):
    def post(self, request):
        serialiezer = PlaniranaPutovanjaSerializer(data=request.data)
        if serialiezer.is_valid():
            serialiezer.save()
            print(serialiezer.data)
            return Response(serialiezer.data, status=status.HTTP_201_CREATED)
        return Response(serialiezer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, id):
        putovanja = PlaniranaPutovanja.objects.filter(agencija=id).all() 
        serializer = PlaniranaPutovanjaSerializer(putovanja, many=True)
        return Response(serializer.data)
    
    def get(self, request):
        putovanja = PlaniranaPutovanja.objects.all() 
        serializer = PlaniranaPutovanjaSerializer(putovanja, many=True)
        return Response(serializer.data)
    
    
    def delete(self, request, id):
        post = PlaniranaPutovanja.objects.get(id=id)
        post.delete()
        posts = PlaniranaPutovanja.objects.all() 
        serializer = PlaniranaPutovanjaSerializer(posts, many=True)
        return Response(serializer.data)

class ZahtjevView(generics.GenericAPIView):
    def post(self, request):
        serialiezer = ZahtjevSerializer(data=request.data)
        if serialiezer.is_valid():
            serialiezer.save()
            print(serialiezer.data)
            return Response(serialiezer.data, status=status.HTTP_201_CREATED)
        return Response(serialiezer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, id, tip):
        zahtjevi = Zahtjev.objects.filter(korisnik=id, tip=tip).all() 
        serializer = ZahtjevSerializer(zahtjevi, many=True)
        return Response(serializer.data)
    