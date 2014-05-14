(function()
{
    'use strict';

    // Controller name is handy for loging
    var controllerId = 'sessions';

    // Define the controller on the module.
    // Inject the dependencies.
    // Point to the Controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'datacontext', sessions]);

    function sessions(common, datacontext)
    {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Using 'Controller As' syntax, so we assign this to the vm variable.
        var vm = this;

        // Bindable properties and functions are placed on vm.
        vm.activate = activate;
        vm.sessions = [];
        vm.title = 'Sessions';

        activate();

        function activate()
        {
            common.activateController([getSessions()], controllerId)
                .then(function() { log('Activated Sessions View'); });
        }

        function getSessions()
        {
            return datacontext.getSessionPartials().then(function(data)
            {
                return vm.sessions = data;
            });
        }
    }
})();
