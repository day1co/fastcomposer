

function HotModuleRebuildPlugin() {
	// Setup the plugin instance with options...
}

HotModuleRebuildPlugin.prototype.apply = (compiler) => {

	compiler.plugin('emit', (compilation, callback) => {
		
		require('../build.js').buildAll();
		callback();
		
	});

};

module.exports = HotModuleRebuildPlugin;