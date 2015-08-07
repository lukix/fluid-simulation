define(['jquery'], function ($) {
	var ret = {
		isSupported: function () {
			if (window.File && window.FileReader && window.FileList && window.Blob)
				return true;
			else
				return false;
		},
		handleFileSelect: function (event) {
			event.stopPropagation();
			event.preventDefault();
			$('#filePanel>div').html("Uploading...");
			$('#filePanel>div').removeClass("clickable");
			var file = event.dataTransfer.files[0];
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#filePanel>div').html("Click to run " + file.name + " or drop a new file");
				$('#filePanel>div').addClass("clickable");
				ret.onDataRecive(e.target.result);
			};
			reader.readAsText(file);
		},
		handleDragOver: function (e) {
			e.stopPropagation();
			e.preventDefault();
		},
		onDataRecive: function (data) {}
	}
	return ret;
});
