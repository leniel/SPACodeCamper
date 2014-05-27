(function()
{
    'use strict';

    var controllerId = 'sidebar';

    angular.module('app').controller(controllerId,
        ['$route', '$location', 'config', 'routes', 'datacontext', 'bootstrap.dialog', sidebar]);

    function sidebar($route, $location, config, routes, datacontext, bsDialog)
    {
        var vm = this;

        vm.clearStorage = clearStorage;
        vm.isCurrent = isCurrent;
        vm.routes = routes;
        vm.search = search;
        vm.searchText = '';
        vm.wip = [];
        vm.wipChangedEvent = config.events.storage.wipChanged;

        activate();

        function activate()
        {
            getNavRoutes();

            vm.wip = datacontext.zStorageWip.getWipSummary();
        }

        function getNavRoutes()
        {
            vm.navRoutes = routes.filter(function(r)
            {
                return r.config.settings && r.config.settings.nav;
            }).sort(function(r1, r2)
            {
                return r1.config.settings.nav > r2.config.settings.nav;
            });
        }

        function isCurrent(route)
        {
            if(!route.config.title || !$route.current || !$route.current.title)
            {
                return '';
            }

            var menuName = route.config.title;

            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        function search($event)
        {
            if($event.keyCode == config.keyCodes.esc)
            {
                vm.searchText = '';

                return;
            }

            if($event.type === 'click' || $event.keyCode === config.keyCodes.enter)
            {
                var route = '/sessions/search/';

                $location.path(route + vm.searchText);
            }
        }

        function clearStorage()
        {
            return bsDialog.deleteDialog('Local Storage and Work In Progress')
                .then(confirmDelete, cancelDelete);

            function confirmDelete()
            {
                datacontext.zStorage.clear();

            }

            function cancelDelete() { }
        }
    };
})();
