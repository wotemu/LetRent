import random
import string
from django.utils.text import slugify
from django.contrib.staticfiles.templatetags.staticfiles import static

no_property_img_url = static("static/images/no_image.gif")


def random_string_generator(size=10, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def unique_slug_generator(instance, new_slug=None):
    """
    random_string_generator is located here:
    http://joincfe.com/blog/random-string-generator-in-python/

    This is for a Django project and it assumes your instance 
    has a model with a slug field and a title character (char) field.
    """
    if new_slug is not None:
        slug = new_slug
    else:
        slug = slugify(instance.title)

    target_class = instance.__class__
    qs_exists = target_class.objects.filter(slug=slug).exists()
    if qs_exists:
        new_slug = "{slug}-{randstr}".format(
            slug=slug,
            randstr=random_string_generator(size=4)
        )
        return unique_slug_generator(instance, new_slug=new_slug)
    return slug
