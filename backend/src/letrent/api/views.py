from numpy import unicode
from rest_framework import generics
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings

from ..serializers import PropertySerializer, AccountSerializer, PropertyDetailSerializer, VideoSerializer, VideoDetailSerializer
from ..models import Video, Account, Property


class Login(APIView):
    # authentication_classes = (SessionAuthentication, BasicAuthentication)
    # permission_classes = (IsAuthenticated,)
    def post(self, request, format=None):
        content = {
            'user': unicode(request.user),  # `django.contrib.auth.User` instance.
            'auth': unicode(request.auth),  # None
        }
        return Response([])


class RegisterUser(CreateAPIView):
    serializer_class = AccountSerializer
    permission_classes = (AllowAny,)
    model = Account.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        # TODO: Add validation through serializer
        if serializer.is_valid():
            serializer.save()

            headers = self.get_success_headers(serializer.data)
            account = self.model.get(email=serializer.data['email'])
            account_serializer = self.serializer_class(data=account)

            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

            payload = jwt_payload_handler(account)
            token = jwt_encode_handler(payload)

            return Response({'token': token}, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PropertyList(generics.ListAPIView):
    serializer_class = PropertySerializer
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        query = self.request.GET.get("q")
        if query:
            return Property.objects.search(query)
        return Property.objects.all()


class PropertyDetail(generics.RetrieveAPIView):
    serializer_class = PropertyDetailSerializer
    lookup_field = 'slug'
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        return Property.objects.all()


class VideoList(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        query = self.request.GET.get("q")
        if query:
            # qs = Video.objects.filter(name__icontains=query)
            qs = Video.objects.search(query)
        else:
            qs = Video.objects.all()
        return qs


class VideoDetail(generics.RetrieveAPIView):
    # queryset                = Video.objects.all()
    serializer_class = VideoDetailSerializer
    lookup_field = 'slug'
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        return Video.objects.all()


class VideoFeatured(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        query = self.request.GET.get("q")
        if query:
            qs = Video.objects.featured().search(query)
        else:
            qs = Video.objects.featured()
        return qs
