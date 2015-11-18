package Clients

import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-09-09.
 * Works as an endpoint and proxy to a Virtuoso Server's Sparql endpoint
 */
public class Virtuoso {

    static VirtuosoRESTClient() {
        URL url = Virtuoso.getClassLoader().getResource("config.groovy");
        def config = new ConfigSlurper().parse(url)
        return new RESTClient(config.virtuoso.location)
    }

    public post(String sparql, String contentType) {
        def response = VirtuosoRESTClient().post(
                accept: contentType == "application/json" ? ContentType.JSON : ContentType.TEXT,
                path: '/',
                ){
            type ContentType.URLENC
            urlenc query: sparql, format: contentType
        }
        assert 200 == response.statusCode
        return contentType == "application/json" ? response.json : response.text;
    }

    def get(String sparql, String contentType) {
        def response = VirtuosoRESTClient().get(
                accept: contentType == "application/json" ? ContentType.JSON : ContentType.TEXT,
                path: '/',
                query: [query: sparql, format: contentType])
        assert 200 == response.statusCode
        return contentType == "application/json" ? response.json : response.text;
    }

    public Map postGetBytes(String sparql, String contentType, int maxRows) {
        def response = VirtuosoRESTClient().post(
                accept: contentType,
                path: '/')
                {
                    type ContentType.URLENC
                    urlenc query: sparql, format: contentType, maxrows: maxRows.toString()

                }


        return [data: response.data, statusCode: response.statusCode, statusMessage: response.statusMessage ]
    }
}