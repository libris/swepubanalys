var ComponentTest = require('utils/TestUtils/ComponentTest.js');

ComponentTest({
	component: require('./OutputInput.js'),
	inputProps: {
		field: {
			value: '',
			name: 'Output',
			suggestions: [
				{
					value: 'testing/testing-work',
					text: 'Testing work'
				}
			],
		}
	},
	props: ':field.sync="field"',
	testFunction: function(Vue, Component, Parent) {
		describe('components/OutputInput/', function() {
			
			it('should have proper $data members and methods', function() {
				expect(typeof Component.outputs).toEqual('object');
				expect(Component.outputs.length).toEqual(0);
			});

			it('should react to mutation of $data.outputs and update $props.field', function(done) {
				// Mutate data
				Component.outputs.length = 0;
				Component.outputs.push({ value: 'testing/testing-work' });
				Component.outputs.push({ value: 'testing/another-testing-work' });
				Vue.nextTick(function() {
					expect(Component.field.value).toEqual('testing/testing-work,testing/another-testing-work');
					done();
				});
			});

			it('should clear input on hide', function(done) {
				Component.onClickHideField();
				expect(Component.field.value).toEqual('testing/testing-work,testing/another-testing-work');
				Vue.nextTick(function() {
					expect(Component.field.value).toEqual('');
					done();
				});
			});

		}.bind(this));
	}
});