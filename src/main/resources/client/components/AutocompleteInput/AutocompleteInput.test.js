var ComponentTest = require('utils/TestUtils/ComponentTest.js');

ComponentTest({
	component: require('./AutocompleteInput.js'),
	inputProps: {
		vals: [],
		suggestions: [
			{
				value: 'tu',
				text: 'Testing University'
			},
			{
				value: 'ti',
				text: 'Testing Institution'
			}
		]
	},
	props: ':val.sync="vals" :options="suggestions"',
	testFunction: function(Vue, Component, Parent) {

		beforeEach(function() {
			
		});

		it('should listen to select-option event and update accordingly', function(done) {
			expect(Component.val.length).toEqual(0);
			Component.$emit('select-option', 'tu');
			Vue.nextTick(function() {
				expect(Component.val[0].value).toEqual('tu');
				expect(Component.val[0].text.trim()).toEqual('Testing University');
				done();
			});
		}.bind(this));

		it('should listen to select-option event and update accordingly (multiple options)', function(done) {
			Component.$emit('select-option', 'tu,ti');
			Vue.nextTick(function() {
				expect(Component.val[0].value).toEqual('tu');
				expect(Component.val[0].text.trim()).toEqual('Testing University');
				expect(Component.val[1].value).toEqual('ti');
				expect(Component.val[1].text.trim()).toEqual('Testing Institution');
				done();
			});
		}.bind(this));

		it('should have an empty field if provided with invalid option', function(done) {
			Component.$emit('select-option', 'asdasd');
			Vue.nextTick(function() {
				expect(Component.val.length).toEqual(0);
				done();
			})
		});

	}
});