from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from .views import RegisterUser, \
    PropertyList, PropertyDetail, PropertyModification, PropertyCategoryView,\
    UserUpdateProfile, ProfilePropertyList, ControlPropertyView, CreateCommentView,\
    ChatsListHandler, ChatMessagesHandler, AddMessageToChatHandler, CreateChatHandler, \
    GetCommentView

urlpatterns = [
    # Login Register
    url(r'^register/', RegisterUser.as_view()),
    url(r'^login/', obtain_jwt_token),
    url(r'^token-refresh/', refresh_jwt_token),
    url(r'^token-verify/', verify_jwt_token),

    # User Profile
    url(r'^profile/', UserUpdateProfile.as_view()),
    url(r'profile-properties/$', ProfilePropertyList.as_view()),

    # Properties
    url(r'property-categories/$', PropertyCategoryView.as_view()),
    url(r'properties/$', PropertyList.as_view()),
    url(r'property-modification/$', PropertyModification.as_view()),
    url(r'property-modification/(?P<pk>[0-9]+)/$', ControlPropertyView.as_view()),
    url(r'properties/(?P<slug>[\w-]+)/$', PropertyDetail.as_view()),

    # Chats
    url(r'chats/$', ChatsListHandler.as_view()),
    url(r'chats/create/$', CreateChatHandler.as_view()),
    url(r'chats/(?P<chat_id>[0-9]+)/messages/$', ChatMessagesHandler.as_view()),
    url(r'chats/(?P<chat_id>[0-9]+)/add-message/$', AddMessageToChatHandler.as_view()),

    # Comments
    url(r'comment/$', CreateCommentView.as_view()),
    url(r'get-comments/$', GetCommentView.as_view())

]
