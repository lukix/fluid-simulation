requirejs.config({
	'paths': {
		'jquery': ['../lib/jquery-1.11.2.min']
	}
});
require(
	['jquery', 'initWorld', './ui/ui'], function($, initWorld, ui) {
		var world = initWorld();
		ui(world);
	}
);
