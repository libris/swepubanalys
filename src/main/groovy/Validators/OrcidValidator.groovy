package Validators

import org.apache.commons.validator.routines.UrlValidator

/**
 * Created by Theodor on 2015-10-18.
 */
class OrcidValidator {
    static Map validateOrcid(String orcid){
        def falseResult = { String errorMessage ->  [result:false, reason:"${errorMessage}"]}
        def  correctCheckDigit= { String digits ->
            digits[digits.length()-1] == generateCheckDigitGroovy(digits[0..digits.length()-2])
        }

        if(!orcid)
            return falseResult("Orcid är tom")

        String[] schemes = ["http","https"]
        UrlValidator urlValidator = new UrlValidator(schemes);
        if( !urlValidator.isValid(orcid))
            return falseResult("Felaktigt utformad url")

        URI url = new URI(orcid)


        if(url.host != "orcid.org")
            return falseResult("Felaktig domän. Domänen måste vara orcid.org")

        def digits  =  url.path[1..url.path.length() - 1].replace("-","");
        if(digits.length()<16)
            return falseResult("Innehåller för få tecken")
        if(!(digits ==~ /\d*/))
            return falseResult("Innehåller otillåtna tecken")
        if(!correctCheckDigit(digits))
            return falseResult("Felaktig slutsiffra")
        else return [result:true]

    }



    public static String generateCheckDigitGroovy(String baseDigits){
        def res = (12-(baseDigits.inject(0){tot, it->(tot + it.toInteger())*2} % 11)%11)
        return res == 10 ? "X" : String.valueOf(res);
    }
}
