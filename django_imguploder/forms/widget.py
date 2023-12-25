import json

from django.forms import ModelForm, CharField
from django.forms.widgets import Input


class MultiImagesInputWidget(Input):
    template_name = 'admin/widgets/img_multi_upload.html'

    class Media:
        css = {
            "all": (
                "admin/css/imgwidget.css",
                "admin/css/viewer.css",
            )
        }
        js = (
            "admin/js/jquery.min.js",
            "admin/js/img_multi_upload.js",
            "admin/js/viewer.min.js",
        )

    def get_json_value(self, value):
        """
        :param value:
        :return: is_json, value
        """
        try:
            return True, json.loads(value)
        except ValueError as e:
            return False, value

    def get_context(self, name, value, attrs):
        context = super(MultiImagesInputWidget, self).get_context(name, value, attrs)
        if not value:
            return context
        # 判断是否是json
        is_json, json_value = self.get_json_value(value)
        if is_json:
            context["widget"]['widget_img_urls'] = ",".join(json.loads(value))
        else:
            context["widget"]['widget_img_urls'] = value
        return context


class MultiImageField(CharField):
    widget = MultiImagesInputWidget

    def __init__(self, max_count=None, input_type=None, accept="image/*", save_json_list=True, **kwargs):
        self.accept = accept
        self.input_type = input_type
        self.max_count = max_count
        # save_json_list: "['1.jpg', '2.jpg']"
        # not save_json_list: 1.jpg,2.jpg
        self.save_json_list = save_json_list
        super().__init__(**kwargs)

    def widget_attrs(self, widget):
        attrs = super().widget_attrs(widget)
        max_count = self.max_count if self.max_count else -1
        attrs.update({
            'multiple': bool(max_count > 1),
            'accept': self.accept,
            'max_count': max_count,
            'input_type': self.input_type or "file",
        })
        return attrs

    def to_python(self, value):
        if self.save_json_list:
            imgs = [img for img in value.split(",") if img] if value else []
            value = json.dumps(imgs)
        return value
