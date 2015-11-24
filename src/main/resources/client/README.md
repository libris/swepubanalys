# Swepub client
Vue.js, CommonJS-modules, Webpack, Karma, Jasmine, Bootstrap

### File tree
```
|-- client
    |
    |-- components            Vue-components
    |-- css                   CSS-modules
    |-- docs                  Help-files and e-mail texts as markdown
    |-- entries               Entry-points for Webpack-bundles
    |   |-- bibliometrician   "Bibliometriker"-view
    |   |-- inspector         "Granskare"-view
    |-- mixins                Mixins for Vue-components
    |-- utils                 Utility files for data modules, making ajax requests, formatting data, etc ...
```

### Views
To come.

### Vue components
Components consist typically of three files: .js-, .html- and (maybe) a .css-file.

#### Component mixins
To come.

#### CSS modules
Components are styled using CSS modules using the Webpack css-loader (https://github.com/webpack/css-loader) to avoid conflicting class-names. We use them the following way:

Add CSS modules to the data object of a component by doing a require using the "modules" query parameter.

```
var styles = require('!!style!css?modules!./MyCSSModules.css');
```
Add it to the component data-function. We use an underscore-convention to avoid the style object being proxied by Vue.
```
var MyVueComponent = {
    ...
    data: function() {
        return {
            _styles: styles
        }
    }
};
```
Use it within the corresponding component template.
```
<div class="{{ $data._styles.CSSModule }}"></div>
```
This will result in a hashed class name which will be equal to the corresponding css-selector within the Webpack-bundle. To get CSS modules from multiple files, we use either different data-members or the lodash-method _.assign.

### Unit tests
To come.
