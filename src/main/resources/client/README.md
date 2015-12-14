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
Components are styled using CSS modules using the Webpack css-loader (https://github.com/webpack/css-loader) to avoid conflicting class-names. We use them the following way:

Require a .css-file using the "modules" query parameter.
```
var styles = require('!!style!css?modules!./MyComponent.css');
```
Add it to the component data-function. We use an underscore-convention to avoid the style object being proxied by Vue.
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
var myStyles = require('!!style!css?modules!./MyComponent.css');
var myOtherStyles = require('!!style!css?modules!css/MyOtherCSSModules.css');

var styles = _.assign(myStyles, myOtherStyles);
```
Our Webpack setup is also able to bundle .less-files. To do this, just follow the same steps as above and provide the less-loader parameter:
```
var myStyles = require('!!style!css?modules!less!./MyComponent.less'); // CSS modules
require('MyTheme.less'); // Will be pre-processed and bundled as global CSS
```
### \# Component mixins
To come.

### \# Unit testing
We use the Karma test-runner and the testing-framework Jasmine for writing unit tests. To run tests, do the following command in the project root:
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

Our components are expressed as object literals, and we have to mount them to the DOM in order to test behaviour during the Vue life-cycle. To be continued.
