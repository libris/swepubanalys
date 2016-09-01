import clients.GitHub
import org.junit.Test

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
