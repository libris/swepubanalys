'use strict';

// Vendor
var $ = require('jquery');
var _cloneDeep = require('lodash/lang/cloneDeep');
var _assign = require('lodash/object/assign');
// Mixins
var ResultMixin = require('mixins/ResultMixin/ResultMixin.js');
// Utils
var SparqlUtil = require('utils/SparqlUtil/SparqlUtil.js');
var AuthenticationUtil = require('utils/AuthenticationUtil/AuthenticationUtil.js');
// CSS-modules
var styles = _assign(
    require('./AmbiguitiesList.css'),
    require('css/modules/StaticHeader.css')
);
// CSS
require('css/transitions.css');

var show = 20;

/**
 * Ambiguities List Component
 * @prop {Object} formModel
 * @prop {Object} fields
 * @prop {Function} onResultReceived
 * @prop {Function} onGenerateQuery
 */
var AmbiguitiesList = {
    mixins: [ResultMixin],
    props: [
        'formModel',
        'fields',
        'onResultReceived',
        'onGenerateQuery',
    ],
    template: require('./AmbiguitiesList.html'),
    data: function () {
        return {
            show: show,
            pendingUpdate: false,
            handleArticle: '',
            org: '',
            loggedIn: false,
            _styles: styles
        }
    },
    watch: {
        'formModel': function () {
            this.updateQuery();
        },
        'query': function () {
            this.$set('show', show);
            this.$set('pendingUpdate', true);
            this.getResult(this.query, function () {
                this.$set('pendingUpdate', false);
            }.bind(this));
        }
    },
    computed: {
        /**
         * Show only <this.show> amount of rows
         */
        ambiguities: function () {
            var ambiguities = ((this.result && this.result.results && this.result.results.bindings) ? this.result.results.bindings : []);
            return ambiguities.slice(0, this.show);
        }
    },
    ready: function () {
        AuthenticationUtil.authenticate(function (authenticated) {
            if (authenticated.isLoggedIn) {
                this.$set('loggedIn', true);
                this.$set('org', authenticated.organizationCode);
                console.log(authenticated);
            }
        }.bind(this));
        this.updateQuery();
    },
    methods: {
        /**
         * For old browsers
         */
        onScrollTable: function () {
            this.onScroll(this.$els.tableContainer);
        },
        /**
         * If we reach the bottom of the <tbody>, load more rows
         */
        onScrollTbody: function () {
            this.onScroll(this.$els.tBody);

        },
        /**
         * Load more rows
         */
        onScroll: function (el) {
            if ($(el).scrollTop() + $(el).innerHeight() >= $(el)[0].scrollHeight) {
                this.$set('show', this.show + show);
            }
        },
        mapName: function (nameShort) {
            var index = this.arrayObjectIndexOf(orgs, nameShort.value);
            return orgs[index].text;

        },
        arrayObjectIndexOf: function (myArray, searchTerm) {
            for (var i = 0; i < myArray.length; i++) {
                if (myArray[i].value === searchTerm) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * Set currently handled article
         * @param {Object} article
         */
        setHandleArticle: function (article) {
            // Show article
            var articles = this.result.results.bindings;
            var index = articles.indexOf(article);
            article = _cloneDeep(article);
            article.show = !article.show;
            articles.$set(index, article);
            // Fetch ambiguityCase
            if (!article.ambiguityCase && article.show === true) {
                article.loading = true;
                articles.$set(index, article);
                // Get ambiguities
                SparqlUtil.getAmbiguityCase(article._orgCode1.value, article._id1.value, article._orgCode2.value, article._id2.value, function (ambiguityCase) {
                    // Replace article object
                    article = _cloneDeep(article);
                    article.loading = false;
                    article.ambiguityCase = ambiguityCase;
                    var a = (article.ambiguityCase.hasAdjudication == 1 && article.ambiguityCase.isDuplicate == 0 && article.pendingChange != 0)
                    /*article = article;*/
                    articles.$set(index, article);
                }.bind(this));
            }
        },
        getPermissions: function (article, org) {
            return (article._orgCode1.value == org || article._orgCode2.value == org || org == 'kb');
        },
        decideArticle: function (article, decision) {
            article.error = null;
            if (article.ambiguityCase.isDuplicate && article.ambiguityCase.isDuplicate.value == decision) {
                // Do nothing...
                return;
            }
            var articles = this.result.results.bindings;
            var index = articles.indexOf(article);
            article = _cloneDeep(article);

            if (!article.ambiguityCase.isDuplicate) {
                article.ambiguityCase.isDuplicate = {value: null};
            }

            article.pendingChange = decision;
            articles.$set(index, article);
            var dataString = "recordId1=" + article.ambiguityCase.record1.Record + "&recordId2=" + article.ambiguityCase.record2.Record + "&sameOrDifferent=" + decision;
            $.ajax({
                type: "POST",
                url: "/api/2.0/deduplication/adjudicate",
                data: dataString,
                success: function (response) {
                    article.ambiguityCase.isDuplicate = decision;
                    article.ambiguityCase.hasAdjudication = 1;
                    article.pendingChange = null;
                    articles.$set(index, article);
                },
                error: function (response) {
                    article.error = decision;
                    article.pendingChange = null;
                    articles.$set(index, article);
                }
            });
        },
        /**
         * Update the query
         */
        updateQuery: function () {
            var formModel = this.formModel;
            formModel.filterFields = SparqlUtil.getFilterFields(this.formModel.templateName);
            var conf = {
                limit: false,
                formModel: formModel
            };
            SparqlUtil.generateQuery(conf, function (query) {
                this.$set('query', query);
                if (this.onGenerateQuery) {
                    this.onGenerateQuery(query);
                }
            }.bind(this));
        }
    }
};

var orgs = [
    {value: 'bth', text: 'Blekinge tekniska högskola'},
    {value: 'cth', text: 'Chalmers tekniska högskola'},
    {value: 'esh', text: 'Ersta Sköndal Bräcke högskola'},
    {value: 'fhs', text: 'Försvarshögskolan'},
    {value: 'gih', text: 'Gymnastik- och idrottshögskolan'},
    {value: 'gu', text: 'Göteborgs universitet'},
    {value: 'du', text: 'Högskolan Dalarna'},
    {value: 'hkr', text: 'Högskolan Kristianstad'},
    {value: 'hv', text: 'Högskolan Väst'},
    {value: 'hb', text: 'Högskolan i Borås'},
    {value: 'hig', text: 'Högskolan i Gävle'},
    {value: 'hh', text: 'Högskolan i Halmstad'},
    {value: 'hj', text: 'Högskolan i Jönköping'},
    {value: 'his', text: 'Högskolan i Skövde'},
    {value: 'kkh', text: 'Kungl. Konsthögskolan'},
    {value: 'kth', text: 'Kungl. Tekniska högskolan'},
    {value: 'kau', text: 'Karlstads universitet'},
    {value: 'ki', text: 'Karolinska institutet'},
    {value: 'konstfack', text: 'Konstfack'},
    {value: 'kmh', text: 'Kungl. Musikhögskolan'},
    {value: 'liu', text: 'Linköpings universitet'},
    {value: 'lnu', text: 'Linnéuniversitetet'},
    {value: 'ltu', text: 'Luleå tekniska universitet'},
    {value: 'lu', text: 'Lunds universitet'},
    {value: 'mah', text: 'Malmö universitet'},
    {value: 'miun', text: 'Mittuniversitetet'},
    {value: 'mdh', text: 'Mälardalens högskola'},
    {value: 'nationalmuseum', text: 'Nationalmuseum'},
    {value: 'nrm', text: 'Naturhistoriska riksmuseet'},
    {value: 'naturvardsverket', text: 'Naturvårdsverket'},
    {value: 'nai', text: 'Nordiska Afrikainstitutet'},
    {value: 'ra', text: 'Riksarkivet'},
    {value: 'raa', text: 'Riksantikvarieämbetet'},
    {value: 'ri', text: 'RISE - Research Institutions of Sweden'},
    {value: 'rkh', text: 'Röda korsets högskola'},
    {value: 'shh', text: 'Sophiahemmet högskola'},
    {value: 'ths', text: 'Teologiska högskolan Stockholm'},
    {value: 'vti', text: 'Statens väg- och transportforskningsinstitut'},
    {value: 'uniarts', text: 'Stockholms konstnärliga högskola'},
    {value: 'su', text: 'Stockholms universitet'},
    {value: 'slu', text: 'Sveriges lantbruksuniversitet'},
    {value: 'sh', text: 'Södertörns högskola'},
    {value: 'umu', text: 'Umeå universitet'},
    {value: 'uu', text: 'Uppsala universitet'},
    {value: 'oru', text: 'Örebro universitet'}
];

module.exports = AmbiguitiesList;
