(function () {
    'use strict';

    var serviceId = 'repository.speaker';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositorySpeaker]);

    function RepositorySpeaker(model, AbstractRepository) {
        var entityName = model.entityNames.speaker;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'firstName, lastName';
        var Predicate = breeze.Predicate;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getAllLocal = getAllLocal;
            this.getTopLocal = getTopLocal;
            this.getPartials = getPartials;
            this.getById = getById;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getLocal()
        function getAllLocal() {
            var self = this;
            var predicate = Predicate.create('isSpeaker', '==', true);
            return self._getAllLocal(entityName, orderBy, predicate);
        }

        // Formerly known as datacontext.getSpeakerPartials()
        function getPartials(forceRemote) {
            var self = this;
            var predicate = Predicate.create('isSpeaker', '==', true);
            var speakerOrderBy = 'firstName, lastName';
            var speakers = [];

            if (!forceRemote) {
                speakers = self._getAllLocal(entityName, speakerOrderBy, predicate);
                return self.$q.when(speakers);
            }

            return EntityQuery.from('Speakers')
                .select('id, firstName, lastName, imageSource')
                .orderBy(speakerOrderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                speakers = data.results;
                for (var i = speakers.length; i--;) {
                    speakers[i].isSpeaker = true;
                    speakers[i].isPartial = true;
                }
                self.log('Retrieved [Speaker Partials] from remote data source', speakers.length, true);
                return speakers;
            }
        }

        // Formerly known as datacontext.getSpeakersTopLocal()
        function getTopLocal() {
            var self = this;
            var predicate = Predicate.create('lastName', '==', 'Papa')
                .or('lastName', '==', 'Guthrie')
                .or('lastName', '==', 'Bell')
                .or('lastName', '==', 'Hanselman')
                .or('lastName', '==', 'Lerman')
                .and('isSpeaker', '==', true);

            return self._getAllLocal(entityName, orderBy, predicate);
        }

        function getById(id, forceRemote)
        {
            return this._getById(entityName, id, forceRemote);
        }
    }
})();