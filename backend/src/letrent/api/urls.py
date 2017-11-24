from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from .views import RegisterUser, \
    PropertyList, PropertyDetail, PropertyModification, PropertyCategoryView, \
    ProfileInfoHandler, UserUpdateProfile, ProfilePropertyList, ControlPropertyView,\
    ChatsListHandler, ChatMessagesHandler, AddMessageToChatHandler, CreateChatHandler, TotalNotificationsHandler, \
    GetCommentView, CommentControlView, CommentNotificationCountView

urlpatterns = [
    # Login Register
    url(r'^register/', RegisterUser.as_view()),
    url(r'^login/', obtain_jwt_token),
    url(r'^token-refresh/', refresh_jwt_token),
    url(r'^token-verify/', verify_jwt_token),

    # User Profile
    url(r'^profile/info', ProfileInfoHandler.as_view()),
    url(r'^profile/update', UserUpdateProfile.as_view()),
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
    url(r'chats/total-notifications/$', TotalNotificationsHandler.as_view()),

    # Comments
    url(r'comment/$', CommentControlView.as_view()),
    url(r'get-comments/$', GetCommentView.as_view()),
    url(r'get-comment-count/$', CommentNotificationCountView.as_view())

]
