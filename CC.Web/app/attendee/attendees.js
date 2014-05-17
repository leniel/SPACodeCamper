(function()
{
    'use strict';

    var controllerId = 'attendees';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['common', 'config', 'datacontext', attendees]);

    function attendees(common, config, datacontext)
    {
        var vm = this;

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        // Bindable properties and functions are placed on vm (view model)
        vm.attendees = [];
        vm.attendeesCount = 0;
        vm.attendeesFilteredCount = 0;
        vm.attendeesSearch = '';
        vm.filteredAttendees = [];
        vm.paging = {
            currentPage: 1,
            maxPagesToShow: 5,
            pageSize: 15
        };
        vm.refresh = refresh;
        vm.search = search;
        vm.pageChanged = pageChanged;
        vm.title = 'Attendees';

        Object.defineProperty(vm.paging, 'pageCount', {
            get: function() {
                return Math.floor(vm.attendeesFilteredCount / vm.paging.pageSize) + 1;
            }
        });

        activate();

        function activate()
        {
            common.activateController([getAttendees()], controllerId)
                .then(function() { log('Activated Attendees View'); });
        }

        function getAttendeesCount() {
            return datacontext.getAttendeesCount().then(function(data)
            {
                return vm.attendeesCount = data;
            });
        }

        function getAttendeesFilteredCount() {
            vm.attendeesFilteredCount = datacontext.getFilteredCount(vm.attendeesSearch);
        }

        function getAttendees(forceRefresh)
        {
            return datacontext
                .getAttendees(forceRefresh, vm.paging.currentPage, vm.paging.pageSize, vm.attendeesSearch)
                .then(function(data)
                {
                    vm.attendees = data;

                    getAttendeesFilteredCount();

                    if (!vm.attendeesCount || forceRefresh) {
                        getAttendeesCount();
                    }

                    return data;
                });
        }

        function refresh()
        {
            getAttendees(true);
        }

        function pageChanged()
        {
            getAttendees();
        }

        function search($event)
        {
            if($event.keyCode == config.keyCodes.esc)
            {
                vm.attendeesSearch = '';
            }

            getAttendees();
        }
    }
})();
