import json
from django.forms.widgets import Input
from django.template import loader
from django.utils.safestring import mark_safe


class MultiImagesInputWidget(Input):
    template_name = 'admin/widgets/img_multi_upload.html'
    input_type = "file"

    class Media:
        css = {
            "all": (
                "admin/css/imgwidget.css",
            )
        }
        js = (
            "admin/js/img_multi_upload.js",
        )

    def render(self, name, value, attrs=None, renderer=None):
        context = self.get_context(name, value, attrs)
        try:
            context["widget"]['widget_img_urls'] = ",".join(json.loads(value))
        except:
            pass
        template = loader.get_template(self.template_name).render(context)
        return mark_safe(template)


def get_imgs_value(value):
    if not value:
        return []
    values = value.split(',')
    return [value for value in values if value]
