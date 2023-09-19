# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

long_description = "\n".join([
    open('README.md', 'r', encoding='utf-8').read(),
])

NAME = 'django-imgwidget'
VERSION = '0.0.3.2'

setup(
    name=NAME,
    version=VERSION,
    packages=find_packages(
        exclude=()
    ),
    zip_safe=False,
    include_package_data=True,
    keywords='django,admin,widget,image,uploader',
    url='https://github.com/RelaxedDong/django_imguploder',
    license='Apache License 2.0',
    author='donghao',
    long_description=long_description,
    long_description_content_type="text/markdown",  # 描述文档README的格式 一般md
    author_email='1417766861@qq.com',
    description='上传图片组件',
    install_requires=['django'],
    classifiers=[
        "Programming Language :: Python :: 3",
        "Operating System :: OS Independent",
    ],
)
