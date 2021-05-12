const fs = require('fs');
const path = require('path');
const replace = require('replace');

const envInjector = () => {
	const filePath  = path.resolve(__dirname, '..', 'frontend', 'index.html');
	const regex = '<meta name="google-signin-client_id"(.*)>';
	const content = '<meta name="google-signin-client_id" content="' + process.env.GOOGLE_CLIENT_ID + '">'; 

	replace({
		regex: regex,
		replacement: content,
		paths: [filePath],
		recursive: false,
		silent: true
	});	
}

module.exports = envInjector;
