import org.junit.Test

/**
 * Created by Theodor on 2016-01-08.
 */
class DuplicateCandidates {
    @Test
    void getGraphWrongUser() {
        assert !Doers.Deduplicator.getGraph('test', 'test')
    }

    @Test
    void getGraphCorrectUser() {
        def config = new ConfigSlurper().parse(DuplicateCandidates.getClassLoader().getResource("config.groovy"))
        def graph =  Doers.Deduplicator.getGraph((String)config.virtuoso.jdbcUser, (String)config.virtuoso.jdbcPwd)
        assert graph
    }

    @Test
    void crud(){
        def config = new ConfigSlurper().parse(DuplicateCandidates.getClassLoader().getResource("config.groovy"))
        def graph =  Doers.Deduplicator.getGraph((String)config.virtuoso.jdbcUser, (String)config.virtuoso.jdbcPwd)
        assert graph
        def id1 = Doers.Deduplicator.getIdentifierValue('http://urn.kb.se/resolve?urn=urn:nbn:se:uu:diva-206294')
        def id2 = Doers.Deduplicator.getIdentifierValue('http://urn.kb.se/resolve?urn=urn:nbn:se:uu:diva-81607')
        assert id1
        assert id2
    }

}