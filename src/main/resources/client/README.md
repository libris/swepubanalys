# SwePub Client
Vue.js, Webpack, Bootstrap, Less, Karma, Jasmine, 

## Table of Contents
1. [File tree](#file-tree)
2. [Entries](#entries)
3. [Component modules](#component-modules)
4. [Component mixins](#component-mixins)
5. [CSS modules](#css-modules)
6. [Unit testing](#unit-testing)

### \# <a name="file-tree"></a>File tree
```
|-- client/
    |
    |-- components/           	Vue-components
    |-- css/                  	CSS- and Less-files
    	|--- modules/           CSS/Less-modules (Module/Component-wide style rules)
    	|--- theme.less         Application-wide style rules
    	|--- ...                Other non-module styles such as transitions
    |-- docs/                 	Help-files and e-mail texts as markdown
    |-- entries/              	Entry-points for Webpack-bundles
    |   |-- bibliometrician/  	"Bibliometriker"-view
    |   |-- inspector/        	"Granskare"-view
    |-- mixins/               	Mixins for Vue-components
    |-- utils/                	Utility files for data modules, making ajax requests, formatting data, etc ...
```

### \# <a name="entries"></a>Entries
Within our application, entries correspond to one bundle - and ultimately to one view. They are the entry-points where Webpack start in order to create a bundle, which is why they are not expressed as a module themselves. They are, however, Vue components that are mounted to a DOM node explicitly - constituting the root node for the application. These components use other components, passing down props - effectively creating a hierarchical GUI structure. Trivial example:

**entries/MyView/MyView.js**
```
var Vue = require('vue');
var MyComponent = require('components/MyComponent/MyComponent.js');

var MyView = {
    template: require('./MyView.html'),
    components: {
        'my-component': MyComponent
    }
};

Vue.component('view', MyView);

new Vue({
	el: '#app'
});
```

**entries/MyView/MyView.html**
```
<div>
    <h1>My application</h1>
    <my-component text="hello world"></my-component>
</div>
```

### \# <a name="component-modules"></a>Component modules
Components consist typically of three files: .js-, .html- and (maybe) a .css-file. Trivial example:

**components/MyComponent/MyComponent.js** (Component module)

We define a component as a normal object, no need to do require('vue'). Comparing with the MVC paradigm, these components act as the "Model" and "Controller", if you will, since it handles both data and logic - although many components accept properties from parents, making them reusable. Possible properties are by convention listed as a @prop in the comment description. Templates are loaded using the Webpack html-loader (https://github.com/webpack/html-loader), and these lastly constitute the "View".
```
/**
 * My component
 * @prop {String} text
 */
var MyComponent = {
    props: ['text'],
    template: require('./MyComponent.html'),
    data: function() {
        return {
            title: 'My title',
        }
    }
};

module.exports = MyComponent;
```
**components/MyComponent/MyComponent.html**
```
<div>
    <h1>{{ title }}</h1> <!-- from data -->
    <p>{{ text }}</p> <!-- from props -->
</div>
```
**components/MyComponent/MyComponent.css**

The component css-file contains CSS-modules to be used within the template. Scroll down to "CSS modules" to see how.
```
.MyCSSModule {
    margin: 5px;
}
```
### \# <a name="component-mixins"></a>Component mixins
Reusable functionality is placed in mixins (http://vuejs.org/guide/mixins.html). Example:

We have a mixin called FormFieldValidationMixin which is used to validate form field values against given functions. The mixin itself contains logic for listening to value mutation, debouncing, testing the value against (possibly-) asynchronous test functions, "standard" validations functions, etc. It also contains adds an "errors" array to the component data(), which can be used in templates to display possible errors. 

components/OrcidInput/OrcidInput.js uses this mixin the following way:
```
var FormFieldValidationMixin = require('mixins/FormFieldValidationMixin/FormFieldValidationMixin.js');
```
```
var OrcidInput = {
	mixins: [HelpMixin, FormFieldValidationMixin, FormFieldLayoutMixin],
	...
	ready: function() {
		/**
	 	* This test-function asks server to validate the user provided orcid (field.value)
	 	* @param {Function} callback
	 	*/
		var isValidAccordingToServer = function(callback) {
			...
			callback(isValid || 'Ogiltig Orcid angivet');
		}
	
		// Set a validation listener to field.value and let it pass through the provided functions. 
		// this.isValidAccordingToRegexp is provided by the FormFieldValidationMixin by default,
		// and we have defined isValidaAccordingToServer above
		this.setValidationListeners('field.value', [this.isValidAccordingToRegexp, isValidAccordingToServer]);
	}
}
```
### \# <a name="css-modules"></a>CSS modules
To avoid conflicting class-names, components are styled by CSS modules using the Webpack css-loader (https://github.com/webpack/css-loader). If a .css or .less file is placed anywhere within components/, mixins/ or css/modules, it is loaded with an additional query parameter (css-loader?modules). This essentially hashes the selectors of the required .css/.less file(s) and makes the require-call return a map containing the selectors and corresponding hahses. To add a CSS module class to an element within the component view-template, do the following:

Define the map.
```
/**
 * components/MyComponent/MyComponent.js
 */ 
var styles = require('./MyComponent.css');
```
Add it to the component data-function. Prefix with an underscore to avoid the style object being proxied by Vue.
```
var MyComponent = {
    ...
    data: function() {
        return {
            _styles: styles
        }
    }
};
```
Use it within the corresponding component template. We have to access this variable through the $data-object due to the underscore.
```
<div class="{{ $data._styles.MyCSSModule }}"></div>
```
This will result in a hashed class name which will be equal to the corresponding css-selector within the Webpack-bundle. To get CSS modules from multiple files, we use either different data-members or the lodash-method _.assign, such as this:
```
var myStyles = require('./MyComponent.css');
var myOtherStyles = require('css/modules/MyOtherCSSModules.css');

var styles = _.assign(myStyles, myOtherStyles);
```
If your .css/.less file is within the aforementioned directories but you want to bundle them as global CSS, use the style-loader!css-loader chain explicitly. 
```
require('!!style!css!./MyComponent.less'); // Global css
require('!!style!css!less!css/MyTheme.less'); // Global css
```
The same goes loading CSS-modules from files which are placed outside of these directories.
```
var myStyles = require('!!style!css?modules!css/styles.css'); // CSS-modules
```
### \# <a name="unit-testing"></a>Unit testing
We use the Karma/Jasimne test-runner/testing-framework combination for writing unit tests. To run our unit tests, do the following command in the project root:
```
karma run
```
Karma is configured to run tests in Chrome and uses Webpack to build the needed bundles, where .test.js files constitute entry-points. To create a unit test, simply put a *.test.js file in any purposeful directory under client/.

From karma.conf.js:
```
files: [
	'src/main/resources/client/**/*.test.js',
],
preprocessors: {
	'src/main/resources/client/**/*.test.js': ['webpack']
},
```
#### Testing components
Our components are expressed as object literals, so in order to test life-cycle behaviour we have to mount them to the DOM. Therefore, we use the *ComponentTest.js-module* to mock a parent. This module takes a component as input, along with desired props and a test-function, and adds itself to document.body and executes the given test-function upon the ready()-hook. An example of a component unit test follows:
```
// components/MyComponent/MyComponent.test.js
var ComponentTest = require('utils/TestUtils/ComponentTest.js');

ComponentTest({

	// The component to test
	component: require('./MyComponent.js'),
	
	// Define data which can be sent as props
	inputProps: {
		theValue: 'test123'
	},

	// Define props string
	props: ':the-value.sync="theValue"',
	
	// Test function to be executed on ready()
	testFunction: function(Vue, Component, Parent) {
	
```
When testing events, we have to wait for the next Vue update cycle. We can use the done-callback to test async behaviour.
```
		// Lets see if my component is able to properly emit and react to an event
		
		it('should listen to the set-value event and $set(theValue) accordingly', function(done) {
		
			expect(Component.theValue).toEqual('test123');
			
			Component.$emit('set-value', '567');
			
			Vue.nextTick(function() {
				expect(Component.theValue).toEqual('567');
				done();
			});
			
		});
	}
});
```
