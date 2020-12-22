const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const parsedJWT = jwt.verify(token, process.env.JWT_SECERET_KEY);
        // console.log(parsedJWT);
        if (Date.now() < parsedJWT.exp || !parsedJWT._id) {
            throw Error('Token bad token or expired');
        }

        const user = await User.findOne({
            _id: parsedJWT._id,
            'tokens.token': token,
        }).select('+tokens');
        if (!user) {
            throw Error('Token bad token or expired');
        }
        await user
            .populate({
                path: 'tasks',
                select: 'description completed -owner',
            })
            .execPopulate();
        // console.log(user);
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).send({
            message: error || 'You require to log in to fetch this route!',
        });
    }
};
