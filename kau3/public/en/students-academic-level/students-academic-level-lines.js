/**
 * New node file
 */
app
		.factory(
				'studentAcademicLevelLines',
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
							"type" : 'LineChart',
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
								"legend" : "bottom",
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

						var categories = data.categories.slice(1);
						var result = [];

						var result = [ {
							"id" : 'yearId',
							"label" : 'Year',
							"type" : "string",
							"p" : {
								"style" : "font-size:11px"
							},
						} ];

						var tagCollections = _.map(data.categories.slice(1), function(cat) {
							return _.filter(cat._tags, function(tag) {
								return data.tagFilterModel[cat._id][tag._id];
							});
						});

						console.log("tagCollections", tagCollections);

						var tagResult = _.reduce(tagCollections,
								function(acc, tagCollection) {
									return _.flatten(_.map(tagCollection, function(tag) {
										return _.map(acc, function(accCollection) {
											return accCollection.slice(0).concat(tag);
										});
									}), true);
								}, [ [] ]);

						console.log("Result", tagResult);

						var titles = _.map(tagResult, function(tagCollection) {
							return _.reduce(tagCollection, function(title, tag) {
								return title.concat((tag.name == 'TO' ? '' : tag.description
										.concat(' ')));
							}, '');
						});

						result = result.concat(_.map(titles, function(title) {
							return {
								"id" : title.concat('Id'),
								"label" : title,
								"type" : "number",
								"p" : {
									"style" : "font-size:11px"
								}
							}
						}));

						// console.log('Result', result);

						return result;
					}

					function buildRows(data) {

						var categoryIdOrder = _.pluck(data.categories, '_id');
						var indicatorData = {};
						_.each(data.indicators, function(indicator) {

							var tags = _.sortBy(indicator._tags, function(tag) {
								return categoryIdOrder.indexOf(tag._category);
							});

							yearTagId = tags[0]._id;
							if (!indicatorData[yearTagId]) {
								indicatorData[yearTagId] = {};
							}
							tags = tags.slice(1);
							var key = _.pluck(tags, '_id').join();

							indicatorData[yearTagId][key] = indicator.value;

						});

						var tagCollections = calculateTagCollections(data.categories,
								data.tagFilterModel);
						var yearTagCollection = tagCollections[0];
						var notYearTagCollectionByLevels = tagCollections.slice(1);
						var notYearTagCollection = calculateTagColletionsByLevelCombination(notYearTagCollectionByLevels);

						var keys = _.map(notYearTagCollection, function(tagCollection) {
							return _.pluck(tagCollection, '_id').join();
						});

						var result = _.map(yearTagCollection, function(yearTag) {
							var values = [ {
								"v" : yearTag.name,
								"p" : {
									"style" : "font-size:11px"
								}
							} ];
							values = values.concat(_.map(keys, function(key) {
								return {
									"v" : indicatorData[yearTag._id][key],
									"p" : {
										"style" : "font-size:11px"
									}
								}
							}));

							return {
								"c" : values
							};
						});
						console.log('Result', result);
						return result;
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

					return factory;
				});