// Starting the server from here :)

const express = require('express'),
      helmet = require('helmet'),
      morgan = require('morgan'),
      userSchema = require('./models/User'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      ejs = require('ejs'),
      ejsMate = require('ejs-mate'),
      cookieParser = require('cookie-parser'),
      flash = require('express-flash'),
      session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      passport = require('passport'),
      mainRoutes = require('./routes/main'),
      userRoutes = require('./routes/user'),
      adminRoutes = require('./routes/admin'),
      Category = require('./models/Category'),
      
      secret = require('./config/generalSecret'),
      middleware = require('./middleware//middlewares'),
      apiRoutes = require('./api/api');
   


// Initializing the express framework :)
const app = express(),
 port = secret.port;

 mongoose.connect(secret.database, {
    useCreateIndex: true,
    useNewUrlParser: true
}).then(() => console.log('App has connected to database :)')).catch(err => console.log('Oops! some probles have occures to connecting to database :('));

// Add Middleware Here :)

app.use(helmet());
app.use(express.static(__dirname + '/public'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    name: secret.name,
    resave:true,
    saveUninitialized: true,
    secret: secret.secretKey,
    // Only activat it on secure connection (https :) )
    // cookie: { 
    //     secure: true,
    //     httpOnly: true,
    //  },
     //store: new MongoStore({ url:secret.database , autoReconnect:false})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
    // Adding middleware for showing user in navbar :)
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(middleware);
    // End of middleware
    
    // Adding middleware for the navbar :)
app.use((req, res, next) => {
    Category.find({}, (err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
        next();
    });
});
    // End of middleware of navbar :)
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(mainRoutes);
app.use(userRoutes);
app.use(adminRoutes);
app.use('/api', apiRoutes);

 

app.listen( process.env.PORT || port, err => {
    if (err) throw err;
    console.log(`Server is running on the port: ${port}`);
});


// error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
//   });
