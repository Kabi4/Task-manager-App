const User = require('../models/User');

module.exports = verifyAdmin = async (req, res, next) => {
    try {
        if (!req.user.admin) {
            throw Error(
                'You are not authorized to do such malicious activity!Warning!Please do not access again!'
            );
        }
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).send({
            message: error || 'You require to log in to fetch this route!',
        });
    }
};
