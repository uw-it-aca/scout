from django import template
register = template.Library()


@register.filter
def remove_underscores(value):
    return value.replace('_', ' ')
