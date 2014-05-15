(function () {
    'use strict';

    var controllerId = 'speakers';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['common', 'datacontext', speakers]);

    function speakers(common, datacontext) {

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.speakers = [];

        vm.title = 'Speakers';

        activate();

        function activate() {
            common.activateController([getSpeakers()], controllerId)
                .then(function() { log('Activated Speakers View'); });
        }

        function getSpeakers()
        {
            return datacontext.getSpeakerPartials().then(function(data)
            {
                return vm.speakers = data;
            });
        }
    }
})();
