package Clients

import wslite.json.JSONArray
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2016-02-02.
 */
class GitHub {
    static Map getReleases() {
        try {
            def restClient = new RESTClient('https://api.github.com')
            def response = restClient.get(
                    accept: ContentType.JSON,
                    path: '/repos/libris/swepubanalys/releases')
            assert 200 == response.statusCode
            assert response != null
            assert response.json instanceof JSONArray

            return [releases:response.json.collect { it ->
                [tag         : it?.tag_name ?: "",
                 name        : it?.name ?: "",
                 published_at: it?.published_at ?: "",
                 url         : it?.url ?: ""]
            }]

        }
        catch (all) {
            return [releaseInfo:[], errorMessage:all.message]
        }

    }

}
