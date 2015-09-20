jQuery(document).ready(function() {

// Warn if IE < version 11
    (function () {
        var msie_re = /MSIE\s+(\d+)/;
        var msie_res = undefined;
        msie_res = msie_re.exec(navigator.userAgent);

        if ( msie_res !== null ) {
            //if ( navigator.userAgent.indexOf('MSIE') !== -1 ) {
            if ( msie_res[1] < 11 ) {
                alert("TjÃ¤nsten fungerar bÃ¤st med  Internet Explorer 11 eller motsvarande modern webblÃ¤sare.");
                return false;
            }
        }
//console.log(msie_res);
    })();

    jQuery(".js-example-basic-multiple").select2({closeOnSelect:false, width:'resolve'});

    jQuery("div.responsive-tabs").click(function(e){
        jQuery("div.responsive-tabs .checkbox-dropdown").each(function(){
            if ( this !== e.target ) {
                jQuery(this).removeClass("is-active");
            }
        });
    });

    jQuery("#advanced_sparqlcode_submit").click(function(e){
        var q = jQuery(".advanced_sparqlcode").val();
        sessionStorage.setItem('form', 'advanced');
        sessionStorage.setItem('query', q);
        //console.log(q);
        //return false;
    });

    jQuery( window ).on('pageshow', function(e) {
        if ( sessionStorage.getItem('tab') !== '' ) {
            jQuery( sessionStorage.getItem('tab') ).click();
            sessionStorage.removeItem('tab');
        }
        return false;
    });

    jQuery(".osc_tooltip").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    if ( sessionStorage.getItem('query') !== '' ) {
        jQuery(".advanced_sparqlcode").val(sessionStorage.getItem('query'));
        //jQuery(".advanced_sparqlcode").focus();
        sessionStorage.removeItem('query');
    }

//sessionStorage.removeItem('form');

//return false;

});

