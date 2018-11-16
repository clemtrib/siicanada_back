import users from "./crud/users.js"

module.exports = (app) => {

    // Login function
    app.post('/login', users.login)

    // Retrieve a single User with id
    app.get('/findOne/:id', users.findOne)

    // Retrieve all Users
    app.get('/findAll', users.findAll)

    // Create a new User
    app.post('/create', users.create)

    // Update a User with id
    app.put('/update/:id', users.update)

    // Delete a User with id
    app.delete('/delete/:id', users.delete)

}
