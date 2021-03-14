# Fetch

This project is a Django Web application that retrieves data from an AWS API and creates a modern and human readable HTML list.

## Motivation
 Combined with an internal drive to learn more about front end development as well as a required component for a technical interview, this project is a deeper example of leveraging python and html for front-end development.

## Features
This application contains the following features:
* List Grouping:
  * All items that a returned after the fetch API is executed will return a `listID` value
  * The Application will group the items by the appropriate `listID`
  * The Application will filter out on any items where the `name` value is either `""` or `null`
  * Once all the data is retrieved and sorted, an unordered list is printed on the browser

Leveraging pre-existing Django features, there is a file called views.py that outlines all of the Python methods and functionalities.

## Installation
This project requires Django. Furthermore, to avoid any CORS related issues, the `django-cors-headers` will need to be installed to the project as well as the Django backend applications. Also, the server IP address will need to be added for whitelisting.

## API Reference
Since this project uses Django, I used the Django documentation to research and clarify any additional features and functionality used in this project:\
  https://docs.djangoproject.com/en/3.0/

The AWS API that I am using is:\
  https://fetch-hiring.s3.amazonaws.com/hiring.json
\
No Documentation is included.

## How to Use?
This is to be run just like any other Django application. After locating the manage.py file in the application directory, run the following command in terminal:

```
$ python manage.py runserver
```
