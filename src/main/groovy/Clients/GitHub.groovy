package Clients

import Traits.ConfigConsumable
import wslite.json.JSONArray
import wslite.rest.ContentType
import wslite.rest.RESTClient

/**
 * Created by Theodor on 2016-02-02.
 */
class GitHub implements ConfigConsumable {
    static Map getReleases() {
        try {
            def restClient = new RESTClient('https://api.github.com')
            def accesstoken = currentConfig().github.publicAccessToken
            def response = restClient.get(
                    accept: ContentType.JSON,
                    path: '/repos/libris/swepubanalys/releases',
                    headers: ["Authorization": "token ${accesstoken}"])
            assert 200 == response.statusCode
            assert response != null
            assert response.json instanceof JSONArray
            return [releases: response.json
                    .collect { r ->
                [tag         : r?.tag_name ?: "",
                 name        : r?.name ?: "",
                 body        : r?.body ?: "",
                 published_at: r?.published_at ?: "",
                 url         : r?.html_url ?: ""]
            }.findAll { r -> r.published_at != '' }]

        }
        catch (all) {
            return [releases: [], errorMessage: all.message]
        }

    }

}
