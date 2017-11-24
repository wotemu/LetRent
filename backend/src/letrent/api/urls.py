from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from .views import RegisterUser, \
    PropertyList, ViewProperty, AddProperty, EditDeleteProperty, PropertyCategoryView, \
    ProfileInfo, UpdateProfile, ProfilePropertyList, \
    ChatsList, ChatMessagesList, AddMessageToChat, CreateChat, TotalChatNotifications, \
    GetCommentView, CommentControlView, CommentNotificationCountView

urlpatterns = [
    # Login Register
    url(r'^register/', RegisterUser.as_view()),
    url(r'^login/', obtain_jwt_token),
    url(r'^token-refresh/', refresh_jwt_token),
    url(r'^token-verify/', verify_jwt_token),

    # User Profile
    url(r'^profile/info', ProfileInfo.as_view()),
    url(r'^profile/update', UpdateProfile.as_view()),
    url(r'profile-properties/$', ProfilePropertyList.as_view()),

    # Properties
    url(r'property-categories/$', PropertyCategoryView.as_view()),
    url(r'properties/$', PropertyList.as_view()),
    url(r'properties/add/$', AddProperty.as_view()),
    url(r'properties/(?P<pk>[0-9]+)/update/$', EditDeleteProperty.as_view()),
    url(r'properties/(?P<pk>[0-9]+)/delete/$', EditDeleteProperty.as_view()),
    url(r'properties/(?P<slug>[\w-]+)/$', ViewProperty.as_view()),

    # Chats
    url(r'chats/$', ChatsList.as_view()),
    url(r'chats/create/$', CreateChat.as_view()),
    url(r'chats/(?P<chat_id>[0-9]+)/messages/$', ChatMessagesList.as_view()),
    url(r'chats/(?P<chat_id>[0-9]+)/add-message/$', AddMessageToChat.as_view()),
    url(r'chats/total-notifications/$', TotalChatNotifications.as_view()),

    # Comments
    url(r'comment/$', CommentControlView.as_view()),
    url(r'get-comments/$', GetCommentView.as_view()),
    url(r'get-comment-count/$', CommentNotificationCountView.as_view())
]
