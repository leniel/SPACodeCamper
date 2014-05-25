(function()
{
    'use strict';

    var serviceId = 'repository.speaker';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositorySpeaker]);

    function RepositorySpeaker(model, AbstractRepository)
    {
        var entityName = model.entityNames.speaker;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'firstName, lastName';
        var Predicate = breeze.Predicate;

        function Ctor(mgr)
        {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getAllLocal = getAllLocal;
            this.getTopLocal = getTopLocal;
            this.getPartials = getPartials;
            this.getById = getById;
            this.create = create;
            this.calcIsSpeaker = calcIsSpeaker;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getLocal()
        function getAllLocal(includeNullo)
        {
            var self = this;

            var predicate = Predicate.create('isSpeaker', '==', true);

            if(includeNullo)
            {
                predicate = predicate.or(this._predicates.isNullo);
            }

            return self._getAllLocal(entityName, orderBy, predicate);
        }

        // Formerly known as datacontext.getSpeakerPartials()
        function getPartials(forceRemote)
        {
            var self = this;
            var predicate = Predicate.create('isSpeaker', '==', true);
            var speakerOrderBy = 'firstName, lastName';
            var speakers = [];

            if(!forceRemote)
            {
                speakers = self._getAllLocal(entityName, speakerOrderBy, predicate);
                return self.$q.when(speakers);
            }

            return EntityQuery.from('Speakers')
                .select('id, firstName, lastName, imageSource')
                .orderBy(speakerOrderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data)
            {
                speakers = data.results;
                for(var i = speakers.length; i--;)
                {
                    speakers[i].isSpeaker = true;
                    speakers[i].isPartial = true;
                }
                self.log('Retrieved [Speaker Partials] from remote data source', speakers.length, true);
                return speakers;
            }
        }

        // Formerly known as datacontext.getSpeakersTopLocal()
        function getTopLocal()
        {
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

        function create()
        {
            return this.manager.createEntity(entityName);
        }

        function calcIsSpeaker()
        {
            // Call this when you need to reset the isSpeaker flag.
            // EX:  session changes (maybe we changed the speaker).
            //      session is deleted (speaker may not have sessions anymore)
            var self = this;

            var persons = self.manager.getEntities(model.entityNames.person);
            var sessions = self.manager.getEntities(model.entityNames.session);

            //var persons = EntityQuery.from('Persons')
            //    .using(self.manager).executeLocally();
            //var sessions = EntityQuery.from('Sessions')
            //    .using(self.manager).executeLocally();

            // clear isSpeaker value for all persons, then
            // reassign based on who has a session now (excluding the nullo)
            persons.forEach(function(p) { p.isSpeaker = false; });
            sessions.forEach(function(s) { s.speaker.isSpeaker = (s.speakerId !== 0); });
        }
    }
})();