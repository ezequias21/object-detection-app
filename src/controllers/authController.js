const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
	const user = await User.findOne({ username: req.body.username });
    if (user) {
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (passwordMatch) {
			req.session.userId = user.id;
            res.redirect('/create-room')
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}


exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
        } else {
            res.redirect('/login');
        }
    });
}