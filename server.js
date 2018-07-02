const
	express = require('express'),
	app = express(),
	ejsLayouts = require('express-ejs-layouts'),
	mongoose = require('mongoose'),
	flash = require('connect-flash'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	MongoDBStore = require('connect-mongodb-session')(session),
	passport = require('passport'),
	passportCongif = require('./config/passport'),
	methodOverride = require('method-override'),
	usersRouter = require('./routes/users.js'),
	postsRouter = require('./routes/posts')

// environment port
const
	port = process.env.PORT || 3000,
	mongoConnectionString = process.env.MONGODB_URI || 'mongodb://localhost/passport-authentication'

// mongoose connection
mongoose.connect(mongoConnectionString, (err) => {
	console.log(err || "Connected to MongoDB (passport-authentication)")
})

// will store session information as a 'sessions' collection in Mongo
const store = new MongoDBStore({
  uri: mongoConnectionString,
  collection: 'sessions'
});

// middleware
app.use(logger('dev')) // log incoming requests to terminal
app.use(cookieParser()) // interpret cookies that are attached to requests
app.use(express.urlencoded({extended: true})) // interpret standard form data in requests
app.use(flash()) // set and reset flash messages
app.use(methodOverride('_method'))

// ejs configuration
app.set('view engine', 'ejs')
app.use(ejsLayouts)

app.use(session({
	secret: "BOOM",
	cookie: { magAge: 60000000 },
	resave: true,
	saveUninitialized: false,
	store: store
}))

app.use(passport.initialize())
app.use(passport.session())

// make currentUser available in every views:
app.use((req, res, next) => {
	app.locals.currentUser = req.user
	app.locals.loggedIn = !!req.user
	next()
})

//root route
app.get('/', (req,res) => {
	res.render('index')
})

app.use('/users', usersRouter)
app.use('/posts', postsRouter)

app.listen(port, (err) => {
	console.log(err || "Server running on port " + port)
})
