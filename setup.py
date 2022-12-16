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
        "django_compressor<4.0",
        "django-libsass",
        "django-user-agents",
        "html5lib",
        "pytz",
        "requests",
        "setuptools",
    ],
    license="Apache License, Version 2.0",
    description="A Django app for finding resources on campus.",
    url="https://github.com/uw-it-aca/scout/",
    author="UW-IT, University of Washington",
    author_email="aca-it@uw.edu",
    classifiers=[
        "Environment :: Web Environment",
        "Framework :: Django",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: OS Independent",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.6",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
    ],
)
