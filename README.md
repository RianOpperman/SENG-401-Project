# SENG 401 Project
## FROG
```
  __   ___.--'_`.     .'_`--.___   __
 ( _`.'. -   'o` )   ( 'o`   - .`.'_ )
 _\.'_'      _.-'     `-._      `_`./_
( \`. )    //\`         '/\\    ( .'/ )
 \_`-'`---'\\__,       ,__//`---'`-'_/
  \`        `-\         /-'        '/
   `                               '  
```

## To run Surreal DB server
```bash
surreal start --log debug --user root --pass root file:.
```
This code starts the Surreal DB server and logs every interaction, with the login credentials to said server being
root and password root. The DB itself is stored in the the DB folder, so can use either `file:.` while in the DB
directory or use `file:DB` from the main directory.

## To use Surreal DB from CLI
```bash
surreal sql --conn http://localhost:8000 --pretty --user root --pass root --ns test --db test
```
This code connects to the already running Surreal DB server as root with the password root, 
using namespace test and the test database. It also has the pretty print functionality turned on
so when you get a JSON returned it doesn't look all garbo

For reference on SurrealQL go to the Surreal DB site and look at the docs there, its very similar to SQL,
only major difference being that you don't need to create a table before inserting stuff to it. Looks so far to be
like an on-the-fly DB which should be interesting.
For the sake of maintainability though please use the designed tables with the column names and so forth.

## Note on Surreal DB
The needed JS file is already included in the repo, so no need to run NPM first to install everything

## Surreal DB Database & Table setup
*To note: Images will be stored on DB for the website to request*

### Movie DB:
| ID | Title | Release Date | Rating | Runtime | Genre | Directors | Writers | Actors | Language | Description |
| -- | ----- | ------------ | ------ | ------- | ----- | --------- | ------- | ------ | -------- | ----------- |

### Series DB:
| ID | Title | Release Date | Rating | Season | Episode | Runtime | Genre | Directors | Writers | Actors | Language | Description |
| -- | ----- | ------------ | ------ | ------ | ------- | ------- | ----- | --------- | ------- | ------ | -------- | ----------- |

### Cast & Crew DB:
| ID | Name | DOB | Age | Movies | Series |
| -- | ---- | --- | --- | ------ | ------ |

### User DB:

User table:

*The Password will be stored as encrypted test, will need to be deciphered by program*
| Username | Email | Password | Review ID |
| -------- | ----- | -------- | --------- |

Review Table:
| Movie | Series | Review description | Review Rating | Review ID |
| ----- | ------ | ------------------ | ------------- | --------- |
