# letstream
A streaming application made with mern stack

> How to operate in your local environment?

## Prerequisites

* Node installed (>= v12.16.1)
* npm installed (>= 6.14.7)
* (optional) MongoDB server version (>=3.6.8)

## Testing environment

Testing of this application was done in an environment with node version `12.16.1` and npm version `6.14.7`
For testing with local mongodb,switch to `MONGOURI` in <a href="/utils/db.config.js">db.config.js</a>

### Clone the repo

### `git clone https://github.com/CSN-291-team-8/letstream.git`

### Navigate to the main folder

### `cd letstream` 

### Install server dependencies

### `npm install`

navigate to the client directory and <br/>
Include a .env file in client directory<br/>
To install client dependencies,

```bash
npm install
```

```javascript
REACT_APP_UPLOAD_URL=<Your_cloud url>
```
To use cloudinary for cloud service,<br/>
head over to [cloudinary.com](https://cloudinary.com) to get your cloud url.

Modify the .env for server (To be added at the main route)

```javascript
JWT_SECRET="<ANY_STRING>"
EMAIL="<ADD_YOUR_NEW_EMAIL_ID>" //Add the email which will send OTP to other email
EMAIL_PASS="<ADD_PASSWORD>" //Add your email password
JWT_EXPIRE=30d  // you can add whatever you wish
MONGOURI2="<YOUR_MONGO_URI>" //mongouri when used for production
MONGOURI="mongodb://localhost:27017/letstream" //mongouri for local development
ADMIN_EMAIL="<The admin email>" //This is for notifying admin if a large number of users are reporting a video
```
Email password in `EMAIL_PASS` must be strong enough and it must be configured to allow access to less secure app<br/>
otherwise google will generate security alert or will block sending email.

Finally run these commands from main directory `letstream`,

```bash
npm start
npm run client
```

> Main Features

* Upload video of your choice
* Host a live event
* Three type of privacy options for your live event or video - 1.Public 2.Only subscribers 3.Custom 
* Notifications when someone liked your video or comments in a video
* Options to save video and see liked video or history ,trending videos and your own videos
* Separate section to see live events
* live chat in any live event to maintain interactions among participants and organiser
* Organiser can share their screen in broadcast 
* And many more...

> Tech stack

We have used MERN stack for building this application.








