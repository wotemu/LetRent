from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from .views import RegisterUser, PropertyList, PropertyDetail, PropertyCategoryView

urlpatterns = [
    url(r'^register/', RegisterUser.as_view()),
    url(r'^login/', obtain_jwt_token),
    url(r'^token-refresh/', refresh_jwt_token),
    url(r'^token-verify/', verify_jwt_token),

    url(r'property-categories/$', PropertyCategoryView.as_view()),

    url(r'properties/$', PropertyList.as_view()),
    url(r'properties/(?P<slug>[\w-]+)/$', PropertyDetail.as_view()),
    # url(r"properties/(?P<pk>\d*)/$", PropertyDetail.as_view({'get': 'retrieve', 'put': 'update'})),  # access by ID
]
