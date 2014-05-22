(function()
{
    'use strict';

    var serviceId = 'repositories';
    angular.module('app').factory(serviceId, ['$injector', repositories]);

    function repositories($injector)
    {
        var manager;

        var service = {
            getRepo: getRepo,
            init: init
        };

        return service;

        // Called exclusively by datacontext
        function init(mgr) { manager = mgr; }

        // Get named Repository Ctor (by injection), new it, and initialize it
        function getRepo(repoName)
        {
            var fullRepoName = 'repository.' + repoName.toLowerCase();
            var Repo = $injector.get(fullRepoName);
            return new Repo(manager);
        }
    }
})();