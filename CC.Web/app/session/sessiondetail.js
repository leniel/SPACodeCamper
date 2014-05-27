(function()
{
    'use strict';

    var controllerId = 'sessiondetail';

    angular.module('app').controller(controllerId,
        ['$location', '$scope', '$window', '$routeParams',
         'common', 'config', 'bootstrap.dialog', 'datacontext', 'model', 'helper', sessiondetail]);

    function sessiondetail($location, $scope, $window, $routeParams,
                           common, config, bsDialog, datacontext, model, helper)
    {
        var vm = this;

        var logError = common.logger.getLogFn(controllerId, 'error');

        var entityName = model.entityNames.session;

        var wipEntityKey = undefined;

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
        vm.deleteSession = deleteSession;

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

            common.activateController([getRequestedSession()], controllerId).then(onEveryChange());
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

            return datacontext.session.getEntityByIdOrFromWip(val)
                .then(function(data)
                {
                    // Will either get back an entity or an {entity:, key:}
                    wipEntityKey = data.key;

                    vm.session = data.entity || data;
                },
                function(error)
                {
                    logError('Unable to get session from WIP ' + val);

                    goToSessions();
                });
        }

        function goBack()
        {
            $window.history.back();
        }

        function cancel()
        {
            datacontext.cancel();

            removeWipEntity();

            helper.replaceLocationUrlGuidWithId(vm.session.id);

            if(vm.session.entityAspect.entityState.isDetached())
            {
                goToSessions();
            }
        }

        function goToSessions()
        {
            $location.path('/sessions');
        }

        function deleteSession()
        {
            return bsDialog.deleteDialog('Session')
                .then(confirmDelete);

            function confirmDelete()
            {
                datacontext.markDeleted(vm.session);

                vm.save().then(success, failed);

                function success()
                {
                    removeWipEntity();

                    goToSessions(); 
                    
                }

                function failed(error)
                {
                    cancel(); // Makes the entity available to edit again
                }
            }
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

                    datacontext.speaker.calcIsSpeaker();

                    removeWipEntity();

                    helper.replaceLocationUrlGuidWithId(vm.session.id);
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
                    autoStoreWip(true);
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

        function onEveryChange()
        {
            $scope.$on(config.events.entitiesChanged,
                function(event, data)
                {
                    autoStoreWip();
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

        function autoStoreWip(immediate)
        {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }


        function storeWipEntity()
        {
            if (!vm.session)
            {
                return;
            }

            var description = vm.session.title || '[New Session]' + vm.session.id;

            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.session, wipEntityKey, entityName, description);
        }

        function removeWipEntity()
        {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }
    }
})();
