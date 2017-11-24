import os.path
from mptt.templatetags.mptt_tags import cache_tree_children
from rest_framework import generics
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.pagination import PageNumberPagination
from django.core.files.storage import FileSystemStorage
from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.exceptions import NotAcceptable
from django.db.models import Q

from ..models import Account, Property, PropertyCategory, Chat, Message, create_message, Comment
from ..serializers import AccountSerializer, \
    PropertySerializer, PropertyDetailSerializer, PropertyModificationSerializer, \
    ChatSerializer, MessageSerializer, CommentSerializer,\
    build_nested_category_tree


class RegisterUser(CreateAPIView):
    """
    Register a new user.
    """
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


class UpdateProfile(APIView):
    """
    Update an user instance.
    """
    serializer_class = AccountSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request, *args, **kwargs):
        data = request.data
        avatar_file = request.FILES['avatar'] if 'avatar' in request.FILES else None

        serializer = self.serializer_class(request.user, data=data)
        if serializer.is_valid():
            serializer.save()
            if avatar_file:
                fs = FileSystemStorage()
                full_path = os.path.join('profile_avatars', '%s.jpg' % request.user.id)
                fs.delete(full_path)  # Overwrite if already exists
                fs.save(full_path, avatar_file)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileInfo(generics.RetrieveAPIView):
    serializer_class = AccountSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class AddProperty(APIView):
    serializer_class = PropertyModificationSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        category_obj = PropertyCategory.objects.get(id=request.data['category'])

        if serializer.is_valid():
            serializer.save(category=category_obj, owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditDeleteProperty(APIView):
    """
    Edit and delete a property.
    """
    serializer_class = PropertyDetailSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def put(self, request, pk, format=None):
        property = Property.objects.deletable_property(pk)
        update_dict = {}

        for key, value in request.data.items():
            if value is not None:
                update_dict[key] = value

        primary_image = request.FILES['primaryImage'] if 'primaryImage' in request.FILES else []
        additional_images = request.FILES['additionalImages'] if 'additionalImages' in request.FILES else []
        # serializer.additionalImages.save(request.FILES['primaryImage'].name, request.FILES['primaryImage'])
        del update_dict['primaryImage'], update_dict['additionalImages']

        serializer = PropertyDetailSerializer(property, data=update_dict, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        _property = Property.objects.deletable_property(pk)
        _property.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PropertyList(generics.ListAPIView):
    """
    Lists all properties.
    """
    serializer_class = PropertySerializer
    permission_classes = []
    authentication_classes = []
    pagination_class = PageNumberPagination

    def get_queryset(self):

        get_param = lambda key: self.request.GET.get(key)
        user_request = int(get_param('userRequest')) if get_param('userRequest') else None
        if user_request == 1:
            return Property.objects.all_user_properties(self.request.user)
        else:
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


class ProfilePropertyList(generics.ListAPIView):
    """
    Lists all properties for an authenticated user.
    """
    serializer_class = PropertySerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)
    pagination_class = None

    def get_queryset(self):
        return Property.objects.all_user_properties(self.request.user)


class ViewProperty(generics.RetrieveAPIView):
    """
    Lists property details properties.
    """
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
    """
    Firstly get all categories from DB, then cache them,
    then build a hierarchical category tree
    """
    def get(self, request, **kwargs):
        results = PropertyCategory.objects.all().order_by('position')
        root_nodes = cache_tree_children(results)
        category_tree = build_nested_category_tree(root_nodes)
        return Response(category_tree)


class ChatsList(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, **kwargs):
        user_id = request.user.id
        query_set = Chat.objects.filter((Q(from_user_id=user_id) | Q(to_user_id=user_id))).order_by('created_at')
        data = ChatSerializer(query_set, many=True).data
        return Response(data)


class ChatMessagesList(APIView):
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


class AddMessageToChat(generics.ListCreateAPIView):
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


class CreateChat(generics.ListCreateAPIView):
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


class TotalChatNotifications(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_id = request.user.id
        total_notifications = Message.objects \
            .filter((Q(chat__from_user_id=user_id) | Q(chat__to_user_id=user_id))
                    & Q(is_read=False)
                    & ~Q(from_user_id=user_id)) \
            .count()
        data = {'totalNotifications': total_notifications}
        return Response(data)


class CommentControlView(APIView):
    """
    List all comment notifications or Create a new comment.
    """
    serializer_class = CommentSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request, format=None):
        comments = Comment.objects.filter(is_read=False, property__owner=request.user).exclude(owner=request.user)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):

        _property = Property.objects.get(id=request.data['property_id'])
        message = request.data['message_body'] if 'message_body' in request.data else None

        # Save the comment
        if message:
            comment = Comment(property = _property, owner = request.user, message_body = message)
            comment.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class GetCommentView(APIView):
    """
    List all comments for a property.
    """
    serializer_class = CommentSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        _property = Property.objects.get(id=request.data['property_id'])
        comments = Comment.objects.filter(property=_property)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)


class CommentNotificationCountView(APIView):
    """
    Count number of unread notifications for a user and set them as read.
    """
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request, *args, **kwargs):
        comments = Comment.objects.filter(is_read=False)
        for c in comments:
            c.is_read = True
            c.save()
        return Response(status=status.HTTP_201_CREATED)

    def get(self, request, format=None):
        comments = Comment.objects.filter(is_read=False, property__owner=request.user).exclude(owner=request.user).count()
        return Response(comments, status=status.HTTP_201_CREATED)