import wslite.rest.ContentType
import wslite.rest.RESTClient

public class SparqlEndPoint {

    RESTClient client = new RESTClient('http://virhp07.libris.kb.se/sparql')

    public post(String sparql, String contentType) {
        def response = client.post(path: "/",accept: contentType == "application/json" ? ContentType.JSON : ContentType.TEXT)
                {

                    urlenc query: sparql, format: contentType
                }
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