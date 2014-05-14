(function()
{
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', 'config', 'entityManagerFactory', datacontext]);

    function datacontext(common, config, emFactory)
    {
        var EntityQuery = breeze.EntityQuery;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(serviceId);
        var logError = getLogFn(serviceId, 'error');
        var logSuccess = getLogFn(serviceId, 'success');
        var manager = emFactory.newManager();
        var $q = common.$q;

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            getSessionPartials: getSessionPartials
        };

        return service;

        function getMessageCount() { return $q.when(72); }

        function getPeople()
        {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }

        function getSessionPartials()
        {
            var orderBy = 'timeSlotId, level, speaker.firstName';
            var sessions;

return EntityQuery.from('Sessions')
    .select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
    .orderBy(orderBy)
    .toType('Session')
    .using(manager).execute()
    .then(querySucceeded, _queryFailed);

            function querySucceeded(data)
            { 
                sessions = data.results;

                log('Retrieved [Session Partials] from remote data source', sessions.length, true);

                return sessions;
            }

            function _queryFailed(error)
            {
                var msg = config.appErrorPrefix + 'Error retrieving data.' + error.message;

                logError(msg, error);

                throw error;
            }
        }

    }
})();