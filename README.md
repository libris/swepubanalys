# Source code for  SwePub för analys och bibliometri

This is the source code for the web interface for the SwePub för analys och bibliometri service - SwePub for analysis and bibliometrics (http://bibliometri.swepub.kb.se/)

## Other related repositories
### Sparql library
There is a repository dedicated for direct SPARQL interaction with the data in SwePub at https://github.com/libris/swepub-sparql

### Data loading utilities
There is also a git project that handles the different parts of data loading of Swepub för analys och bibliometri, _SwePub data loading_. This is not a public repo and is located internally at KB        

The _SwePub data loading_ repo handles:
* Loading of data into Virtuoso, including the extraction and triplifying of MODS records from the OAI-PMH harvester via the _Leyes_ database
* Making "complete" data dumps in SQL format from Sparql queries
* Loading data into Elasticsearch to facilitate for faster result counting and graph drawing in the web interface
* Triplifying external CSV sources
* Keeping track of external sources like DOAJ to facilitate for historic data
* bash scripts for running the above utilities

## Dependencies
* install groovy (>2.4.0) from http://groovy-lang.org/download.html (or use a package manager, e.g.: `brew install groovy`).    
* Install gradle from http://gradle.org/ (or use a package manager, e.g.: `brew install gradle`).   
* Install node from https://nodejs.org (or use a package manager, e.g.: `brew install node`).   
* Install bower from http://bower.io/ (or use a package manager, e.g.: `npm install -g bower`). 
* Install webpack from https://webpack.github.io/  (or use a package manager, e.g.: `npm install webpack -g`)
* Install elasticsearch from http://elasticsearch.org/ (or use a package manager, e.g.: `brew install elasticsearch`).
## typical build command
`gradle clean build npmInstall bowerInstall webpack war`
## Running SwePub för analys och bibliometri on Tomcat
* Download the sourcecode
* Open a commandline tool and go to the root folder of the project
* Run gradle clean build npmInstall bowerInstall webpack war
* Locate the war file in the build/libs directory
* Drop the war file into a Tomcat server and point your browser to http://[Your url goes here]

## Running Swepub för analys och bibliometri on Jetty
There is a Gradle task configured to run Jetty, _runWebApp_.   
  `gradle clean build npmInstall bowerInstall webpack war runWebApp` should get you going

## Front-end documentation
Swepub for analys and bibliometri is a client heavy web application that needs javascript to run. The client parts are built using vue.js. Please see the [Front-end documentation](src/main/resources/client/README.md) for more information.

## Virtuoso prerequisites
To be able to write to Virtuoso you need to configure a user in your configvalues.groovy file.
The user need the following permissions set in Virtuoso:   
SPARQL_SELECT   
SPARQL_UPDATE   
The user also need to be granted permission to the following graph     
DB.DBA.RDF_GRAPH_USER_PERMS_SET ('http://swepub.kb.se/analysis/adjudication/data#graph', 'adjudicator', 3);

