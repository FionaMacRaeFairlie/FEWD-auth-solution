const router = require('express').Router();   
const passport = require('passport');
const utils = require('../lib/utils');
const db = require('../config/nedb.js');

router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.status(200).json({ success: true, msg: "The secret is revealed - you are successfully authenticated to this route!"});
});

// TODO: implement error handling for db calls

// Validate an existing user and issue a JWT
router.post('/login', function(req, res, next){

    db.findOne({ username: req.body.username }, {_id:1}, function(err, user){
        if (!user) {
            
            res.status(401).json({ success: false, msg: "could not find user" });
        }
        
        console.log(user);

        // Function defined at bottom of app.js
        const isValid = utils.validPassword(req.body.password, user.hash, user.salt);
        
        if (isValid) {

            const tokenObject = utils.issueJWT(user);

            res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires, username:user.username });

        } else {

            res.status(401).json({ success: false, msg: "you entered the wrong password" });

        }
    });
});

// Register a new user
router.post('/register', function(req, res, next){
    const saltHash = utils.genPassword(req.body.password);
    
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const newUser = {
        username: req.body.username,
        hash: hash,
        salt: salt
    };

    console.log(newUser);

    db.insert(newUser, function(err, user){
        res.json({ success: true, user: user });    
    }); 

});

module.exports = router;