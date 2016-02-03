package Clients

import wslite.json.JSONArray
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2016-02-02.
 */
class GitHub {
    static getReleases() {
        try {
            def restClient = new RESTClient('https://api.github.com')
            def response = restClient.get(
                    accept: ContentType.JSON,
                    path: '/repos/libris/swepubanalys/releases')
            assert 200 == response.statusCode
            assert response != null
            assert response.json instanceof JSONArray
            return response.json
        }
        catch (all) {
            return new JSONArray()
        }

    }

}
