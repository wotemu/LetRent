# LetRent Codebase

## Prerequisites
- Django 1.11
- Angular 4
- SQLite

## Quick Setup
1) Download repository
2) Run:
- Go to */backend/src/* and run `python3 -m pip install -r requirements.txt`. You may optionally create a new python environment.
- Populate the database table and records:  
  `python3 manage.py makemigrations`  
  `python3 manage.py migrate --fake-initial`  
  `python3 manage.py migrate --run-syncdb`  
- Go to */client/* and run `npm install`.
- To run angular auto-builder use go to */client/* and run `ng build --output-path "../backend/src/static/ang/" --watch --output-hashing none --extractCss true`


## Additional information
...

## Test access
Test account for the front-end and back-end sides:
**email**: test@test.com
**password**: testtest
