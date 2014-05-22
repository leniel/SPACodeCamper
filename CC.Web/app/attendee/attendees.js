(function()
{
    'use strict';

    // Controller name is handy for logging
    var controllerId = 'attendees';

    // Define the controller on the module.
    // Inject the dependencies. 
    // Point to the controller definition function.
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', attendees]);

    function attendees(common, config, datacontext)
    {
        // Using 'Controller As' syntax, so we assign this to the vm variable (for viewmodel).
        var vm = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var keyCodes = config.keyCodes;

        // Bindable properties and functions are placed on vm.
        vm.attendees = [];
        vm.attendeeCount = 0;
        vm.attendeeFilteredCount = 0;
        vm.attendeeSearch = '';
        vm.filteredAttendees = [];
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 15
        };
        vm.pageChanged = pageChanged;
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Attendees';


        Object.defineProperty(vm.paging, 'pageCount', {
            get: function()
            {
                return Math.floor(vm.attendeeFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate()
        {
            common.activateController([getAttendees()], controllerId)
                .then(function() { log('Activated Attendees View'); });
        }

        function getAttendeeCount()
        {
            //return datacontext.getAttendeeCount().then(function (data) {
            return datacontext.attendee.getCount().then(function(data)
            {
                return vm.attendeeCount = data;
            });
        }

        function getAttendeeFilteredCount()
        {
            vm.attendeeFilteredCount = datacontext.attendee.getFilteredCount(vm.attendeeSearch);
        }

        function getAttendees(forceRefresh)
        {
            return datacontext.attendee.getAll(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.attendeeSearch)
                .then(function(data)
                {
                    vm.attendees = data;
                    if(!vm.attendeeCount || forceRefresh)
                    {
                        // Only grab the full count once or on refresh
                        getAttendeeCount();
                    }
                    getAttendeeFilteredCount();
                    return data;
                }
            );
        }

        function pageChanged()
        {
            getAttendees();
        }

        function refresh()
        {
            getAttendees(true);
        }

        function search($event)
        {
            if($event.keyCode === keyCodes.esc)
            {
                vm.attendeeSearch = '';
            }

            getAttendees();
        }
    }
})();
