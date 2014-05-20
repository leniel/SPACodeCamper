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

        vm.content = {
            predicate: '',
            reverse: false,
            setSort: setContentSort,
            title: 'Content',
            tracks: []
    }

        vm.news = {
            title: 'Code Camp',
            description: 'Code Camp is a community event where developers learn from fellow developers. All are welcome to attend and speak. Code Camp is free, by and for the developer community, and occurs on the weekends.'
        };

        vm.messageCount = 0;
        vm.attendeesCount = 0;
        vm.sessionsCount = 0;
        vm.speakersCount = 0;
        vm.people = [];
        vm.title = 'Dashboard';

        activate();

        function activate()
        {
            getTopSpeakers();

            var promises = [getAttendeesCount(), getSessionsCount(), getSpeakersCount(), getTrackCounts()];
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

        function getTrackCounts()
        {
            return datacontext.getTrackCounts().then(function(data)
            {
                return vm.content.tracks = data;
            });
        }

        function setContentSort(prop) {
            vm.content.predicate = prop;
            vm.content.reverse = !vm.content.reverse;
        }

        function getTopSpeakers() {
            vm.speakers.list = datacontext.getSpeakersTopLocal();
        }

        function getSpeakersCount()
        {
            var speakers = datacontext.getSpeakersLocal();

            return vm.speakersCount = speakers.length;
        }
    }
})();