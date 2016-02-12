import org.junit.Test

/**
 * Created by Theodor on 2016-01-08.
 */
class DuplicateCandidates {
    @Test
    void getGraphWrongUser() {
        assert !Doers.DuplicateCandidateAdjudicator.getGraph('test', 'test')
    }

    @Test
    void getGraphCorrectUser() {
        def config = new ConfigSlurper().parse(DuplicateCandidates.getClassLoader().getResource("config.groovy"))
        def graph =  Doers.DuplicateCandidateAdjudicator.getGraph((String)config.virtuoso.jdbcUser, (String)config.virtuoso.jdbcPwd)
        assert graph
    }
}