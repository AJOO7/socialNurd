// const fs = require('fs');
// const rfs = require('rotating-file-stream');
// const path = require('path');
// const logDirectory = path.join(__dirname, "../production_log");
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// const accessLogStream = rfs('access.log', {
//     interval: 'id',
//     path: logDirectory
// })

const development = {
    name: 'development',
    // morgan: {
    //     mode: 'dev',
    //     options: { stream: accessLogStream }
    // }
    // here we can specify differrent credentials for producton mode

}
const production = {
    name: 'production',
    assets_path: process.env.assets_path,
    secret_key: process.env.secret_key,
    db: process.env.db,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            // user: process.env.user,
            user: 'example@gmail.com',
            pass: process.env.pass,
        }
    },
    google_clientID: process.env.google_clientID,
    google_clientSecret: process.env.google_clientSecret,
    google_callbackURL: process.env.google_callbackURL,
    jwt_secretOrKey: process.env.jwt_secretOrKey,
    // morgan: {
    //     mode: 'combined',
    //     options: { stream: accessLogStream }
    // }
}
module.exports = eval(process.env.name) == undefined ? development : eval(process.env.name);