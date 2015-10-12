import org.junit.After
import org.junit.Before
import org.junit.Test

/**
 * Created by Theodor on 2015-10-12.
 */
class OrcidInteractor {
    @Before
    public void setUp() throws Exception {
        println "Set Up"
    }
    @After
    public void tearDown() throws Exception{
        println "Tear Down"
    }

    @Test
    public  void invalidUrlFormat(){
        def url = "http.//:apa.com"
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == false;

    }
    @Test
    public  void invalidDomain(){
        def url = "http://apa.com"
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == false;

    }
}
