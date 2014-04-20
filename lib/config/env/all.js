'use strict';

var path = require('path');

var rootPath = path.normalize(__dirname + '/../../..');

var conf = module.exports = {
  root: rootPath,
  port: process.env.PORT || 9000,
	mailgun_apikey: process.env.MAILGUN_APIKEY,
	mailgun_domain: 'homeparti.es'
};

if (!conf.mailgun_apikey) {
	throw new Error('Damnit');
} 
