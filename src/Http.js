let Request = require('request');

class Http {

    constructor (options) {

        this.jar = Request.jar();

        this.options = Object.assign({

            jar: this.jar,
            timeout: 30000,
            headers: {}

        }, options);

        this.request = Request.defaults(this.options);

    }

    getUserAgent () {
		return 'Fortnite/++Fortnite+Release-7.30-CL-4834550 Windows/10.0.17134.1.768.64bit';
	}

    setHeader (name, value) {
        this.options.headers[name] = value;
    }

    removeHeader (name) {
        delete this.options.headers[name];
    }

    send (method, url, auth, data, isJsonResponse, headers) {

        if(typeof isJsonResponse != 'boolean')
            isJsonResponse = true;

        return new Promise((resolve, reject) => {
            
            let options = Object.assign(this.options, {
                url
            });
            
            options.method = method;
            
            if(auth) options.headers.Authorization = auth;
            if(data) options.body = data;
            if(isJsonResponse) options.json = isJsonResponse;
            if(typeof headers === 'object') options.headers = Object.assign(options.headers, headers);

            this.request(options, (err, response, body) => {
				
                if(err){

                    reject(err);
                    return;

                }

                if(typeof body === 'object' && typeof body.errorCode != 'undefined'){
					
					switch(body.errorCode){

						case 'errors.com.epicgames.common.missing_action':
							reject('errors.com.epicgames.common.missing_action (Probably you running game first time on this account. You have to first run game on original launcher. Unfortunately I don\'t know how to resolve it at the moment.)');
							break;

						default:
							reject(body.errorCode);
							break;

					}
					
				}

                resolve({
                    response,
                    data: body
                });

            });

        }).catch(err => {

            console.log(new Error(err));

        });

    }

    sendGet (url, auth, data, isJsonResponse, headers) {
        return this.send('GET', url, auth, data, isJsonResponse, headers);
    }

    sendPost (url, auth, data, isJsonResponse, headers) {
        return this.send('POST', url, auth, data, isJsonResponse, headers);
    }

}

module.exports = Http;