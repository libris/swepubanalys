import doers.AmbiguityCase
import org.junit.Test

/**
 * Created by Theodor on 2016-06-30.
 */
class AmbiguityCases {
    @Test
    void totalMatchWeightFromAmbiguityCase() {


        def ambiguityCase = new AmbiguityCase(
                "oai:DiVA.org:du-20573",
                "oai:DiVA.org:hig-20785",
                "du",
                "hig"
        )
        assert ambiguityCase.matchWeight > 0.1
    }
}
