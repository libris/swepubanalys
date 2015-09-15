//"use strict";

var sprql = {
    query: '',
    template: '',
    hot_array: [],
    hot: null,
    hot_cols: [],
    hot_settings: {
        data: undefined,
        readOnly: true,
        colHeaders: false,
        contextMenu: false,
        minSpareRows: 0
    },
    url: 'http://virhp07.libris.kb.se/sparql',
    ftpurl: 'http://beta.swepub.kb.se/Data/query',
    templateurl: 'http://beta.swepub.kb.se/Data/templates',
    template_name: '',
    form: '',
    input2cols: {},
    filetype: {
        json: 'application/json',
        csv: 'text/csv',
        xml: 'application/xml',
    },
    input_changed: false,
    counthits: 0,
//heigth: undefined,
//width: undefined
};

jQuery( document ).ready( function ( $ ) {

    jQuery( "body" ).on('change', function (e) {
        var nid = e['target']['name'] || e['target']['id'] || '';
        try {
            do_sprql(false, false, nid, false); // 2nd arg REDO
        }
        catch(e) {
            alert(e.name + "\n\n" + e.message);
        }
    });

    $( window ).resize(function() {
        sprql.heigth = jQuery(this).height();
        sprql.width = jQuery(this).width();
        //console.log(sprql.heigth);
        //console.log(sprql.width);
        // set loader pos
        //jQuery("#loader").css('top', Math.floor(sprql.heigth/2));
        //jQuery("#loader").css('left', Math.floor(sprql.width/2));
    });

    jQuery("div.responsive-tabs").click(function(e){
        jQuery("div.responsive-tabs .checkbox-dropdown").each(function(){
            if ( this !== e.target ) {
                jQuery(this).removeClass("is-active");
            }
        });
    });

    jQuery(".checkbox-dropdown").click(function (e) {
        jQuery(this).toggleClass("is-active");
    });

    jQuery(".checkbox-dropdown ul").click(function (e) {
        e.stopPropagation();
    });

    jQuery(".back").click(function(e){
        //e.stopPropagation();
        //var hash = '';
        var tab = '';
        //sessionStorage.setItem('form', sprql.form);
        //console.log("back");
        //window.history.pushState({form: sprql.form}, '', '');
        switch(sprql.form) {
            case 'simple':
                tab = '#tablist1-tab1';
                //hash = 'enkel-utsÃ¶kning';
                break;
            case 'advanced':
                tab = '#tablist1-tab2';
                //hash = 'avancerad-utsÃ¶kning';
                break;
            case 'quality':
                tab = '#tablist1-tab3';
                //hash = 'datakvalitet';
                break;
            case 'duplicates':
                tab = '#tablist1-tab4';
                //hash = 'dubblettkandidater';
                break;
            case 'one_creator':
                tab = '#tablist1-tab5';
                //hash = 'publikationslista';
                break;
            default:
                tab = '#tablist1-tab1';
                //hash = 'enkel-utsÃ¶kning';
                break;
        }
        sessionStorage.setItem('tab', tab);
        window.history.back();
        //jQuery(tab).click();
        //window.location.href = '../uttag-av-data/?target=' + hash;
        return false;
    });

    jQuery("#hitsbtn").click(function(e){

        if ( sprql.counthits === 0 ) {
            sprql.counthits = 1;
            counthits(function(r){
                var da;
                var d = 0;

                da = r.match(/\d+/);

                if ( da !== null ) {
                    d = da[0];
                }

                jQuery("#hitsbtn").css('display', 'none');
                jQuery("#hitscount").html(d + " trÃ¤ffar");
                sprql.counthits = 0;
            });
        }
    });

    jQuery("body").ajaxStart(function(){
        show_loader(true);
        //console.log("start");
    });

    jQuery("body").ajaxStop(function(){
        show_loader(false);
        //console.log("end");
    });

    jQuery( "#generatefile" ).on('click', function(){
        getfile();
        jQuery(".exportdata div.checkbox-dropdown").removeClass("is-active");
    });


//jQuery("body").on('popstate', function(e){
//	console.log(e.state.form);
//});

//jQuery("#sparqltable").on('afterSelectionEndByProp', function(e){
// HOT hook instead?

    jQuery("#usesparql").click(function(e){
        //e.preventDefault();
        //e.stopPropagation();
        //e.stopImmediatePropagation();
        var q = createSprql(true);
        //sessionStorage.removeItem('query');
        sessionStorage.setItem('query', q);
        //console.log(sessionStorage.getItem('query'));
    });

//sprql.heigth = jQuery( window ).height(); // maybe not?
//sprql.width = jQuery( window ).width(); // ?

//var sl = "<div class=\"btn\" id=\"loader\" style=\"z-index:255; visibility: hidden; position: fixed; left: " + Math.floor(sprql.width/2) + "px; top: " + Math.floor(sprql.heigth/2) + "px;\">HÃ¤mtar data</div>";
//jQuery("body").prepend(jQuery(sl));

// form params
    sprql.form = sessionStorage.getItem('form');
    sessionStorage.removeItem('form');
    sprql.template = sessionStorage.getItem('query');
    sessionStorage.removeItem('query');

// mo
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null;

    if ( MutationObserver === null ) { throw { name: "MutationObserver", message: "No MutationObserver!" }; }

    var tgt = jQuery(".tablecol .checkbox-dropdown")[0];

    var cb_observer = new MutationObserver(function(ms){
        ms.forEach(function(m){
            try {
                if ( m.oldValue.search(/is-active/) > -1 ) {
                    // refresh input2cols index ?
                    if ( sprql.hot_cols.length !== 0 ) {
                        for (var k in sprql.input2cols) {
                            sprql.input2cols[k].index = null;
                            sprql.input2cols[k].default = false;
                        }
                        var i=0;
                        jQuery(".tablecol .checkbox-dropdown-list input:checked").each(function(){
                            //console.log(this.value);
                            sprql.input2cols[this.value].index = i++;
                            sprql.input2cols[this.value].default = true;
                        });
                    }
                    //console.log(sprql.input2cols);
                    if ( sprql.input_changed === true ) {
                        do_sprql(true, false, '', true);
                        sprql.input_changed = false;
                        jQuery("#ftplink").css("visibility", "hidden");
                        jQuery("#hitsbtn").css('display', 'inline');
                        jQuery("#hitscount").html('');
                    }
                }
            }
            catch(e) {
                alert(e.name + "\n\n" + e.message);
            }
        });
    });

    var ocfg = {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: [ "class" ]
    };

    cb_observer.observe(tgt, ocfg);

    if ( sprql.form === 'advanced' ) {
        if ( sprql.template !== '' ) {
            try {
                do_inputlist(sprql.template);
                do_sprql(true, false, '', false);
            }
            catch(e) {
                alert(e.name + "\n\n" + e.message);
            }
            return false;
        }
    }
    else {

        sprql.form = jQuery("#qterms input[name='form']").val()||'simple';

        sprql.template_name = sprql.form + '.sparql';

        jQuery.ajax({
            url: sprql.templateurl + '/' + sprql.template_name,
            type: 'GET',
            async: true,
            crossDomain: true,
            //contentType: 'text/plain',
            dataType: 'text',
            success: function(r) {
                sprql.template = r;
                try {
                    do_inputlist(r);
                    do_sprql(true, false, '', false);
                }
                catch(e) {
                    alert(e.name + "\n\n" + e.message);
                }
                return false;
            },
            error: function(){ throw { name: 'sparql', message: 'sparql template error'}; }
        });
    }

    jQuery(".osc_tooltip").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        return false;
    });


});

function show_loader(s){

    s = s || false;

    if (s) {
        jQuery("#loader").addClass('visible');
        //jQuery("#loader").css('visibility', 'visible');
    }
    else {
        jQuery("#loader").removeClass('visible');
        //jQuery("#loader").css('visibility', 'hidden');
    }
}

function do_inputlist(t) {

    var re = /[^]*?select\s*(?:distinct)?\s*([^]*?)where/i;
    var parent = undefined;
    var key = '';
    var name = '';
    var checked = '';
    var node = '';
    var key_name = undefined;
    var col_key_name = undefined;
    var res;
    var ic = 0;

    t = t.replace(/\r/g, '');
    res = re.exec(t);

    if ( res !== null ) {
        col_key_name = res[1].split('\n');
        parent = jQuery( ".tablecol .checkbox-dropdown-list");
        parent.empty();
        for (var i=0, l=col_key_name.length; i<l; i++) {
            if ( col_key_name[i].search(/^\s*$/) > -1 ) { continue; }
            key_name = col_key_name[i].split(/\s*#\s*/);
            // name != '?_....'
            key_name[1] = key_name[1] || key_name[0].charAt(2).toUpperCase() + key_name[0].slice(3);
            key_name[2] = key_name[2] || '';
            checked = (key_name[2] === '-')?false:true; // #- is unchecked in template
            node = "<li><label><input type=\"checkbox\" name=\"tablecol\" " + (checked?"checked=\"checked\"":'') + " value=\"" + key_name[0] + "\">" + key_name[1] + "</label></li>";
            parent.append(node);
            sprql.input2cols[key_name[0]] = { index: (checked?ic++:null), name: key_name[1], default: checked };
        }
        node = "<div style=\"float:right;\"><button style=\"margin:4px;\" class=\"btn btn-default btn-sm\" id=\"sel_none\">Inga</button><button style=\"margin:4px;\" class=\"btn btn-default btn-sm\" id=\"sel_all\">Alla</button></div>";
        parent.append(node);
        jQuery("#sel_none").on('click', function(e){
            e.stopPropagation();
            jQuery( ".tablecol .checkbox-dropdown-list input:checked" ).prop('checked', false);
            update_columns(true);
            //sprql.input_changed = true;
            // TODO empty query
        });
        jQuery("#sel_all").on('click', function(e){
            var i=0;
            e.stopPropagation();
            jQuery( ".tablecol .checkbox-dropdown-list input" ).each(function(){
                jQuery(this).prop('checked', true);
                sprql.input2cols[this.value].default = true;
                sprql.input2cols[this.value].index = i++;
            });
            try {
                do_sprql(true, false, '', true);
                sprql.input_changed = false;
            }
            catch(e) {
                alert(e.name + "\n\n" + e.message);
            }
        });
    }
    else {
        throw { name: 'tablecol', message: 'Couldn\'t create tablecol from sparql template.' };
    }
}

function getfile(){

    var filetype = jQuery("#exportdata input[name='filetype']:checked").val();
    var fileformat = sprql.filetype[filetype]||'text/csv';
//var fileformat = sprql.filetype[jQuery("#exportdata input[name='filetype']:checked").val()]||'text/csv';

//console.log(fileformat);

    var gettype = jQuery("#exportdata input[name='downloadtype']:checked").val()||'generatefile_browser';

    if ( gettype === 'downloadtype_browser' ) {
        if ( navigator.userAgent.indexOf('MSIE') !== -1 ) {
            jQuery.ajax({
                url: sprql.url,
                data: { query: sprql.query, format: fileformat },
                type: 'POST',
                async: true,
                crossDomain: true,
                dataType: 'text',
                //dataType: filetype==='csv' ? 'text': filetype,
                success: function(r){
                    //window.open('data:text/'+filetype+';charset=utf-8,'+encodeURIComponent(r));
                    var new_window = window.open();
                    //jQuery(new_window.document.body).append(r);
                    jQuery(new_window.document.html).remove();
                    new_window.document.write(r);
                    new_window.document.close();
                },
                error: function(){throw { name: 'http', message: 'http download error'};}
            });
            /* jQuery.post(sprql.url, {query: sprql.query, format: fileformat}, function(d){
             var new_window = window.open();
             jQuery(new_window.document.body).append(d);
             }); */
        }
        else {
            window.open(sprql.url + '?' + 'query=' + encodeURIComponent(sprql.query) + '&format=' + encodeURIComponent(fileformat));
        }
        return false;
    }
    else {
        jQuery.support.cors = true; // Important.
        if ( sprql.query !== '' ) {
            jQuery.ajax({
                url: sprql.ftpurl,
                data: { query: sprql.query, format: fileformat },
                type: 'POST',
                async: true,
                crossDomain: true,
                success: function(r) {
                    jQuery("#ftplink > a").attr('href', r);
                    jQuery("#ftplink > a").attr('target', '_blank');
                    jQuery("#ftplink > a").text(r);
                    jQuery("#ftplink").css("visibility", "visible");
                    // click to new window
                    return false;
                },
                error: function(){ throw { name: 'cors', message: 'cors error'}; }
            });
            //return false;
        }
    }

}

function do_sprql( dopost, quality, nid, refresh ) {

    dopost = dopost || false;
    quality = quality || false;
    nid = nid || '';
    refresh = refresh || false;


    var qr = '';

    if ( nid == 'tablecol' || nid == '' ) {
        sprql.query = createSprql(false);
        jQuery( "#sparqlcode" ).val(sprql.query);
    }


    if ( dopost ) {
        qr = createSprql(true);
        if ( qr !== '' ) {
            jQuery.ajax({
                url: sprql.url,
                data: { query: qr, format: 'application/json' },
                type: 'POST',
                async: true,
                crossDomain: true,
                //timeout: 60,
                statusCode: {
                    400: function(j) {
                        console.log(j);
                    }
                },
                success: function(r,s,j) {
                    json2table(r, refresh);
                    return false;
                },
                /*complete: function(j) {
                 //console.log(j);
                 switch (j.status) {
                 case 404: throw { name: 'sprql', message: '404'};
                 case 400: throw { name: 'sprql', message: '400'};
                 }
                 },*/
                error: function(){ throw { name: 'sprql', message: 'sparql preview failed.'}; }
            }).fail(function(){
                console.log(j);
                throw { name: 'sprql', message: 'error'};
                /*switch (j.status) {
                 case 404: throw { name: 'sprql', message: '404'};
                 case 400: throw { name: 'sprql', message: '400'};
                 }*/

            });
        }
    }
    else {
        if ( nid == 'tablecol' ) { // only when refreshed
            sprql.input_changed = true;
            recalc_index_data();
            update_columns(true);
            //console.log(sprql.hot_cols);
        }
    }

}

// calculates input2cols index and populates new handsontable columns
function recalc_index_data(){
    var input = jQuery( ".tablecol .checkbox-dropdown-list input:checked" ).serializeArray();
    var ic=-1;
    var i=0;
    var l=0;

    if ( sprql.hot !== null ) {
        for (i=0, l=input.length; i<l; i++) {
            if ( sprql.input2cols[input[i].value].default === false ) { // or index === null
                sprql.input2cols[input[i].value].default = true; // mark for upd
                ic=i;
                break;
            } // redo for multiple?
        }

        if ( ic > -1 ) { // modify hot
            i=0;
            jQuery(".tablecol .checkbox-dropdown-list input").each(function(){
                if ( sprql.input2cols[this.value].default === true ) {
                    sprql.input2cols[this.value].index = i++;
                    //console.log(this.value,sprql.input2cols[this.value].index);
                }
            });

            if ( (ic+1) > sprql.hot_array[0].length ) {
                // push
                sprql.hot_array[0].push(sprql.input2cols[input[ic].value].name);
                sprql.hot_array[1].push(input[ic].value.slice(1));
                for (i=2, l=sprql.hot_array.length; i<l; i++) {
                    sprql.hot_array[i].push("ej hÃ¤mtat");
                }
            }
            else {
                // splice
                var ik = sprql.input2cols[input[ic].value].index;
                if ( input[ic].value.slice(1) !== sprql.hot_array[1][ik]) {
                    sprql.hot_array[0].splice(ik, 0, sprql.input2cols[input[ic].value].name);
                    sprql.hot_array[1].splice(ik, 0, input[ic].value.slice(1));
                    for (i=2, l=sprql.hot_array.length; i<l; i++) {
                        sprql.hot_array[i].splice(ik, 0, "ej hÃ¤mtat");
                    }
                }
            }
        }
    }
    //console.log(sprql.input2cols);

}

// updates handsontable columns
function update_columns(update_settings) {

    update_settings = update_settings || false;

    var checked = jQuery( ".tablecol .checkbox-dropdown-list input:checked" ).serializeArray();
//console.log(checked);
    for (var l=sprql.hot_cols.length; l>0 ; l--) {
        sprql.hot_cols.pop(); // empty
    }
    for (var l=checked.length, i=0; i<l; i++) {
        sprql.hot_cols.push({data: sprql.input2cols[checked[i].value].index});
    }
    if ( sprql.hot_cols.length === 0 ) {
        sprql.hot_settings.data = null;
    }
    else {
        sprql.hot_settings.data = sprql.hot_array;
    }
//console.log(sprql.hot_cols);
    sprql.hot_settings.columns = sprql.hot_cols;
    if ( update_settings ) {
        sprql.hot.updateSettings(sprql.hot_settings);
        //sprql.hot.render();
    }
}

function json2table(a, rf){
    var cols = a['head']['vars'];
    var rows = a['results']['bindings'];
    var r = '';
    var row_array = null;
    rf = rf || false;
    if ( rf ) {
        for (var l=sprql.hot_array.length; l>0; l--) {
            sprql.hot_array.pop();
        }
    }
    if ( rows.length === 0 ) {
        if ( rf && sprql.results === true ) {
            jQuery('#sparqltable').destroy();
        }
        if ( ! jQuery("#nohits")[0] ) {
            jQuery("#sparqltable").before("<p id=\"nohits\">INGA TRÃ„FFAR</p>");
        }
        jQuery("#hits").css('display', 'none');
        sprql.results=false;
        return false;
    }
    else {
        if ( jQuery("#nohits")[0] ) {
            jQuery("#nohits").remove();
        }
    }
    sprql.hot_array.push([]); // column fullname
    sprql.hot_array.push([]); // column sparqlname
    for (var i=0, l=cols.length; i<l; i++) {
        sprql.hot_array[0].push(sprql.input2cols["?"+cols[i]].name);
        sprql.hot_array[1].push(cols[i]);
    }
    for (var i=0, l=rows.length; i<l; i++) {
        row_array = [];
        for (var j=0, ll=cols.length; j<ll; j++ ) {
            if ( rows[i][cols[j]] !== undefined ) {
                row_array.push(rows[i][cols[j]]['value']);
            }
            else {
                row_array.push('');
            }
        }
        sprql.hot_array.push(row_array);
    }

    //handsontable
    var container = jQuery('#sparqltable')[0]; // or .get(0)
    sprql.hot_settings.startRows = 0;
    sprql.hot_settings.startCols = 0;
    sprql.hot_settings.data = sprql.hot_array;
    if ( rf ) {
        update_columns(true);
        sprql.hot.render();
    }
    else {
        update_columns(false);
        sprql.hot = new Handsontable(container, sprql.hot_settings);
    }
    sprql.results=false;
    return true;
}

function qs(s) {

    var ss = s.split(',');

    for (var i=0, l=ss.length; i<l; i++) {
        ss[i] = '\'' + ss[i] + '\'';
    }

    return ss.join(',');
}

function createSprql(limit) {

    limit = limit || false;

    var query = sprql.template;
    var org = jQuery("#qterms input[name='org']").val() || '';
    var from = jQuery("#qterms input[name='from']").val() || '';
    var to = jQuery("#qterms input[name='to']").val() || '';
    var openaccess = jQuery("#qterms input[name='openaccess']").val() || '';
    var publtype = jQuery("#qterms input[name='publtype']").val() || '';
    var subject = jQuery("#qterms input[name='subject']").val() || '';
    var status = jQuery("#qterms input[name='status']").val() || '';
    var errortype = jQuery("#qterms input[name='errortype']").val() || '';
    var author = jQuery("#qterms input[name='author']").val() || '';
    var orcid = jQuery("#qterms input[name='orcid']").val() || '';

    var checked = undefined;
    var unchecked = undefined;
    var checked_string = '';
    var res = undefined;
    var options_string = '';
    var filters_string = '';
    var regex_string = '';
    var re_select = /((?:prefix.[^]*?)?select\s*(?:distinct)?\s*)[^]*?(where[^]*?)(###\s*FILTERS\s+[^]*)/i;
    var re = undefined;

    if (sprql.form !== 'advanced' ) {

        res = re_select.exec(query);

        if ( res !== null ) {
            query = res[1];
            options_string = res[2];
            filters_string = res[3]||'';
            checked = jQuery( ".tablecol .checkbox-dropdown-list input:checkbox:checked" ).serializeArray();
            if ( checked.length === 0 ) {
                return '';
            }
            for (var i=0, l=checked.length; i<l; i++) {
                checked_string += checked[i].value + '\n';
            }
            unchecked = jQuery( ".tablecol .checkbox-dropdown-list input:checkbox:not(:checked)" );
            unchecked.each(function() {
                regex_string = "#START_<\\" + this.value + ">[^]*?#END_<\\" + this.value + ">.*?";
                re = new RegExp(regex_string , 'i');
                options_string = options_string.replace(re, '');
            });

            if ( filters_string ) {
                if ( org ) {
                    if ( sprql.form === 'duplicates' ) {
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode1>(.*?)<\?_orgCode1>(.*)$/mi, "$1$2" + qs(org) + "$3");
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode2>(.*?)<\?_orgCode2>(.*)$/mi, "$1$2" + qs(org) + "$3");
                    }
                    else {
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orgCode>(.*?)<\?_orgCode>(.*)$/mi, "$1$2" + qs(org) + "$3");
                    }
                }
                if ( from ) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_pubYear_low>(.*?)<\?_pubYear_low>(.*)$/mi, "$1$2" + from + "$3");

                }
                if ( to ) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_pubYear_high>(.*?)<\?_pubYear_high>(.*)$/mi, "$1$2" + to + "$3");

                }
                if ( publtype ) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_publicatType>(.*?)<\?_publicatType>(.*)$/mi, "$1$2" + qs(publtype) + "$3");
                }
                if ( openaccess ) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_OA>(.*)$/mi, "$1$2");
                }
                if ( errortype ) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_violationType>(.*?)<\?_violationType>(.*)$/mi, "$1$2" + errortype + "$3");
                }
                if ( subject ) {
                    filters_string = filters_string.replace(/#(FILTER)_<\?_hsv3>(.*?)<\?_hsv3>(.*)$/mi, "$1$2" + subject + "$3");
                }
                if ( status ) {
                    if ( status !== 'all' ) {
                        filters_string = filters_string.replace(/#(FILTER)_<\?_isPublished>(.*?)<\?_isPublished>(.*)$/mi, "$1$2" + (status==='published'?"1":"0") + "$3");
                    }
                }
                if ( sprql.form === 'one_creator' ) {
                    if ( author && orcid ) {
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_NAME_FILTER>[^]*?#END_<ONE_CREATOR_NAME_FILTER>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_ORCID_FILTER>[^]*?#END_<ONE_CREATOR_ORCID_FILTER>.*?/, '');
                        author = "'" + author.split(/\s+/).map(function(v){return "\"" + v + "\"";}).join(' AND ') + "'"
                        filters_string = filters_string.replace(/#(FILTER)_<\?_name>(.*?)<\?_name>(.*?)$/mi, "$1$2" + author + "$3" );
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orcid>(.*?)<\?_orcid>(.*)$/mi, "$1$2" + "\"" + orcid + "\"" + "$3");
                    }
                    else if ( author ) {
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_TWO_FILTERS>[^]*?#END_<ONE_CREATOR_TWO_FILTERS>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_ORCID_FILTER>[^]*?#END_<ONE_CREATOR_ORCID_FILTER>.*?/, '');
                        author = "'" + author.split(/\s+/).map(function(v){return "\"" + v + "\"";}).join(' AND ') + "'"
                        filters_string = filters_string.replace(/#(FILTER)_<\?_name>(.*?)<\?_name>(.*)$/mi, "$1$2" + author + "$3");
                    }
                    else if ( orcid ) {
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_TWO_FILTERS>[^]*?#END_<ONE_CREATOR_TWO_FILTERS>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_NAME_FILTER>[^]*?#END_<ONE_CREATOR_NAME_FILTER>.*?/, '');
                        filters_string = filters_string.replace(/#(FILTER)_<\?_orcid>(.*?)<\?_orcid>(.*)$/mi, "$1$2" + "\"" + orcid + "\"" + "$3");
                    }
                    else {
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_TWO_FILTERS>[^]*?#END_<ONE_CREATOR_TWO_FILTERS>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_NAME_FILTER>[^]*?#END_<ONE_CREATOR_NAME_FILTER>.*?/, '');
                        filters_string = filters_string.replace(/#START_<ONE_CREATOR_ORCID_FILTER>[^]*?#END_<ONE_CREATOR_ORCID_FILTER>.*?/, '');

                    }
                }
            }
            if ( !limit ) {
                filters_string = filters_string.replace(/LIMIT\s+\d+\s*\n}\s*\n}\s*\n\s*LIMIT\s+\d+/i, 'LIMIT 10000000\n}\n}');
            }
            query += checked_string + options_string + filters_string;
            query = query.replace(/^\s*#.*$/gm, '');
            query = query.replace(/^\s*[\n\r\cM]*$/gm, '');
        }
        else {
            throw {name: 'query', messages: 'Query parse error.'};
        }
    }
    else {
        checked = jQuery( ".tablecol .checkbox-dropdown-list input:checkbox:checked" ).serializeArray();

        for (var i=0, l=checked.length; i<l; i++) {
            checked_string += checked[i].value + '\n';
        }

        re_select = /((?:prefix.[^]*?)?select\s*(?:distinct)?)[^]*?(where[^]*)/i;
        res = re_select.exec(query);
        if ( res === null ) {
            throw {name: 'advanced', message: 'Advanced query parse error.'};
        }

        query =  res[1] + checked_string + res[2];

        if ( !limit ) {
            // Kolla/skapa LIMIT
            query = query.replace(/LIMIT\s+\d+\s*\n}\s*\n}\s*\n\s*LIMIT\s+\d+/i, 'LIMIT 10000000\n}\n}');
        }
        else {
            // Kolla/skapa LIMIT 100
            if ( query.search(/LIMIT\s+\d+\s*$/i) > -1 ) {
                query = query.replace(/LIMIT\s+\d+\s*$/gmi, "LIMIT 100\n");
            }
            else {
                query += "\nLIMIT 100";
            }
        }
    }

//console.log(query);
    return query;
}

function counthits(f) {
// f is success function
    var q = '';
    var r = '';
    var res = undefined;
    var re = /([^]*?)?(select[^]*)/i;

    q = createSprql(false);

    if ( q !== '' ) {
        res = re.exec(q);
        if ( res !== null ) {
            r = res[1] + "select (count(*) AS ?_numRows) where\n{\n{\n" + res[2] + "\n}\n}";
            try {
                jQuery.ajax({
                    url: sprql.url,
                    data: { query: r, format: 'text/csv' },
                    type: 'POST',
                    async: true,
                    crossDomain: true,
                    success: function(r) {
                        f(r);
                        //console.log(r);
                        return false;
                    },
                    error: function(){ throw { name: 'sprql', message: 'sparql hits failed.'}; }
                });
            }
            catch (e) {
                alert(e.name + "\n\n" + e.message);
            }
        }
    }

    return r;
}

function sprqlorgs() {

    var q = 'SELECT DISTINCT ?_id ?_label WHERE { ?ResearchOrganization a swpa_m:ResearchOrganization . ?ResearchOrganization rdfs:label ?_label . ?ResearchOrganization swpa_m:hasIdentity ?Identity . ?Identity swpa_m:id ?_id . ?Identity swpa_m:authority ?_authority . FILTER(lang(?_label) = "sv" ) FILTER (?_authority = "swepub"^^xsd:string) } ORDER BY ASC( ?_label )';

    return q;
}