'use strict';

//Vendor
var marked = require('marked');
// Components
var DuplicatesList = require('components/DuplicatesList/DuplicatesList.js');
var AuthenticationUtil = require('utils/AuthenticationUtil/AuthenticationUtil.js');
var MatchWeightHelp = require('components/Helps/MatchWeightHelp/MatchWeightHelp.js');
var MailExport = require('components/MailExport/MailExport.js');
var _assign = require('lodash/object/assign');
// Mixins
var AuthenticationMixin = require('mixins/AuthenticationMixin/AuthenticationMixin.js');
//Utils
var DataUtil = require('utils/DataUtil/DataUtil.js');
// CSS modules
var styles = _assign(
    require('./DuplicatesTool.css'),
    require('css/modules/Colors.less')
);

/**
 * Ambiguities Tool Component
 */
var DuplicatesTool = {
    mixins: [AuthenticationMixin],
    props: ['formModel', 'fields', 'onResultReceived'],
    template: require('./DuplicatesTool.html'),
    data: function () {
        return {
            query: '',
            _styles: styles,
            about: '',
            formModelHasChanged: false, // To let methods.updateQuery() know that formModel has changed and that a POST should be performed
            // UI state
            pendingRefresh: true,
            // Data
            totalHits: false
        }
    },
    components: {
        'duplicates-list': DuplicatesList,
        'match-weight-help': MatchWeightHelp,
        'mail-export': MailExport
    },
    ready: function () {
        this.$set('about', marked(require('docs/duplicates.md')));
        // Watch for mutation of formModel, regenerate query if this occurs
        this.$watch('formModel', function () {
            this.formModelChanged();
        }.bind(this));
        // Watch for deep mutation of filterFields, regenerate query if this occurs
        this.$watch('filterFields', function () {
            this.filterFieldsChanged();
        }.bind(this), {deep: true});
        // Generate query on ready hook
        this.formModelChanged();
    },
    methods: {
        /**
         * Sent as a callback to <ambiguities-list> in order to get the generated query used in <mail-export>
         * @param {String} query
         */
        onGenerateQuery: function (query) {
            this.$set('query', query);
        },
        onClickExternal: function () {
            localStorage.setItem('externalPass', true);
        },
        /**
         * Should be called if props.formModel has been received or updated. Gets appropriate filterFields according
         * to template name and updates data.filterFields accordingly
         */
        formModelChanged: function () {
            console.log(JSON.stringify(this.formModel))
            DataUtil.getFilterAggregations(this.formModel, function (aggregations) {
                if (aggregations && typeof aggregations.total_hits !== 'undefined') {
                    this.$set('totalHits', aggregations.total_hits);
                } else {
                    this.$set('totalHits', false);
                }
            }.bind(this));
        },
        /**
         * Should be called if data.filterFields has been mutated. This can be triggered either by the user interacting
         * with the GUI or if formModelChanged(). We subsequently updateQuery(), and let that function decide whether
         * to do a POST or not
         */
        filterFieldsChanged: function () {

        }

    }

};

module.exports = DuplicatesTool;
