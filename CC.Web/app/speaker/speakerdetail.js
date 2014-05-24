(function()
{
    'use strict';

    var controllerId = 'speakerdetail';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['$scope', '$window', '$routeParams', 'common', 'config', 'datacontext', speakerdetail]);

    function speakerdetail($scope, $window, $routeParams, common, config, datacontext)
    {
        var vm = this;

        var logError = common.logger.getLogFn(controllerId, 'error');

        // Bindable properties and functions are placed on vm.
        vm.speaker = undefined;
        vm.speakerIdParameter = $routeParams.id;

        vm.getTitle = getTitle;

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
            return !vm.isSaving;
        }

        activate();

        function activate()
        {
            onDestroy();

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

        function goBack()
        {
            $window.history.back();
        }

        function cancel()
        {
            datacontext.cancel();
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

    }
})();
