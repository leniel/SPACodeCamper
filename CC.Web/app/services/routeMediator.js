(function()
{
    'use strict';

    var serviceId = 'routeMediator';

    // TODO: replace app with your module name
    angular.module('app').factory(serviceId, ['$http', '$rootScope', '$location', 'config', 'logger', routeMediator]);

    function routeMediator($http, $rootScope, $location, config, logger)
    {
        var handleRouteChangeError = true;

        // Define the functions and properties to reveal.
        var service = {
            setRoutingHandlers: setRoutingHandlers
        };

        return service;

        function setRoutingHandlers()
        {
            updateDocTitle();
            handleRoutingErrors();
        }

        function handleRoutingErrors()
        {
            $rootScope.$on('$routeChangeError', function(event, current, previous, rejection)
            {
                if(handleRouteChangeError)
                {
                    return;
                }

                handleRouteChangeError = true;

                var msg = 'Error routing: ' + (current && current.name) + '. ' + (rejection.msg || '');

                logger.logWarning(msg, current, serviceId, true);

                $location.path('/');
            });
        }

        function updateDocTitle()
        {
            $rootScope.$on('$routeChangeSuccess',
                function(event, current, previous)
                {
                    handleRouteChangeError = false;

                    var title = config.docTitle + (current.title || '');

                    $rootScope.title = title;
                }
            );
        }

        //#region Internal Methods        

        //#endregion
    }
})();