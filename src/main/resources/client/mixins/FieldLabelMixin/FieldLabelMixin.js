'use strict';

/**
 * Field Label Mixin
 */
var FieldLabelMixin = {
	computed: {
		/**
		 * Compute a nice array of labels from the $data.fields object
		 */
		labels: function() {
			var labels = [];
			(this.fields || []).map(function(field) {
				(field.labels || []).map(function(d) {
					labels.push({
						$index: labels.length,
						$key: field.fieldName,
						$value: d.text
					});
				});
			});
			return labels;
		}
	}
};

module.exports = FieldLabelMixin;