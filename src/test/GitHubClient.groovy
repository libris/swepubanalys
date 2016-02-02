import Clients.GitHub
import org.junit.Test
import wslite.json.JSONObject

/**
 * Created by Theodor on 2016-02-02.
 */
class GitHubClient {
    @Test
    void getReleases(){
        def a = GitHub.getReleases()
        assert a
        assert a instanceof JSONObject

    }
}
