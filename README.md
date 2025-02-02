# SENG 401 Project

If there is any issue please contact us.

## Pre-requisites
You need to have Node JS version 18+, preferably version 19.7.
To do so follow the instructions on this link for `nvm` (https://github.com/nvm-sh/nvm#installing-and-updating).
Once that is installed, in the `App` folder of our repo run `npm install --save surrealdb.js` and `npm install --save nodemailer`.

You should be good to move on to instructions then.

*NOTE:* it may also be beneficial to install SurrealDB itself on your machine for its CLI, as you can query the database with it. To do so use this link (https://surrealdb.com/docs/start/installation)

## Instructions
To begin you need to start all the docker containers for the database, there are no containers for the microservices.
To do this follow the guide in `containers/README.md`.

Afterwards you need to start each microserive, they each have `service` in their name and are in the direct `App` folder.
Do this by running `node (microservice name)`.

Once all the microservices are running, start the main app using `node app.js`.

Connect to `https://localhost:9000` on your machine and accept the self-signed certificate.

Use the app from there.

*NOTE:* you will also need to run a docker email server for notifications, do this by running `docker run -it -p 2500:2500 -p 8080:8080 -p 8085:8085 --name mail-server marcopas/docker-mailslurper`. You can access the mail server on `localhost:8080`, and once there hit refresh to see new emails.

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

## Surreal DB Database & Table setup

### Movie DB:
| ID | Title | Release Date | Rating | Runtime | Genre | Directors | Writers | Actors | Language | Description | Image |
| -- | ----- | ------------ | ------ | ------- | ----- | --------- | ------- | ------ | -------- | ----------- | ----- |

### Series DB:
| ID | Title | Release Date | Rating | Season | Episode | Runtime | Genre | Directors | Writers | Actors | Language | Description | Image |
| -- | ----- | ------------ | ------ | ------ | ------- | ------- | ----- | --------- | ------- | ------ | -------- | ----------- | ----- |

### Cast & Crew DB:
| ID | Name | DOB | Age | Movies | Series | Image |
| -- | ---- | --- | --- | ------ | ------ | ----- |

### User DB:

User table:

| Username | Email | Password |
| -------- | ----- | -------- |

Current Users:\
**Username:** The Movie Man\
**Email:** movieman@gmail.com\
**Password:** movie

**Username:** Bob\
**Email:** bobby@gmail.com\
**Password:** bob

### Comment DB:

Movie Comment Table:
| Movie ID | Comment | Review Rating | Review ID | Image| Name | User ID | Username |
| ----- | ------------------ | ------------- | --------- | --- | --- | --- | ------ |

Series Comment Table:
| Series ID | Comment | Review Rating | Review ID | Image| Name | User ID | Username |
| ----- | ------------------ | ------------- | --------- | --- | --- | --- | ------ |
