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
        def result = validators.OrcidValidator.validateOrcid(url);
        assert result.result == false;

    }
    @Test
    public  void emptyOrcid(){
        def orcid = ""
        def result = validators.OrcidValidator.validateOrcid(orcid);
        assert result.result == false;

    }
    @Test
    public  void nullOrcid(){
        def orcid = null
        def result = validators.OrcidValidator.validateOrcid(orcid);
        assert result.result == false;

    }
    @Test
    public  void invalidDomain(){
        def url = "http://apa.com"
        def result = validators.OrcidValidator.validateOrcid(url);
        assert result.result == false;

    }

    @Test
    public  void tooShort(){
        def url = "http://orcid.org/888888888888888"
        def result = validators.OrcidValidator.validateOrcid(url);
        assert result.result == false;
        assert result.reason == "Innehåller för få tecken";

    }
    @Test
    public  void forbiddenCharacters(){
        def url = "http://orcid.org/88888888888888++88"
        def result = validators.OrcidValidator.validateOrcid(url);
        assert result.result == false;
        assert result.reason == "Innehåller otillåtna tecken";

    }
    @Test
    public  void validDashes(){
        def url = "http://orcid.org/0000-0002-5444-7276";
        def result = validators.OrcidValidator.validateOrcid(url);
        assert result.result == true;
    }
    @Test
    public  void noDashes(){

        def url = "http://orcid.org/0000000254447276";
        def result = validators.OrcidValidator.validateOrcid(url);
        assert result.result == true;
    }

    @Test
    public  void wrongCheckSum(){

        def url = "http://orcid.org/0000000254447275";
        def result = validators.OrcidValidator.validateOrcid(url);
        assert result.result == false;
        assert result.reason == "Felaktig slutsiffra";
    }

    @Test
    public  void rightCheckSum(){

        def url = "http://orcid.org/0000000254447276";
        def result = validators.OrcidValidator.validateOrcid(url);
        assert result.result == true;
    }

    @Test
    public  void sameCheckSumImplementation(){

        def orcid = "000000025444727";
        assert generateCheckDigitJava(orcid) == "6";
        assert validators.OrcidValidator.generateCheckDigitGroovy(orcid) == "6";


    }
    @Test
    public  void sameCheckSumImplementation10(){

        def orcid = "000000017510606";
        assert generateCheckDigitJava(orcid) == "X";
        assert validators.OrcidValidator.generateCheckDigitGroovy(orcid) == "X";


    }

    @Test
    public  void domainOnly(){

        def orcid = "http://orcid.org/";
        def result = validators.OrcidValidator.validateOrcid(orcid);
        assert result.result == false;

    }
    @Test
    public  void domainOnlyNoTrailingSlashw(){

        def orcid = "http://orcid.org";
        def result = validators.OrcidValidator.validateOrcid(orcid);
        assert result.result == false;

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
