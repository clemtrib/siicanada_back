import account from "./account/lib.js"

module.exports = function (app) {
    app.post('/login', account.login)
    app.post('/signup', account.signup)
}
