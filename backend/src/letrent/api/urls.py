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

# import jwt
# from ..settings import SECRET_KEY
#
# encoded = jwt.encode(
#     {
#         'open_id_token': '123'
#     },
#     SECRET_KEY
# )
# print("Encoded: ", encoded)
#
# encoded = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNiwidXNlcm5hbWUiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxNTA5NzQwODA4LCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.1D9w4vOsWEIQ8Ektx-3NFfTFnPPkOqnqcz7YBzA9I5s"
# decoded = jwt.decode(encoded)
# print("Decoded: ", decoded)

# Bearer
# {
#     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozNiwidXNlcm5hbWUiOiJ0ZXN0QHRlc3QuY29tIiwiZXhwIjoxNTA5NzQwODA4LCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.1D9w4vOsWEIQ8Ektx-3NFfTFnPPkOqnqcz7YBzA9I5s"}

