(function()
{
    'use strict';

    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', '$window', '$q', 'common', 'config', shell]);

    function shell($rootScope, $window, $q, common, config)
    {
        var vm = this;

        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;

        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;
        vm.spinnerOptions = {
            radius: 40,
            lines: 7,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#F58A00'
        };

        activate();

        function activate()
        {
            logSuccess('CodeCamper Angular-Breeze loaded!', null, true);

            common.activateController([], controllerId)
                .then(function() {

                    vm.showSplash = false;
                });
        }

        function toggleSpinner(on) { vm.isBusy = on; }

    //    $rootScope.$on('$locationChangeStart',
    //function(event, current, previous)
    //{
    //    var answer = $window.confirm('Leave?');

    //    if(!answer)
    //    {
    //        event.preventDefault();

    //        return;
    //    }
    //});

        $rootScope.$on('$routeChangeStart',
            function(event, next, current) { toggleSpinner(true); }
        );

        $rootScope.$on(events.controllerActivateSuccess,
            function(data) { toggleSpinner(false); }
        );

        $rootScope.$on(events.spinnerToggle,
            function(data) { toggleSpinner(data.show); }
        );
    };
})();