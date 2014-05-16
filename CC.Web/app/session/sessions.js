(function()
{
    'use strict';

    // Controller name is handy for loging
    var controllerId = 'sessions';

    // Define the controller on the module.
    // Inject the dependencies.
    // Point to the Controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', sessions]);

    function sessions(common, config, datacontext)
    {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Using 'Controller As' syntax, so we assign this to the vm variable.
        var vm = this;

        // Bindable properties and functions are placed on vm.
        vm.sessions = [];
        vm.filteredSessions = [];
        vm.refresh = refresh;
        vm.search = search;
        vm.sessionsSearch = '';
        vm.sessionsFilter = sessionsFilter;
        vm.title = 'Sessions';

        activate();

        function applyFilter() { }

        function activate()
        {
            common.activateController([getSessions()], controllerId)
                .then(function() {

                    applyFilter = common.createSearchThrottle(vm, 'sessions');

                    if (vm.sessionsSearch) {
                        applyFilter(true);
                    }

                    log('Activated Sessions View');
                });
        }

        function getSessions(forceRefresh)
        {
            return datacontext.getSessionPartials(forceRefresh).then(function(data)
            {
               vm.sessions = vm.filteredSessions = data;
            });
        }

        function refresh()
        {
            getSessions(true);
        }

        function sessionsFilter(session) {
            var textContains = common.textContains;
            var searchText = vm.sessionsSearch;

            var isMatch = searchText ?
                textContains(session.title, searchText) ||
                textContains(session.tagsFormatted, searchText) ||
                textContains(session.room.name, searchText) ||
                textContains(session.track.name, searchText) ||
                textContains(session.speaker.fullName, searchText) : true;

            return isMatch;
        }
        
        function search($event)
        {
            if($event.keyCode == config.keyCodes.esc)
            {
                vm.sessionsSearch = '';

                applyFilter(true);
            } else {

                applyFilter();
            }
        }
    }
})();
