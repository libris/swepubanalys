package SparqlInteractions

import wslite.rest.ContentType
import wslite.rest.RESTClient
/**
 * Created by Theodor on 2015-09-09.
 * Works as an endpoint and proxy to a Virtuoso Server's SparqlEndpoint
 */
public class SparqlEndPoint {

    RESTClient client = new RESTClient('http://virhp07.libris.kb.se/sparql')

    public post(String sparql, String contentType) {
        def response = client.post(
                accept: contentType == "application/json" ? ContentType.JSON : ContentType.TEXT,
                path: '/',
                query: [query: sparql, format: contentType])
        assert 200 == response.statusCode
        return contentType == "application/json" ? response.json : response.text;
    }

    def get(String sparql, String contentType) {
        def response = client.get(
                accept: contentType == "application/json" ? ContentType.JSON : ContentType.TEXT,
                path: '/',
                query: [query: sparql, format: contentType])
        assert 200 == response.statusCode
        return contentType == "application/json" ? response.json : response.text;
    }
}