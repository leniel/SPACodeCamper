(function () {
    'use strict';

    var serviceId = 'repository.session';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositorySession]);

    function RepositorySession(model, AbstractRepository) {
        var entityName = model.entityNames.session;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'timeSlotId, level, speaker.firstName';

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getCount = getCount;
            this.getPartials = getPartials;
            this.getTrackCounts = getTrackCounts;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getSessionCount() {
        function getCount() {
            var self = this;
            if (self._areItemsLoaded()) {
                return self.$q.when(self._getLocalEntityCount(entityName));
            }
            // Sessions aren't loaded; ask the server for a count.
            return EntityQuery.from('Sessions')
                .take(0).inlineCount()
                .using(this.manager).execute()
                .then(this._getInlineCount);
        }

        // Formerly known as datacontext.getTrackCounts()
        function getTrackCounts() {
            return this.getPartials().then(function (data) {
                var sessions = data;
                //loop thru the sessions and create a mapped track counter object
                var trackMap = sessions.reduce(function (accum, session) {
                    var trackName = session.track.name;
                    var trackId = session.track.id;
                    if (accum[trackId - 1]) {
                        accum[trackId - 1].count++;
                    } else {
                        accum[trackId - 1] = {
                            track: trackName,
                            count: 1
                        };
                    }
                    return accum;
                }, []);
                return trackMap;
            });
        }

        // Formerly known as datacontext.getSessionPartials()
        function getPartials(forceRemote) {
            var self = this;
            var sessions;

            if (self._areItemsLoaded() && !forceRemote) {
                sessions = self._getAllLocal(entityName, orderBy);
                return self.$q.when(sessions);
            }

            return EntityQuery.from('Sessions')
                .select('id, title, code, speakerId, trackId, timeSlotId, roomId, level, tags')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                sessions = data.results;
                self._areItemsLoaded(true);
                self.log('Retrieved [Session Partials] from remote data source', sessions.length, true);
                return sessions;
            }
        }
    }
})();