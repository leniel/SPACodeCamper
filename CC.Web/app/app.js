(function()
{
    'use strict';

    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)

        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions

        // 3rd Party Modules
        'breeze.angular',    // configures breeze for an angular app
        'breeze.directives', // contains the breeze validation directive (zValidate)
        'ngzWip',            // Angular-Breeze LocalStorage features
        'ui.bootstrap'       // ui-bootstrap (ex: carousel, pagination, dialog)
    ]);

    // Handle routing errors and success events
    // Trigger breeze configuration
    app.run(['$route', 'breeze', 'datacontext', 'routeMediator',
        function($route, breeze, datacontext, routeMediator)
    {
        // Include $route to kick start the router.

        datacontext.prime();

        routeMediator.setRoutingHandlers();
    }]);
})();