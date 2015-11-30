var ComponentTest = require('utils/TestUtils/ComponentTest.js');

ComponentTest({
	component: require('./OrgInput.js'),
	inputProps: {
		field: {
			value: '',
			name: 'Organisation',
			suggestions: [
				{
					value: 'tu',
					text: 'Testing University'
				}
			],
		}
	},
	props: ':field.sync="field"',
	testFunction: function(Vue, Component, Parent) {
		describe('components/OrgInput/', function() {
			
			beforeEach(function() {
			});
			
			it('should have proper $data members and methods', function() {
				expect(typeof Component.orgs).toEqual('object');
				expect(Component.orgs.length).toEqual(0);
			});

			it('should listen to set-org-value event and update accordingly', function(done) {
				expect(Component.field.value).toEqual('');
				Component.$emit('set-org-value', 'tu');
				Vue.nextTick(function() {
					expect(Component.field.value).toEqual('tu');
					done();
				})
			}.bind(this));

			it('should get a clear field if provided with invalid org-value from set-org-value', function(done) {
				Component.$emit('set-org-value', 'asdasd');
				Vue.nextTick(function() {
					expect(Component.field.value).toEqual('');
					done();
				})
			})

			it('should react to mutation of $data.orgs and update $props.field', function(done) {
				// Mutate data
				Component.orgs.length = 0;
				Component.orgs.push({ value: 'liu' });
				Component.orgs.push({ value: 'cth' });
				Vue.nextTick(function() {
					expect(Component.field.value).toEqual('liu,cth');
					done();
				});
			});

		}.bind(this));
	}
});