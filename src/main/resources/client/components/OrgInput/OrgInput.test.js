var ComponentTest = require('utils/TestUtils/ComponentTest.js');

ComponentTest({
	component: require('./OrgInput.js'),
	inputProps: {
		field: {
			value: '',
			name: 'Organisation',
			suggestions: [
				{
					value: 'liu',
					text: 'Linköpings Universitet'
				}
			],
		}
	},
	props: ':field.sync="field"',
	testFunction: function(Vue, Component) {
		describe('components/OrgInput/', function() {
			
			beforeEach(function() {
				spyOn(Component.$refs.orgAutocompleteInput, 'selectOption');
			});
			
			it('should have proper $data members and methods', function() {
				expect(typeof Component.orgs).toEqual('object');
				expect(Component.orgs.length).toEqual(0);
				expect(typeof Component.setValue).toEqual('function');
			});

			it('should call $refs.orgAutocompleteInput.selectOption on setValue', function() {
				Component.setValue('liu');
				expect(Component.$refs.orgAutocompleteInput.selectOption).toHaveBeenCalledWith('liu');
			}.bind(this));

			it('should react to mutation of $data.orgs and update $props.field', function(done) {
				expect(Component.field.value).toEqual('');
				// Mutate data
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