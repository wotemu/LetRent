# LetRent Codebase

## Prerequisites
- Django 1.11
- Angular 4
- SQLite

## Quick Setup
1) Download repository
2) Pre-installation:
- Go to */backend/src/* and run:
	`python3 -m pip install -r requirements.txt`. You may optionally create a new python environment.

- Create initial SQLite3 database file: go to */backend/src/* and run:  
    `cp db.sqlite3.example db.sqlite3`

- Populate the database table and records:    
  	`python3 manage.py migrate --fake-initial`  
	`python3 manage.py migrate --run-syncdb`  
	`python3 manage.py loaddata fixtures/initial_data.json` 

- Go to */client/* and run: 
	`npm install`.  

3) Run angular (frontend) auto-builder:
- Go to */client/* and run:  
	`ng build`  
	or `ng serve -o`  
	or `ng build --watch --output-hashing none --extractCss true`


4) Run server:
- Go to */backend/src/* and run:  
	`python3 manage.py runserver`

## Additional information
### Fake data (Fixtures)
- Export fixtures:  
	`python3 manage.py dumpdata letrent --format=json --indent 2 > fixtures/initial_data.json`  

- You can exclude some models by providing additional parameters: 
    `--exclude letrent.model1 -- exclude letrent.model2 ...` 

- Import fixtures:
	`python3 manage.py loaddata fixtures/initial_data.json`

## Test access
Test account for front-end side:
* **email**: test@test.com  
* **password**: testtest  
  
Test account for back-end side ([Admin Login Page](http://localhost:8000/admin/)):
* **email**: admin@test.com
* **password**: admin-test
