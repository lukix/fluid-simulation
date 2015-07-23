define(function () {
	return function (world) {
		for(var i in world.coeffs) {
			var labelElement = $('<label></label>');
			labelElement.attr('for', 'coeffs_'+i);
			labelElement.html(i);
			var inputElement = $('<input type="number" step="0.1">');
			inputElement.attr('placeholder', i);
			inputElement.attr('title', i);
			inputElement.attr('id', 'coeffs_'+i);
			inputElement.val(world.coeffs[i]);
			$('form#coeffs').append(inputElement);
			$('form#coeffs').append(labelElement);
			$('form#coeffs').append('<br />');
		}
		$('form#coeffs input[type=number]').change(function () {
			var coeffName = $(this).attr('id').substr('coeffs_'.length);
			val = parseFloat($(this).val());
			if(isNaN(val)) {
				$(this).addClass('validateError');
			}
			else {
				$(this).removeClass('validateError');
				var coeffs = {};
				coeffs[coeffName] = val;
				world.setCoeffs(coeffs);
			}
		});
	}
})