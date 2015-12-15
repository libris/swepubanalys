# Swepub client
Vue.js, Webpack, Bootstrap, Less, Karma, Jasmine, 

### \# File tree
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

### \# Entries
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

### \# Vue components
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

### \# CSS modules
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
### \# Component mixins
To come.

### \# Unit testing
We use the Karma/Jasimne test-runner/testing-framework combination for writing unit tests. To run our unit tests, do the following command in the project root:
```
karma run
```
Karma is configured to run tests in Chrome and uses Webpack to build the needed bundles, where .test.js files constitute entry-points. To create a unit test, simply put a *.test.js file in a purposeful directory.

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
Our components are expressed as object literals, so in order to test life-cycle behaviour we have to mount them to the DOM. Therefore, we use a module that creates a mock-parent. This module, ComponentTest.js, takes a component as input, along with desired props and a test-function, and adds itself to document.body and executes the given test-function upon the ready()-hook. To write a unit test for a component using this module, do the following:
```
// components/MyComponent/MyComponent.test.js
var ComponentTest = require('utils/TestUtils/ComponentTest.js');
```
To be continued...
