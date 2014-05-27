(function()
{
    'use strict';

    var controllerId = 'speakerdetail';

    angular.module('app').controller(controllerId,
        ['$scope', '$location', '$window', '$routeParams', 'common', 'config', 'datacontext', 'model', 'helper',
            speakerdetail]);

    function speakerdetail($scope, $location, $window, $routeParams, common, config, datacontext, model, helper)
    {
        var vm = this;

        var entityName = model.entityNames.speaker;

        var logError = common.logger.getLogFn(controllerId, 'error');

        var wipEntityKey = undefined;

        // Bindable properties and functions are placed on vm.
        vm.speaker = undefined;
        vm.speakerIdParameter = $routeParams.id;

        vm.goBack = goBack;
        vm.cancel = cancel;

        vm.hasChanges = false;
        vm.isSaving = false;
        vm.save = save;

        vm.title = 'speakerdetail';

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

            common.activateController([getRequestedSpeaker()], controllerId).then(onEveryChange());
        }

        function getRequestedSpeaker()
        {
            var val = $routeParams.id;

            if(val === 'new')
            {
                vm.speaker = datacontext.speaker.create();

                return vm.speaker;
            }

            return datacontext.speaker.getEntityByIdOrFromWip(val)
                .then(function(data)
                {
                    // Will either get back an entity or an {entity:, key:}
                    wipEntityKey = data.key;

                    vm.speaker = data.entity || data;
                },
                function(error)
                {
                    logError('Unable to get speaker from WIP ' + val);

                    goToSpeakers();
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

            helper.replaceLocationUrlGuidWithId(vm.speaker.id);

            if (vm.speaker.entityAspect.entityState.isDetached())
            {
                goToSpeakers();
            }
        }

        function goToSpeakers()
        {
            $location.path('/speakers');
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

                    removeWipEntity();

                    helper.replaceLocationUrlGuidWithId(vm.speaker.id);
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

        function autoStoreWip(immediate)
        {
            common.debouncedThrottle(controllerId, storeWipEntity, 1000, immediate);
        }

        function onEveryChange()
        {
            $scope.$on(config.events.entitiesChanged,
                function(event, data)
                    {
                        autoStoreWip(); 
                        
                    });
        }

        function removeWipEntity()
        {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function storeWipEntity()
        {
            if (!vm.speaker)
            {
                return;
            }

            var description = (vm.speaker.fullName || '[New speaker]') + ' ' + vm.speaker.id;

            var routeState = 'speaker';

            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.speaker, wipEntityKey, entityName, description, routeState);
        }
    }
})();
