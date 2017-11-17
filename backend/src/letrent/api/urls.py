from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from .views import RegisterUser, AddProperty, PropertyList, PropertyDetail, PropertyCategoryView, UserUpdateProfile, ProfilePropertyList, ControlPropertyView

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
    url(r'add-property/$', AddProperty.as_view()),
    url(r'add-property/(?P<pk>[0-9]+)/$', ControlPropertyView   .as_view()),
    url(r'properties/(?P<slug>[\w-]+)/$', PropertyDetail.as_view()),
]
