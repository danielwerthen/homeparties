'use strict';
var user = require('../user');

function validate(data) {
	if (!(data.name && data.email && data.password)) {
		return false;
	}
	return true;
}

function createUser(data, fn) {
	var usr = user.create(data);
	console.dir('Created user: ' + usr.name + ' email: ' + usr.email);
	user.store(usr, fn);
}

function signup(data, fn) {
	if (!validate(data)) {
		return fn({ code: 100, message: 'Validation error' });
	}
	user.get(data.email, function (err, usr) {
		if (err || !usr) {
			return createUser(data, fn);
		}
		fn({ code: 101, message: 'Email is already in use'});
	});
}

module.exports = function (app) {
	return function (req, res) {
		signup(req.body, function (err, data) {
			if (err) {
				res.json(400, err);
			} else {
				res.json({ status: 'OK' });
			}
		});
	};
};
