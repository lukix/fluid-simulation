define(
  [
    './dataProvider'
    ,'../../fluid-simulation-engine/geometry/Polygon'
    ,'../../fluid-simulation-engine/geometry/Vector'
    ,'../../uiCommonModules/cameraSmartPoint'
    ,'./mainLoop'
  ], function (DataProvider, Polygon, Vector, cameraSmartPoint, mainLoop) {
	return function(renderer,camera) {
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
				mainLoop(dataProvider, camera, renderer, function () {
					$('#filePanel').fadeIn();
					setReadiness(false, dataProvider.file.name);
					dataProvider = new DataProvider(dataProvider.file, onDataProviderReady);
				});
			}
		});
		function onDataProviderReady() {
			setReadiness(true, dataProvider.file.name);
      var polygons = [];
      for(var i = 0; i < dataProvider.simulationData.frames[0].bodies.length; i++) {
        polygons.push(new Polygon(dataProvider.simulationData.frames[0].bodies[i]));
      }
      cameraSmartPoint(camera, polygons);
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
