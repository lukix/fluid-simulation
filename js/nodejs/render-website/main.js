requirejs.config({
	'paths': {
		'jquery': ['../../lib/jquery-1.11.2.min']
	}
});
require(
	[
		 'jquery'
		,'./FileReaderModule'
		,'./render'
		,'../../fluid-simulation-engine/base/World'
		,'../addBodies'
	], function($, FileReaderModule, render, World, addBodies) {
		myCanvas = document.getElementById('canvas');
		myCanvas.width = $(myCanvas).width();
		myCanvas.height = $(myCanvas).height();
		if (!(ctx = myCanvas.getContext('2d')))
			return false;
		const ZOOM = 0.9;
		ctx.scale(ZOOM, ZOOM);

		var simulationData;
		if(FileReaderModule.isSupported()) {
			$('#filePicker').change(FileReaderModule.handleFileSelect);
			document.getElementById("filePanel").addEventListener('dragover', FileReaderModule.handleDragOver, false);
			document.getElementById("filePanel").addEventListener('drop', FileReaderModule.handleFileSelect, false);
			FileReaderModule.onDataRecive = function (data) {
				simulationData = JSON.parse(data);
			}
			$('#filePanel>div').click(function () {
				if(simulationData != null) {
					$('#filePanel').fadeOut();
					var world = new World(simulationData.width, simulationData.height);
					addBodies(world, simulationData.width, simulationData.height);
					render(simulationData, world, ctx, function () {
						$('#filePanel').fadeIn();
					});
				}
			});
		}
	}
);
