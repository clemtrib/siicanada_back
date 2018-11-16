
import User from "../../schema/schemaUser"
import passwordHash from "password-hash"

/**
 * 
 * Create and Save a new User
 */
exports.create = (req, res) => {
    // Validate request
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({
            message: "User email and user password can not be empty"
        });
    }

    // Create a User
    const user = new User({
        email: req.body.email,
        password: passwordHash.generate(req.body.password)
    });

    // Save User in the database
    user.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the User."
            });
        });
};

/**
 * 
 * Retrieve and return all user from the database. 
 */
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        });

};

/**
 * 
 * Find a single user with a email
 */
exports.findOne = (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `User not found with id ${req.params.id}`
                });
            }
            res.send(user);
        }).catch(err => {
            return res.status(500).send({
                message: err.message || `Error retrieving user with id ${req.params.id}`
            });
        });
};

/**
 *
 * Update a user identified by the id in the request
 */
exports.update = (req, res) => {
    // Validate Request
    if (!req.params.id || !req.body.email) {
        return res.status(400).send({
            message: "User id and user email can not be empty"
        });
    }

    // Find user and update it with the request body
    User.findByIdAndUpdate(req.params.id, {
        email: req.body.email
    }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `User not found with id ${req.params.id}`
                });
            }
            res.send(user);
        }).catch(err => {
            return res.status(500).send({
                message: `Error updating user with id ${req.params.id}`
            });
        });
};

/**
 * 
 * Delete a user with the specified email in the request
 */
exports.delete = (req, res) => {
    // Validate Request
    if (!req.params.id) {
        return res.status(400).json({
            "text": "User id can not be empty"
        })
    }

    User.findByIdAndRemove(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: `User bi not found with id ${req.params.id}`
                });
            }
            res.send({ message: "User deleted successfully!" });
        }).catch(err => {
            return res.status(500).send({
                message: `Could not delete user with id ${req.params.id}`
            });
        });
};

/**
 * 
 * Login
 */
exports.login = (req, res) => {
    // Validate Request
    if (!req.body.email || !req.body.password) {
        //Le cas où l'email ou bien le password ne serait pas soumit ou nul
        return res.status(400).json({
            "text": "User email and User password can not be empty"
        })
    }

    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) {
            return res.status(500).json({
                "text": "Erreur interne"
            })
        } else if (!user) {
            return res.status(401).json({
                "text": "L'utilisateur n'existe pas"
            })
        } else if (!user.authenticate(req.body.password)) {
            return res.status(401).json({
                "text": "Mot de passe incorrect"
            })
        }
        res.status(200).json({
            "token": user.getToken(),
            "text": "Authentification réussi"
        })
    })
}
