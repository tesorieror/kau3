/**
 * New node file
 */

// var app = angular.module("app", [ "ui.bootstrap", "googlechart", "ngRoute",
// "ngAnimate" ]);
var app = angular.module("app", [ "ui.bootstrap", "ngRoute", "ngAnimate" ]);

/**
 * Avoid cache (review this for optimization)
 */
app.config([ '$httpProvider', function($httpProvider) {
	// initialize get if not there
	if (!$httpProvider.defaults.headers.get) {
		$httpProvider.defaults.headers.get = {};
	}
	// disable IE ajax request caching
	$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
} ]);

/**
 * Main Controller
 */

app
		.controller(
				"TableSampleCtrl",
				function($scope, $http, $q, $log, $document) {
					$log.info("MainCtrl controller loaded!");

					function drawTable() {
						var data = new google.visualization.DataTable();
						data.addColumn('string', 'Name');
						data.addColumn('number', 'Salary');
						data.addColumn('boolean', 'Full Time');
						data.addRows(5);
						data
								.setCell(0, 0,
										'John John John John John John John John John John John John John John John John John John John John John John');
						data.setCell(0, 1, 10000, '$10,000');
						data.setCell(0, 2, true);
						data.setCell(1, 0, 'Mary');
						data.setCell(1, 1, 25000, '$25,000');
						data.setCell(1, 2, true);
						data.setCell(2, 0, 'Steve');
						data.setCell(2, 1, 8000, '$8,000');
						data.setCell(2, 2, false);
						data.setCell(3, 0, 'Ellen');
						data.setCell(3, 1, 20000, '$20,000');
						data.setCell(3, 2, true);
						data.setCell(4, 0, 'Mike');
						data.setCell(4, 1, 12000, '$12,000');
						data.setCell(4, 2, false);

						data.setProperty(0, 0, "style", "white-space:nowrap;");

						function setWidth() {
							// $('.google-visualization-table-th:contains(' + 'Name' +
							// ')').css('width', '800px');

							// $('.google-visualization-table-th:contains(' + 'Name' +
							// ')').width('2000px');
//							$('.google-visualization-table-td').css('white-space', 'nowrap');
//							$('.google-visualization-table-td').css('background-color', 'RED');
							$log.log("Width SET!");
						}

						var table = new google.visualization.Table(document.getElementById('table_div'));

						google.visualization.events.addListener(table, 'select', function() {
							var row = table.getSelection()[0].row;
							alert('You selected ' + data.getValue(row, 0));
						});

						google.visualization.events.addListener(table, 'ready', function() {
							// google.visualization.events.addListener(table, 'ready',
							// setWidth);
							google.visualization.events.addListener(table, 'sort', setWidth);
							google.visualization.events.addListener(table, 'page', setWidth);
							setWidth();
						});

						table.draw(data, {
							showRowNumber : true,
							width : '100%',
							height : '100%',
							allowHtml : true
						});

					}

					$scope.drawTable = drawTable;

				});
