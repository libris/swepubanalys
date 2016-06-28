import doers.Deduplicator
import domain.DuplicateCase
import org.junit.Test

/**
 * Created by Theodor on 2016-01-08.
 */
class DuplicateCandidates {
    @Test
    void getGraphWrongUser() {
        assert !doers.Deduplicator.getGraph('test', 'test')
    }

    @Test
    void getGraphCorrectUser() {
        def config = new ConfigSlurper().parse(DuplicateCandidates.getClassLoader().getResource("config.groovy"))
        def graph = doers.Deduplicator.getGraph((String) config.virtuoso.jdbcUser, (String) config.virtuoso.jdbcPwd)
        assert graph
        graph.close()
        assert graph.isClosed()
    }

    @Test
    void crud() {
        //Setup
        def config = new ConfigSlurper().parse(DuplicateCandidates.getClassLoader().getResource("config.groovy"))
        def graph = doers.Deduplicator.getGraph((String) config.virtuoso.jdbcUser, (String) config.virtuoso.jdbcPwd)
        assert !graph.isClosed()
        def record1 = "http://swepub.kb.se/mods/data#Record__oai_DiVA_org_oru34906_1"
        def record2 = "http://swepub.kb.se/mods/data#Record__oai_DiVA_org_oru34910_1"
        Deduplicator.removeDuplicateCase(record1, record2, graph)
        Deduplicator.saveDuplicateCase(true, record1, record2, "test", "thetol", graph)
        List<DuplicateCase> after = doers.Deduplicator.getPreviouslyAdjudicated("oru")
        assert after.any { it -> [record1, record2].contains(it.record1) && [record1, record2].contains(it.record2) }
        graph.close()
        assert graph.isClosed()
    }



    @Test
    void getPreviouslyAdjudicated() {
        def nonFiltered = doers.Deduplicator.getPreviouslyAdjudicated("").count { it }
        assert nonFiltered > 0
        def filtered = doers.Deduplicator.getPreviouslyAdjudicated("du").count { it }
        assert filtered < nonFiltered
    }


}