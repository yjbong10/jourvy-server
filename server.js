const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const e = require('express');
// const { json } = require('body-parser');
var knex = require('knex')({
    client: 'pg',
    connection: {
      connectionString : 'postgresql-parallel-34994' || '127.0.0.1',
      user : 'postgres',
      password : 'admin',
      database : 'diary'
    }
});

//Controllers
//Auth Controller
const landing = require('./Controllers/Auth/landing')
const login = require('./Controllers/Auth/login')
const logout = require('./Controllers/Auth/logout')
const register = require('./Controllers/Auth/register')
const verify = require('./Controllers/Auth/verify')

//Posts Controller
const postList = require('./Controllers/Posts/postList')
const postCompose = require('./Controllers/Posts/compose')
const postDelete = require('./Controllers/Posts/delete')
const postEdit = require('./Controllers/Posts/edit')

//Profile Controller
const profile = require('./Controllers/Profile/profile')
const editPassword = require('./Controllers/Profile/editPassword')
const editName = require('./Controllers/Profile/editName')
const resetProfile = require('./Controllers/Profile/resetProfile')
const deleteAccount = require('./Controllers/Profile/deleteAccount')

//Settings Controller
const settings = require('./Controllers/Settings/settings')

//Weather Controller
const weather = require('./Controllers/Weather/weather');


//middleware
const app = express();
app.use(cors({credentials: true, origin: 'http://192.168.0.171:3000'}));
app.use(bodyParser.json());
app.use(cookieParser());


// Variables
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'secret';
const saltRounds = 5;
const Age = 12 * 60 * 60 // 12hrs to secs
const createToken = (email) => {
    return jwt.sign({ email }, JWT_SECRET, { 
        expiresIn: Age 
    }) 
}



//Auth Route
app.get('/', landing.landingVerifyHandler(jwt, JWT_SECRET, knex))
app.get('/logout', logout.logoutHandler())
app.post('/login', login.loginHandler(knex, bcrypt, createToken, Age))
app.post('/register', register.registerHandler(bcrypt, saltRounds, knex))
app.post('/verify', verify.verifyHandler(knex, bcrypt))

//Posts Route
app.post('/diary', postList.postListHandler(knex))
app.post('/diary/compose', postCompose.composeHandler(knex))
app.delete('/diary/post/:id', postDelete.deleteHandler(knex))
app.put('/diary/post/edit/:id', postEdit.editHandler(knex))

// Profile Route
app.post('/profile', profile.profileHandler(knex))
app.put('/account/edit/password', editPassword.editPasswordHandler(knex, bcrypt, saltRounds))
app.put('/account/edit/name', editName.editNameHandler(knex))
app.put('/profile/reset', resetProfile.resetProfileHandler(knex, bcrypt))
app.delete('/account/delete', deleteAccount.deleteAccountHandler(knex, bcrypt))

app.put('/settings', settings.settingHandler(knex))

//Weather Route
app.post('/weather', weather.weatherHandler(fetch))



app.listen(PORT, () => {
    console.log(`server on port ${PORT}`)
})