(function()
{
    'use strict';

    var controllerId = 'sessiondetail';

    angular.module('app').controller(controllerId,
        ['$scope', 'common', sessiondetail]);

    function sessiondetail($scope, common)
    {
        var vm = this;

        vm.session = undefined;
        vm.getTitle = getTitle;
        vm.activate = activate;
        vm.title = 'sessiondetail';

        activate();

        function activate()
        {
            common.activateController([], controllerId);
        }

        function getTitle()
        {
            return 'Edit ' + ((vm.session && vm.session.title) || '');
        }
    }
})();
