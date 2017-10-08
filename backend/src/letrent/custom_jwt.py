from datetime import datetime
from calendar import timegm
from rest_framework_jwt.settings import api_settings
from .api.serializers import AccountSerializer
from itertools import chain


def jwt_payload_handler(user):
    """ Custom payload handler
    Token encrypts the dictionary returned by this function, and can be decoded by rest_framework_jwt.utils.jwt_decode_handler
    """
    serializer = AccountSerializer(user)
    account_data = dict(serializer.data)
    token_data = {
        'exp': datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA,
        'orig_iat': timegm(datetime.utcnow().utctimetuple())
    }
    return dict(chain(account_data.items(), token_data.items()))


def jwt_response_payload_handler(token, user=None, request=None):
    """ Custom response payload handler.
    This function controls the custom payload after login or token refresh. This data is returned through the web API.
    """
    return {'token': token}
