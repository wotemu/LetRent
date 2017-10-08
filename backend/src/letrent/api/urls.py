from django.conf.urls import url
from .views import VideoList, VideoDetail, VideoFeatured, RegisterUser, PropertyList, PropertyDetail
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

# user = Account.objects.create_user(username='talent@test.com', email='1232123@test.com', password='testtest')

urlpatterns = [
    url(r'^register/', RegisterUser.as_view()),
    url(r'^login/', obtain_jwt_token),
    url(r'^token-refresh/', refresh_jwt_token),
    url(r'^token-verify/', verify_jwt_token),

    url(r'properties/$', PropertyList.as_view()),
    url(r'properties/(?P<slug>[\w-]+)/$', PropertyDetail.as_view()),

    url(r'videos/$', VideoList.as_view()),
    url(r'videos/featured/$', VideoFeatured.as_view()),
    url(r'videos/(?P<slug>[\w-]+)/$', VideoDetail.as_view()),
]
