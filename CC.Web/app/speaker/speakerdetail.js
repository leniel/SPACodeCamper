(function()
{
    'use strict';

    var controllerId = 'speakerdetail';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['$scope', '$location', '$window', '$routeParams', 'common', 'config', 'datacontext', speakerdetail]);

    function speakerdetail($scope, $location, $window, $routeParams, common, config, datacontext)
    {
        var vm = this;

        var logError = common.logger.getLogFn(controllerId, 'error');

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

            common.activateController([getRequestedSpeaker()], controllerId);
        }

        function getRequestedSpeaker()
        {
            var val = $routeParams.id;

            if(val === 'new')
            {
                vm.speaker = datacontext.speaker.create();

                return vm.speaker;
            }

            datacontext.speaker.getById(val)
                .then(function(data)
                {
                    vm.speaker = data;

                }, function(error)
                {
                    logError('Unable to get Speaker ' + val);
                });
        }

        function goBack()
        {
            $window.history.back();
        }

        function cancel()
        {
            datacontext.cancel();

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

    }
})();
