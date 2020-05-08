require('dotenv').config()

const express = require('express'),
      massive = require('massive'),
      session = require('express-session'),
      {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
      authCtrl = require('./controllers/authController'),
      movieCtrl = require('./controllers/movieController'),
      port = SERVER_PORT,
      app = express();

app.use(express.json())

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000 * 60}
}))

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db)
    console.log('db connected')
})

//auth endpoints 
app.post('/api/register', authCtrl.register)
app.post('/api/login', authCtrl.login)
app.get('/api/logout', authCtrl.logout)

//movie list endpoints
app.get('/api/movies', movieCtrl.getMoviesList)
app.post('/api/movies/:user_id', movieCtrl.addUserMovieList)
app.get('/api/movies/:user_id', movieCtrl.getUserMovieList)
app.delete('/api/liked_movies/:movie_id', movieCtrl.deleteUserMovie)

app.listen(port, () => console.log(`Server running on port ${port}`))