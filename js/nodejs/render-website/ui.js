define([
	'jquery'
	,'./DataProvider'
	,'./render'
	,'../../fluid-simulation-engine/base/World'
	,'../addBodies'
], function ($, DataProvider, render, World, addBodies) {
	return function (ctx, myCanvas) {
		var dataProvider;
		var isReady = false;
		if(!(window.File && window.FileReader && window.FileList && window.Blob))
			return false;
		document.getElementById("filePanel").addEventListener('dragover', preventDefault);
		document.getElementById("filePanel").addEventListener('drop', function (event) {
			preventDefault(event);
			var file = event.dataTransfer.files[0];
			setReadiness(false, file.name);
			dataProvider = new DataProvider(file, onDataProviderReady);
		});
		$('#filePanel>div').click(function () {
			if(isReady) {
				$('#filePanel').fadeOut();
				var world = new World(dataProvider.simulationData.width, dataProvider.simulationData.height);
				addBodies(world);
				render(dataProvider, world, ctx, myCanvas, function () {
					$('#filePanel').fadeIn();
					setReadiness(false, dataProvider.file.name);
					dataProvider = new DataProvider(dataProvider.file, onDataProviderReady);
				});
			}
		});
		function onDataProviderReady() {
			setReadiness(true, dataProvider.file.name);
		}
		function setReadiness(ready, fileName) {
			if(ready) {
				$('#filePanel>div')
					.html("Click to run " + fileName + " or drop a new file")
					.addClass("clickable");
				isReady = true;
			}
			else {
				$('#filePanel>div').html("Uploading...").removeClass("clickable");
				isReady = false;
			}
		}
		function preventDefault(event) {
			event.stopPropagation();
			event.preventDefault();
		}
		return true;
	}
});
