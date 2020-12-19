const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const parsedJWT = jwt.verify(
            token,
            'the-demons-inside-my-head-eats-me'
        );
        // console.log(parsedJWT);
        if (Date.now() < parsedJWT.exp || !parsedJWT._id) {
            throw Error('Token bad token or expired');
        }

        const user = await User.findOne({
            _id: parsedJWT._id,
            'tokens.token': token,
        });
        if (!user) {
            throw Error('Token bad token or expired');
        }
        // console.log(user);
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            message: error || 'You require to log in to fetch this route!',
        });
    }
};
