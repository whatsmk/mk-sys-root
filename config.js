import webapi from './webapi'

var _options = {
	webapi,
	startAppName: 'mk-sys-sign-in'
}

function config(options) {
	if (options) {
		Object.assign(_options, options)
	}
}

config.current = _options

export default config