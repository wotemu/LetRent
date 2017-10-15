from mptt.templatetags.mptt_tags import cache_tree_children
from rest_framework import generics
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings

from ..models import Account, Property, PropertyCategory
from ..serializers import PropertySerializer, AccountSerializer, PropertyDetailSerializer, \
    build_nested_category_tree


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
        prop_cat_slug = self.request.GET.get("prop_cat_slug")
        query = self.request.GET.get("q")
        if query:
            return Property.objects.search(query)
        elif prop_cat_slug:
            return Property.objects.search(property_category_slug=prop_cat_slug)
        return Property.objects.all()


class PropertyDetail(generics.RetrieveAPIView):
    serializer_class = PropertyDetailSerializer
    lookup_field = 'slug'
    permission_classes = []
    authentication_classes = []

    def get_queryset(self):
        return Property.objects.all_with_images()


class PropertyCategoryView(APIView):
    # Firstly get all categories from DB, then cache them, then build a hierarchical category tree
    def get(self, request, **kwargs):
        root_nodes = cache_tree_children(PropertyCategory.objects.all())
        category_tree = build_nested_category_tree(root_nodes)
        return Response(category_tree)
