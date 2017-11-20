from mptt.templatetags.mptt_tags import cache_tree_children
from rest_framework import generics
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.exceptions import NotAcceptable
from django.db.models import Q

from ..models import Account, Property, PropertyCategory, Chat, Message, create_message
from ..serializers import PropertySerializer, AccountSerializer, PropertyDetailSerializer, \
    ChatSerializer, MessageSerializer, build_nested_category_tree


class UserUpdateProfile(APIView):
    """
    Update an user instance.
    """
    serializer_class = AccountSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)
    model = Account.objects.all()

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    pagination_class = PageNumberPagination

    def get_queryset(self):
        get_param = lambda key: self.request.GET.get(key)

        order_by = get_param('order_by')
        price_from = int(get_param('priceFrom')) if get_param('priceFrom') else None
        price_to = int(get_param('priceTo')) if get_param('priceTo') else None
        query = self.request.GET.get("q")
        category_ids = get_param('categoryIds')
        category_ids = category_ids.split(',') if category_ids else []

        return Property.objects.search(category_ids=category_ids,
                                       price_from=price_from, price_to=price_to,
                                       query=query,
                                       order_by=order_by)


class PropertyDetail(generics.RetrieveAPIView):
    serializer_class = PropertyDetailSerializer
    lookup_field = 'slug'
    permission_classes = []
    authentication_classes = (JSONWebTokenAuthentication,)

    def get_queryset(self):
        return Property.objects.all_with_images()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        serialized_data = serializer.data

        # Include related chat info
        user_id = request.user.id
        if user_id:
            chat = Chat.objects.filter((Q(from_user_id=user_id) & Q(property_id=instance.id))).first()
            if chat:
                serialized_data['chat'] = ChatSerializer(chat).data
        return Response(serialized_data)


class PropertyCategoryView(APIView):
    # Firstly get all categories from DB, then cache them, then build a hierarchical category tree
    def get(self, request, **kwargs):
        results = PropertyCategory.objects.all().order_by('position')
        root_nodes = cache_tree_children(results)
        category_tree = build_nested_category_tree(root_nodes)
        return Response(category_tree)


class ChatsListHandler(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, **kwargs):
        user_id = request.user.id
        query_set = Chat.objects \
            .filter((Q(from_user_id=user_id) | Q(to_user_id=user_id))) \
            .order_by('created_at')
        data = ChatSerializer(query_set, many=True).data
        return Response(data)


class ChatMessagesHandler(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, chat_id):
        user_id = request.user.id

        query_set = Message.objects \
            .filter((Q(chat__from_user_id=user_id) | Q(chat__to_user_id=user_id)) & Q(chat_id=chat_id)) \
            .order_by('created_at')
        data = MessageSerializer(query_set, many=True).data

        # Mark messages as "Read"
        try:
            m = Message.objects.get(Q(chat_id=chat_id) & ~Q(from_user_id=user_id))
            m.is_read = True
            m.save()
        except Message.DoesNotExist:
            pass

        return Response(data)


class AddMessageToChatHandler(generics.ListCreateAPIView):
    model = Message
    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        chat_id = int(kwargs.get('chat_id'))
        user_id = request.user.id
        message_body = request.data['message']

        related_chat = Chat.objects.filter((Q(from_user_id=user_id) | Q(to_user_id=user_id)) & Q(id=chat_id))[:1]
        if related_chat.count() == 0:
            raise NotAcceptable('You try to post message in non-related group')

        message = create_message(chat_id, user_id, message_body)

        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CreateChatHandler(generics.ListCreateAPIView):
    model = Chat
    serializer_class = ChatSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        user_id = request.user.id
        property_id = request.data['property_id']
        message = request.data['message'] if 'message' in request.data else None

        # Check if the chat is not created
        existing_chat = Chat.objects.filter((Q(from_user_id=user_id) & Q(property_id=property_id)))
        if existing_chat.count() > 0:
            raise NotAcceptable('Chat already exists. Please, go to Chats')

        _property = Property.objects.get(id=property_id)
        if not _property:
            raise NotAcceptable('Property does not exist')

        chat = Chat(property=_property, from_user_id=user_id, to_user_id=_property.owner_id)
        chat.save()

        if message:
            create_message(chat.id, user_id, request.data['message'])

        serializer = ChatSerializer(chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
