(function()
{
    'use strict';

    var serviceId = 'model';

    angular.module('app').factory(serviceId, ['model.validation', model]);

    function model(modelValidation)
    {
        var entityNames = {
            attendee: 'Person',
            person: 'Person',
            speaker: 'Person',
            session: 'Session',
            room: 'Room',
            track: 'Track',
            timeslot: 'TimeSlot'
        }

        var nulloDate = new Date(1900, 0, 1);

        // Define the functions and properties to reveal.
        var service = {
            configureMetadataStore: configureMetadataStore,
            entityNames: entityNames,
            createNullos: createNullos,
            extendMetadata: extendMetadata
        };

        return service;

        function configureMetadataStore(metadataStore)
        {
            registerSession(metadataStore);
            registerPerson(metadataStore);
            registerTimeSlot(metadataStore);

            modelValidation.createAndRegister(entityNames);
        }

        function extendMetadata(metadataStore)
        {
            modelValidation.applyValidators(metadataStore);
        }

        function createNullos(manager)
        {
            var unchanged = breeze.EntityState.Unchanged;

            createNullo(entityNames.timeslot, { start: nulloDate, isSessionSlot: true });
            createNullo(entityNames.room);
            createNullo(entityNames.speaker, { firstName: ' [Select a person]' });
            createNullo(entityNames.track);

            function createNullo(entityName, values)
            {
                var initialValues = values || { name: ' [Select a ' + entityName.toLowerCase() + ']' };

                return manager.createEntity(entityName, initialValues, unchanged);
            }
        }

        //#region Internal Methods        

        function registerPerson(metadataStore)
        {
            metadataStore.registerEntityTypeCtor('Person', Person);

            function Person()
            {
                this.isSpeaker = false;
                this.isPartial = false;
            };

            Object.defineProperty(Person.prototype, 'fullName', {
                get: function()
                {
                    var fn = this.firstName;
                    var ln = this.lastName;

                    return ln ? fn + ' ' + ln : fn;
                }
            });
        }

        function registerTimeSlot(metadataStore)
        {
            metadataStore.registerEntityTypeCtor('TimeSlot', TimeSlot);

            function TimeSlot() { };

            Object.defineProperty(TimeSlot.prototype, 'name', {
                get: function()
                {
                    var start = this.start;

                    var value = ((start - nulloDate) === 0) ?
                        ' [Select a timeslot]' :
                        (start && moment.utc(start).isValid()) ?
                            moment.utc(start).format('ddd hh:mm a') : '[Unknown]';

                    return value;
                }
            });
        }

        function registerSession(metadataStore)
        {
            metadataStore.registerEntityTypeCtor('Session', Session);

            function Session()
            {
                this.isPartial = false;
            };

            Object.defineProperty(Session.prototype, 'tagsFormatted', {
                get: function()
                {
                    return this.tags ? this.tags.replace(/\|/g, ', ') : this.tags;
                },
                set: function(value)
                {
                    this.tags = value.replace(/\, /g, '|');
                }
            });
        }

        //#endregion
    }
})();