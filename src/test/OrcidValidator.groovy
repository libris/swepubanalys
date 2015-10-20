import org.junit.After
import org.junit.Before
import org.junit.Test

/**
 * Created by Theodor on 2015-10-12.
 */
class OrcidValidator {
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
    public  void emptyOrcid(){
        def orcid = ""
        def result = Controllers.OrcidInteractor.validateOrcid(orcid);
        assert result.result == false;

    }
    @Test
    public  void nullOrcid(){
        def orcid = null
        def result = Controllers.OrcidInteractor.validateOrcid(orcid);
        assert result.result == false;

    }
    @Test
    public  void invalidDomain(){
        def url = "http://apa.com"
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == false;

    }

    @Test
    public  void tooShort(){
        def url = "http://orcid.org/888888888888888"
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == false;
        assert result.reason == "Innehåller för få tecken";

    }
    @Test
    public  void forbiddenCharacters(){
        def url = "http://orcid.org/88888888888888++88"
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == false;
        assert result.reason == "Innehåller otillåtna tecken";

    }
    @Test
    public  void validDashes(){
        def url = "http://orcid.org/0000-0002-5444-7276";
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == true;
    }
    @Test
    public  void noDashes(){

        def url = "http://orcid.org/0000000254447276";
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == true;
    }

    @Test
    public  void wrongCheckSum(){

        def url = "http://orcid.org/0000000254447275";
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == false;
        assert result.reason == "Felaktig slutsiffra";
    }

    @Test
    public  void rightCheckSum(){

        def url = "http://orcid.org/0000000254447276";
        def result = Controllers.OrcidInteractor.validateOrcid(url);
        assert result.result == true;
    }

    @Test
    public  void sameCheckSumImplementation(){

        def orcid = "000000025444727";
        assert generateCheckDigitJava(orcid) == "6";
        assert Controllers.OrcidInteractor.generateCheckDigitGroovy(orcid) == "6";


    }
    @Test
    public  void sameCheckSumImplementation10(){

        def orcid = "000000017510606";
        assert generateCheckDigitJava(orcid) == "X";
        assert Controllers.OrcidInteractor.generateCheckDigitGroovy(orcid) == "X";


    }
    /**
     * Generates check digit as per ISO 7064 11,2.
     *
     */
    public static String generateCheckDigitJava(String baseDigits) {
        int total = 0;
        for (int i = 0; i < baseDigits.length(); i++) {
            int digit = Character.getNumericValue(baseDigits.charAt(i));
            total = (total + digit) * 2;
        }
        int remainder = total % 11;
        int result = (12 - remainder) % 11;
        return result == 10 ? "X" : String.valueOf(result);
    }

}
