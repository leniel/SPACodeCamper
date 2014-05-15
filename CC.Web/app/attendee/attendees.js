(function () {
    'use strict';

    var controllerId = 'attendees';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['common', 'datacontext', attendees]);

    function attendees(common, datacontext) {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        vm.title = 'Attendees';
        vm.attendees = [];

        activate();

        function activate()
        {
            common.activateController([getAttendees()], controllerId)
                .then(function() { log('Activated Attendees View'); });
        }

        function getAttendees()
        {
            return datacontext.getAttendees().then(function(data)
            {
                return vm.attendees = data;
            });
        }
    }
})();
