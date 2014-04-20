'use strict';
var user = require('../user');

function validate(data) {
	return data.name && data.email && data.password;
}

function createUser(data, fn) {
	var usr = user.createUser(data);
	console.dir('Created user: ' + usr.name + ' email: ' + usr.email);
	fn(null);
}

function signup(data, fn) {
	if (!validate(data)) {
		return fn({ code: 100, message: 'Validation error' });
	}
	createUser(data, fn);
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
