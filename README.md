# Source code for  SwePub för analys och bibliometri

This is the source code for the web interface for the SwePub för analys och bibliometri service - SwePub for analysis and bibliometrics (http://bibliometri.swepub.kb.se/)

### SPARQL-repository  

There is also a repository dedicated for direct SPARQL interaction with the data in SwePub at https://github.com/libris/swepub-sparql

Please note that configuration and a few more key koncepts are not yet implemented into the solution.

### Dependencies
* install groovy (>2.4.0) from http://groovy-lang.org/download.html (or use a package manager, e.g.: brew install groovy).    
* Install gradle from http://gradle.org/ (or use a package manager, e.g.: brew install gradle).   
* Install node from https://nodejs.org (or use a package manager, e.g.: brew install node).   
* Install bower from http://bower.io/ (or use a package manager, e.g.: npm install -g bower). 
* Install webpack from https://webpack.github.io/  (or use a package manager, e.g.: npm install webpack -g)
* Install elasticsearch from http://elasticsearch.org/ (or use a package manager, e.g.: brew install elasticsearch).

### Running SwePub för analys och bibliometri on Tomcat
* Download the sourcecode
* Open a commandline tool and go to the root folder of the project
* Run gradle clean build war
* Locate the war file in the build/libs directory
* Drop the war file into a Tomcat server and point your browser to http://[Your url goes here]/form

### Running Swepub för analys och bibliometri on Jetty
To come.

### Front-end documentation
[Link](src/main/resources/client/README.md)

### Virtuoso prerequisites
To be able to write to Virtuoso you need to configure a user in your configvalues.groovy file.
The user need the following permissions set:
SPARQL_SELECT
SPARQL_UPDATE
The user need to be granted permission to the following graph
DB.DBA.RDF_GRAPH_USER_PERMS_SET ('http://swepub.kb.se/analysis/adjudication/data#graph', 'adjudicator', 3);

