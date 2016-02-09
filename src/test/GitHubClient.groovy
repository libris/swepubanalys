import Clients.GitHub
import org.junit.Test
import wslite.json.JSONObject

/**
 * Created by Theodor on 2016-02-02.
 */
class GitHubClient {
    @Test
    void getReleases(){
        def a = GitHub.releases
        assert a
        assert a.releases.count{it}>1

    }
}
