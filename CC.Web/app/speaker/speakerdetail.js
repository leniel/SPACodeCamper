(function()
{
    'use strict';

    var controllerId = 'speakerdetail';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['$routeParams', 'common', 'config', 'datacontext', speakerdetail]);

    function speakerdetail($routeParams, common, config, datacontext)
    {
        var vm = this;

        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.speaker = undefined;
        vm.speakerIdParameter = $routeParams.id;

        vm.getTitle = getTitle;

        vm.activate = activate;
        vm.title = 'speakerdetail';

        activate();

        function activate() {
            common.activateController([getRequestedSpeaker()], controllerId);
        }

        function getRequestedSpeaker()
        {
            var val = $routeParams.id;

            datacontext.speaker.getById(val)
                .then(function(data)
                {
                    vm.speaker = data;

                }, function(error)
                {

                    logError('Unable to get Speaker ' + val);
                });
        }

        function getTitle()
        {
            return 'Edit ' + ((vm.speaker && vm.speaker.fullName) || '');
        }

    }
})();
