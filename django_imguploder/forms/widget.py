import json

from django.forms import ModelForm
from django.forms.widgets import Input


class MultiImagesInputWidget(Input):
    template_name = 'admin/widgets/img_multi_upload.html'
    input_type = "file"
    accept = "image/*"
    multiple = True
    max_count = None

    class Media:
        css = {
            "all": (
                "admin/css/imgwidget.css",
            )
        }
        js = (
            "admin/js/jquery.min.js",
            "admin/js/img_multi_upload.js",
        )

    def get_context(self, name, value, attrs):
        context = super(MultiImagesInputWidget, self).get_context(name, value ,attrs)
        context.update({
            'multiple': self.multiple,
            'accept': self.accept,
            'max_count': self.max_count if self.max_count else -1,
            'input_type': self.input_type or "file",
        })
        try:
            context["widget"]['widget_img_urls'] = ",".join(json.loads(value))
        except:
            pass
        return context


class UploadImageForm(ModelForm):

    def clean(self):
        cleaned_data = self.cleaned_data
        for field_name, field in self.declared_fields.items():
            if isinstance(field.widget, MultiImagesInputWidget):
                if field.widget.multiple:
                    imgs_str = self.cleaned_data.get(field_name)
                    imgs = [img for img in imgs_str.split(",") if img] if imgs_str else []
                    data = json.dumps(imgs)
                else:
                    data = self.cleaned_data.get(field_name) or ""
                cleaned_data[field_name] = data
        return cleaned_data
