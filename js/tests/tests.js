require(
	[
		 './testVector'
		,'./testLineSegment'
		,'./testPolygon'
		,'./testBody'
	], function(testVector, testLineSegment, testPolygon, testBody) {
		QUnit.assert.close = function(number, expected, relError, message) {
			var margin = relError*expected;
			var result = number >= expected-margin && number <= expected+margin;
			this.push(result, number, expected, message);
		}
		testVector();
		testLineSegment();
		testPolygon();
		testBody();
	}
);
