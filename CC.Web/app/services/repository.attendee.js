(function()
{
    'use strict';

    var serviceId = 'repository.attendee';

    angular.module('app').factory(serviceId, ['model', 'repository.abstract', 'zStorage', RepositoryAttendee]);

    function RepositoryAttendee(model, AbstractRepository, zStorage)
    {
        var entityName = model.entityNames.attendee;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'firstName, lastName';
        var Predicate = breeze.Predicate;

        function Ctor(mgr)
        {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            // Exposed data access functions
            this.getAll = getAll;
            this.getCount = getCount;
            this.getFilteredCount = getFilteredCount;
            this.zStorage = zStorage;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        // Formerly known as datacontext.getAttendees()
        function getAll(forceRemote, page, size, nameFilter)
        {
            var self = this;
            // Only return a page worth of attendees
            var take = size || 20;
            var skip = page ? (page - 1) * size : 0;

            if(self.zStorage.areItemsLoaded('attendees') && !forceRemote)
            {
                // Get the page of attendees from local cache
                return self.$q.when(getByPage());
            }

            // Load all attendees to cache via remote query
            return EntityQuery.from('Persons')
                .select('id, firstName, lastName, imageSource')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .then(querySucceeded, self._queryFailed);

            function querySucceeded(data)
            {
                var attendees = self._setIsPartialTrue(data.results);

                self.zStorage.areItemsLoaded('attendees', true);

                self.zStorage.save();

                self.log('Retrieved [Attendees] from remote data source', attendees.length, true);

                return getByPage();
            }

            function getByPage()
            {
                var predicate = null;

                if(nameFilter)
                {
                    predicate = _fullNamePredicate(nameFilter);
                }

                var attendees = EntityQuery.from(entityName)
                    .where(predicate)
                    .orderBy(orderBy)
                    .take(take).skip(skip)
                    .using(self.manager)
                    .executeLocally();

                return attendees;
            }
        }

        // Formerly known as datacontext.getAttendeeCount()
        function getCount()
        {
            var self = this;

            if(self.zStorage.areItemsLoaded('attendees'))
            {
                return self.$q.when(self._getLocalEntityCount(entityName));
            }

            // Attendees aren't loaded; ask the server for a count.
            return EntityQuery.from('Persons').take(0).inlineCount()
                .using(self.manager).execute()
                .then(self._getInlineCount);
        }

        // Formerly known as datacontext.getFilteredCount()
        function getFilteredCount(nameFilter)
        {
            var predicate = _fullNamePredicate(nameFilter);

            var attendees = EntityQuery.from(entityName)
                .where(predicate)
                .using(this.manager)
                .executeLocally();

            return attendees.length;
        }

        function _fullNamePredicate(filterValue)
        {
            return Predicate
                .create('firstName', 'contains', filterValue)
                .or('lastName', 'contains', filterValue);
        }
    }
})();