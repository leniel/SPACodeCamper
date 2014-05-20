(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.map = {
            title: "Location"
        }

        vm.speakers = {
            title: 'Top Speakers',
            list: [],
            interval: 3000 // 3 seconds
        }

        vm.news = {
            title: 'Hot Towel Angular',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.attendeesCount = 0;
        vm.sessionsCount = 0;
        vm.speakersCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';

        activate();

        function activate() {
            getTopSpeakers();


            var promises = [getAttendeesCount(), getSessionsCount(), getSpeakersCount(), getPeople()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getAttendeesCount()
        {
            return datacontext.getAttendeesCount().then(function(data)
            {
                return vm.attendeesCount = data;
            });
        }

        function getSessionsCount()
        {
            return datacontext.getSessionsCount().then(function(data)
            {
                return vm.sessionsCount = data;
            });
        }

        function getTopSpeakers() {
            vm.speakers.list = datacontext.getSpeakersTopLocal();
        }

        function getSpeakersCount()
        {
            var speakers = datacontext.getSpeakersLocal();

            return vm.speakersCount = speakers.length;
        }

        function getPeople() {
            return datacontext.getPeople().then(function (data) {
                return vm.people = data;
            });
        }
    }
})();