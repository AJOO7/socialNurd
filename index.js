//begining 
const express = require('express');
const app = express();
const port = 8000;
// setting up enviroment
const logger = require('morgan');
const env = require('./config/enviroment');
// app.use(logger(env.morgan.mode, env.morgan.options));
//database

const db = require('./config/mongoose');
app.use(express.urlencoded());
// cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());
//setting up static
app.use(express.static(env.assets_path));

const flash = require("connect-flash");
const flashMiddle = require('./config/flash');

// // // // setting up layout
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

app.use('/uploads', express.static(__dirname + '/uploads'))
// // extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-stratergy');
const passportGoogle = require('./config/passport-google-oauth-stratergy');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
const editorServer = require('http').Server(app);
const editorSockets = require('./config/editor_sockets').editorSockets(editorServer);
const videoServer = require('http').Server(app);
const videoSockets = require('./config/video_sockets').videoSockets(videoServer);
videoServer.listen(5002);
editorServer.listen(5001);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');
console.log('editor server is listening on port 5001');
console.log('video server is listening on port 5002');




app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.secret_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'

    },
        function (err) {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
//setting the path for ejs rendering
const path = require('path');
const { title } = require('process');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(passport.setAuthenticatedUser);
//adding routes
app.use(flash());
app.use(flashMiddle.setFlash);
app.use('/', require('./routes'));


// listening to the port
app.listen(port, function (err) {
    if (err) {
        console.log("ERROR while launching the page!!");
    }
    console.log("The server is up and running on port:: ", port);
})