from django import template
register = template.Library()


@register.filter
def remove_underscores(value):
    return value.replace('_', ' ')


@register.filter
def format_phone(value):
    phone = '(%s) %s-%s' % (value[0:3], value[3:6], value[6:10])
    return phone


@register.filter
def stackerize(value):

    # convert & to &amp;
    value = value.replace('&', '%26')

    # conver whitespace to +
    value = value.replace(' ', '+')

    return value
