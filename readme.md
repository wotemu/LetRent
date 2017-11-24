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

## Initial Deploy on Heroku
Before running commands with `heroku`, you must have installed [Heroku CLI](https://cli.heroku.com/).

Then run the following commands for the fresh deployment on Heroku:  
 `cd backend/src/`  
 `git init`  
 `heroku login`  
 `heroku git:remote -a letrent`  
 `git add .`   
 `git commit -m "Commit name...`  
 `git push heroku master`
  `heroku run python manage.py migrate --run-syncdb` (Synchronize remote database)
Open in browser: `heroku open`.
    
If you want to deploy app in your account, run `heroku create` to create new app and add it as remote repository to your backend local repository `heroku git:remote -a newly_created_appname` 

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
