(function()
{
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);

    function routeConfigurator($routeProvider, routes)
    {
        //TODO: get rid of me later
        //$routeProvider.when('/invalid', 
        //{
        //    templateUrl: 'app/invalid.html'
        //});

        $routeProvider.when('/pass',
        {
            templateUrl: 'app/speaker/speakers.html',
            resolve: { fake: fakeAllow }
        });

        $routeProvider.when('/fail',
       {
           templateUrl: 'app/attendee/attendees.html',
           resolve: { fake: fakeReject }
       });

        fakeAllow.$inject = ['$q'];
        fakeReject.$inject = ['$q'];

        function fakeAllow($q)
        {
            var data = { x: 1 };

            var defer = $q.defer();
            defer.resolve(data);

            return defer.promise;
        }

        function fakeReject($q)
        {
            var defer = $q.defer();
            defer.reject({ msg: 'You shall not pass! -- Gandalf the Gray' });

            return defer.promise;
        }

        routes.forEach(function(r)
        {
            $routeProvider.when(r.url, r.config);
        });

        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes 
    function getRoutes()
    {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'app/dashboard/dashboard.html',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    }
                }
            }, {
                url: '/sessions',
                config: {
                    title: 'sessions',
                    templateUrl: 'app/session/sessions.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-calendar"></i> Sessions'
                    }
                }
            }, {
                url: '/speakers',
                config: {
                    title: 'speakers',
                    templateUrl: 'app/speaker/speakers.html',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-user"></i> Speakers'
                    }
                }
            }, {
                url: '/attendees',
                config: {
                    title: 'attendees',
                    templateUrl: 'app/attendee/attendees.html',
                    settings: {
                        nav: 4,
                        content: '<i class="fa fa-group"></i> Attendees'
                    }
                }
            }
        ];
    }
})();