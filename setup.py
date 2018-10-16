import os
from setuptools import setup

README = open(os.path.join(os.path.dirname(__file__), 'README.md')).read()

# allow setup.py to be run from any path
os.chdir(os.path.normpath(os.path.join(os.path.abspath(__file__), os.pardir)))

setup(
    name='scout',
    version='0.1',
    packages=['scout'],
    include_package_data=True,
    install_requires = [
        'setuptools',
        'django<=1.8.6',
        'django_compressor',
        'django_mobileesp',
        'pytz',
        'beautifulsoup4',
        'html5lib==0.9999999',
        'requests',
        'django-pyscss'
    ],
    license='Apache License, Version 2.0',  # example license
    description='A Django app for finding resources on campus.',
    long_description=README,
    url='http://www.example.com/',
    author='Your Name',
    author_email='yourname@example.com',
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License', # example license
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Programming Language :: Python :: 2.6',
        'Programming Language :: Python :: 2.7',
        'Topic :: Internet :: WWW/HTTP',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
    ],
)
