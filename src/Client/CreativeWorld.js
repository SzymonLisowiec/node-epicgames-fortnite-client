const ENDPOINT = require('../../resources/Endpoint');
const { User } = require('epicgames-client');

class CreativeWorld {

	constructor (fn, data) {

		this.fn = fn;

		this.code = data.code || undefined;
		this.author = data.author || undefined;
		this.title = data.title || undefined;
		this.description = data.description || undefined;
		this.type = data.type || undefined;
		this.locale = data.locale || undefined;

	}

	async addToFavorites () {

		if(!this.code)
			return false;

		try {
            
			let { data } = await this.fn.http.send(
				'PUT',
				ENDPOINT.CREATIVE_FAVORITES + '/' +  this.fn.launcher.account.id + '/' + this.code,
				this.fn.auth.token_type + ' ' + this.fn.auth.access_token
			);

			return true;

		}catch(err){

			this.fn.launcher.debug.print(new Error(err));
			
		}

		return false;
	}

	static async getByCode (fn, code) {
		
		try {

			let { response: { body } } = await fn.http.sendGet('https://www.epicgames.com/fn/' + code, null, {}, false);
			let state = null;

			try {
				
				state = JSON.parse((/\<script\>\s{0,}window\.\_\_epic\_client\_state\s{0,}\=\s{0,}(.*)\s{0,}\;\s{0,}\n{0,}\s{0,}window\./g).exec(body)[1]);

			}catch(err){
				
				fn.launcher.debug.print(new Error('Cannot get react state of https://www.epicgames.com/fn/' + code));

			}
			
			if(state && state.CreativeModeStore.code.success){
				
				return new this(fn, {
					code,
					author: await User.get(fn.launcher, state.CreativeModeStore.code.displayName),
					title: state.CreativeModeStore.code.data.title,
					description: state.CreativeModeStore.code.data.tagline,
					type: state.CreativeModeStore.code.data.islandType,
					locale: state.CreativeModeStore.code.data.locale
				});

			}

		}catch(err){

			fn.launcher.debug.print(err);
			fn.launcher.debug.print(new Error('Cannot get creative world with code: ' + code));

		}

		return false;
	}
	
}

module.exports = CreativeWorld;