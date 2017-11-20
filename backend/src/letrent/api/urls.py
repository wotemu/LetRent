from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from .views import RegisterUser, PropertyList, PropertyDetail, PropertyCategoryView, UserUpdateProfile, \
    ChatsListHandler, ChatMessagesHandler, AddMessageToChatHandler, CreateChatHandler

urlpatterns = [
    url(r'^register/', RegisterUser.as_view()),
    url(r'^login/', obtain_jwt_token),
    url(r'^token-refresh/', refresh_jwt_token),
    url(r'^token-verify/', verify_jwt_token),

    url(r'^profile/', UserUpdateProfile.as_view()),

    url(r'property-categories/$', PropertyCategoryView.as_view()),

    url(r'properties/$', PropertyList.as_view()),
    url(r'properties/(?P<slug>[\w-]+)/$', PropertyDetail.as_view()),
    # url(r"properties/(?P<pk>\d*)/$", PropertyDetail.as_view({'get': 'retrieve', 'put': 'update'})),  # access by ID

    url(r'chats/$', ChatsListHandler.as_view()),
    url(r'chats/create/$', CreateChatHandler.as_view()),
    url(r'chats/(?P<chat_id>[0-9]+)/messages/$', ChatMessagesHandler.as_view()),
    url(r'chats/(?P<chat_id>[0-9]+)/add-message/$', AddMessageToChatHandler.as_view()),
]
