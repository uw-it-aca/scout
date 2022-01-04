import os
from setuptools import setup

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name="scout",
    version="0.1",
    packages=["scout"],
    include_package_data=True,
    install_requires=[
        "beautifulsoup4",
        "django~=2.2",
        "django-appconf",
        "django_compressor",
        "django-pyscss",
        "django-user-agents",
        "html5lib==0.9999999",
        "pytz",
        "requests",
        "setuptools",
    ],
    license="Apache License, Version 2.0",
    description="A Django app for finding resources on campus.",
    url="http://www.example.com/",
    author="Your Name",
    author_email="yourname@example.com",
    classifiers=[
        "Environment :: Web Environment",
        "Framework :: Django",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2.6",
        "Programming Language :: Python :: 2.7",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
    ],
)
