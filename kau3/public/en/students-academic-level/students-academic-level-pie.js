/**
 * New node file
 */
app
		.factory(
				'studentAcademicLevelPie',
				function($http, $q, $log) {

					var factory = {};

					/**
					 * Public functions
					 */

					factory.build = function(data) {
						return buildChart(data);
					};

					/**
					 * Private functions
					 */

					function buildChart(data) {
						var chart = {
							"type" : 'PieChart',
							"displayed" : true,
							"data" : {
								"cols" : buildCols(data),
								"rows" : buildRows(data)
							},
							"options" : {
								// "width" : "100%",
								// "height" : "450",
								"width" : '100%',
								"height" : '100%',
								// "pageSize" : "20",
								// "page" : "enable",
								// "showRowNumber" : false,
								// "sort" : "enable",
								"allowHtml" : "true",
								"legend" : "right",
								"legendMaxLines" : "10",
								"title" : buildTitle(data),
							}
						// ,
						// "formatters" : {
						// "number" : [ {
						// "columnNum" : 2,
						// "suffix" : "%",
						// "fractionDigits" : 2
						// } ]
						// }
						};
						return chart;
					}

					function buildCols(data) {

						return [ {
							"id" : 'descriptorId',
							"label" : 'Descriptor',
							"type" : "string",
							"p" : {
								"style" : "font-size:11px"
							},
						}, {
							"id" : 'studentsId',
							"label" : 'Students',
							"type" : "number",
							"p" : {
								"style" : "font-size:11px"
							}
						} ];

					}

					function buildRows(data) {

						var categoryIdOrder = _.pluck(data.categories, '_id');

						var tagCollections = calculateTagCollections(data.categories,
								data.tagFilterModel);
						var notYearTagCollectionByLevels = tagCollections.slice(1);
						var notYearTagCollection = calculateTagColletionsByLevelCombination(notYearTagCollectionByLevels);

						return _.map(data.indicators, function(indicator) {

							var tags = _.sortBy(indicator._tags, function(tag) {
								return categoryIdOrder.indexOf(tag._category);
							});

							tags = _.filter(tags, function(tag){
								return tagCollections[tags.indexOf(tag)].length > 1;
							});
							
							var descriptor = _.pluck(tags,'description').join(' ');
							
							var value = indicator.value;

							return {
								"c" : [ {
									"v" : descriptor,
									"p" : {
										"style" : "font-size:11px"
									}
								}, {
									"v" : value,
									"p" : {
										"style" : "font-size:11px"
									}
								} ]
							};
						});
					}

					/**
					 * 
					 * Private functions
					 * 
					 */

					function calculateTagCollections(categories, filter) {
						return _.map(categories, function(cat) {
							return _.filter(cat._tags, function(tag) {
								return filter[cat._id][tag._id];
							});
						});
					}

					function calculateTagColletionsByLevelCombination(tagCollections) {
						return _.reduce(tagCollections, function(acc, tagCollection) {
							return _.flatten(_.map(tagCollection, function(tag) {
								return _.map(acc, function(accCollection) {
									return accCollection.slice(0).concat(tag);
								});
							}), true);
						}, [ [] ]);

					}

					function buildTitle(data) {
						var tagCollections = calculateTagCollections(data.categories,
								data.tagFilterModel);

						var notYearTagCollectionByLevels = tagCollections.slice(1);

						var tagCollectionsOneTagOnly = _.filter(
								notYearTagCollectionByLevels, function(tagCollection) {
									return tagCollection.length == 1;
								});

						var tagCollectionsOneTagOnlyNotTotal = _.filter(
								tagCollectionsOneTagOnly, function(tagCollection) {
									return tagCollection[0].name != 'TO';
								});

						var yearTagCollection = tagCollections[0];

						var yearTitle = _.pluck(yearTagCollection, 'name').join(',');
						var titleTagCollection = _.flatten(
								tagCollectionsOneTagOnlyNotTotal, true);
						return _.pluck(titleTagCollection, 'description').join(' ').concat(
								' Students in ').concat(yearTitle);
					}

					return factory;
				});