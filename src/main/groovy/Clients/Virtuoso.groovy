package clients

import traits.ConfigConsumable
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2015-09-09.
 * Works as an endpoint and proxy to a Virtuoso Server's Sparql endpoint
 * Also a place to put stuff that is related to the local Virtuoso installation such as
 * indexing stuff
 */
public class Virtuoso implements ConfigConsumable {

    static VirtuosoRESTClient() {
        return new RESTClient(currentConfig().virtuoso.location)
    }



    def post(String sparql, String contentType) {
        def response = VirtuosoRESTClient().post(
                accept: contentType == "application/json" ? ContentType.JSON : ContentType.TEXT,
                path: '/',
        ) {
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

    Map postGetBytes(String sparql, String contentType, int maxRows) {
        def response = VirtuosoRESTClient().post(
                accept: contentType,
                path: '/')
                {
                    type ContentType.URLENC
                    urlenc query: sparql, format: contentType, maxrows: maxRows.toString()
                }


        return [data: response.data, statusCode: response.statusCode, statusMessage: response.statusMessage]
    }

    static String getLastIndexDate() {
        try {
            def url = currentConfig().virtuoso.lastUpdateTimeStampLocation
            def restClient = new RESTClient(url)
            def response = restClient.get(
                    accept: ContentType.TEXT,
                    path: '')
            assert 200 == response.statusCode
            assert response != null
            def result = new String(response.data);
            assert !result.empty
            assert result.length() > 5
            return result
        }
        catch (all) {
            return ''
        }

    }
}