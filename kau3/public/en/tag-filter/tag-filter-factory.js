/**
 * New node file
 */

app.factory('TagFilterFactory', function($log) {

	var factory = {};

	/**
	 * Public variables
	 */

	factory.title = 'Filter';
	factory.collapsed = false;
	factory.tagCategories = [];

	var model = [];

	function setTagCategories(pTagCategories) {
		factory.tagCategories = pTagCategories;
		model = [];
		_.each(factory.tagCategories, function(tc) {
			model[tc._id] = [];
			_.each(tc._tags, function(t) {
				model[tc._id][t._id] = false;
			});
		});
	}

	function setSelection(selected) {
		_.each(factory.tagCategories, function(tc) {
			_.each(tc._tags, function(t) {
				model[tc._id][t._id] = selected;
			});
		});
	}

	function selectFirsts() {
		_.each(factory.tagCategories, function(tc) {
			model[tc._id][_.find(tc._tags, function(t) {
				return t.order === 1;
			})._id] = true;
		});
	}

	function selectAll() {
		setSelection(true);
	}

	function unselectAll() {
		setSelection(false);
	}

	function getFilterPath() {
		var results = _.map(factory.tagCategories, function(tc) {
			return _.pluck(_.filter(tc._tags, function(t) {
				return model[tc._id][t._id];
			}), '_id').join();
		}).join('/').replace(/\/\//g, "/*/");
		return results;
	}

	function getNotEmptyTagCategories() {
		return _.filter(factory.tagCategories, function(cat) {
			return _.filter(cat._tags, function(tag) {
				return model[cat._id][tag._id];
			}).length > 0;
		});
	}

	/**
	 * Public functions
	 */

	factory.setTagCategories = setTagCategories;
	factory.unselectAll = unselectAll;
	factory.selectAll = selectAll;
	factory.selectFirsts = selectFirsts;
	factory.getFilterPath = getFilterPath;
	factory.getNotEmptyTagCategories = getNotEmptyTagCategories;

	return factory;
});