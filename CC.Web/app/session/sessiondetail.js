(function()
{
    'use strict';

    var controllerId = 'sessiondetail';

    angular.module('app').controller(controllerId,
        ['$location', '$scope', '$window', '$routeParams', 'common', 'config', 'datacontext', sessiondetail]);

    function sessiondetail($location, $scope, $window, $routeParams, common, config, datacontext)
    {
        var vm = this;

        var logError = common.logger.getLogFn(controllerId, 'error');

        vm.session = undefined;
        vm.speakers = [];
        vm.rooms = [];
        vm.tracks = [];
        vm.timeslots = [];

        vm.title = 'sessiondetail';

        vm.getTitle = getTitle;

        vm.sessionIdParameter = $routeParams.id;

        vm.goBack = goBack;
        vm.cancel = cancel;

        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;

        vm.activate = activate;

        // vm.canSave Property
        Object.defineProperty(vm, 'canSave', {
            get: canSave
        });

        function canSave()
        {
            return vm.hasChanges && !vm.isSaving;
        }

        activate();

        function activate()
        {
            onDestroy();
            onHasChanges();

            initLookups();

            common.activateController([getRequestedSession()], controllerId);
        }

        function getTitle()
        {
            return 'Edit ' + ((vm.session && vm.session.title) || '');
        }

        function getRequestedSession()
        {
            var val = $routeParams.id;

            if(val === 'new')
            {
                vm.session = datacontext.session.create();

                return vm.session;
            }

            datacontext.session.getById(val)
                .then(function(data)
                {
                    vm.session = data;

                }, function(error)
                {
                    logError('Unable to get Session ' + val);
                });
        }

        function goBack()
        {
            $window.history.back();
        }

        function cancel()
        {
            datacontext.cancel();

            if(vm.session.entityAspect.entityState.isDetached())
            {
                goToSessions();
            }
        }

        function goToSessions()
        {
            $location.path('/sessions');
        }

        function save()
        {
            if(!canSave())
            {
                return common.$q.when(null);

            } // Must return a promise

            vm.isSaving = true;

            return datacontext.save()
                .then(function(saveResult)
                {
                    // Save success
                    vm.isSaving = false;
                },
                function(error)
                {
                    // Save error
                    vm.isSaving = false;
                });
        }

        function onDestroy()
        {
            $scope.$on('$destroy', function()
            {
                datacontext.cancel();
            });
        }

        function onHasChanges()
        {
            $scope.$on(config.events.hasChangesChanged,
                function(event, data)
                {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function initLookups()
        {
            var lookups = datacontext.lookup.lookupCachedData;

            vm.rooms = lookups.rooms;
            vm.tracks = lookups.tracks;
            vm.timeslots = lookups.timeslots;

            vm.speakers = datacontext.speaker.getAllLocal(true);
        }
    }
})();
