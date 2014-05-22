(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common', 'datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.attendeeCount = 0;
        vm.speakerCount = 0;
        vm.sessionCount = 0;
        vm.content = {
            predicate: '',
            reverse: false,
            setSort: setContentSort, 
            title: 'Content',
            tracks: [] 
        };
        vm.map = {
            title: 'Location'
        };
        vm.speakers = {
            interval: 5000,
            list: [], 
            title: 'Top Speakers'
        };
        vm.news = {
            title: 'Code Camp',
            description: 'Code Camp is a community event where developers learn from fellow developers. All are welcome to attend and speak. Code Camp is free, by and for the deveoper community, and occurs on the weekends.'
        };
        vm.title = 'Dashboard';

        activate();

        function activate() {
            getTopSpeakers();
            var promises = [getAttendeeCount(), getSessionCount(), getSpeakerCount(), getTrackCounts()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }
        
        function getAttendeeCount() {
            return datacontext.attendee.getCount().then(function(data) {
                return vm.attendeeCount = data;
            });
        }

        function getSessionCount() {
            return datacontext.session.getCount().then(function (data) {
                return vm.sessionCount = data;
            });
        }
        
        function getTrackCounts() {
            return datacontext.session.getTrackCounts().then(function (data) {
                return vm.content.tracks = data;
            });
        }

        function getTopSpeakers() {
            vm.speakers.list = datacontext.speaker.getTopLocal();
        }

        function getSpeakerCount() {
            var speakers = datacontext.speaker.getAllLocal();
            vm.speakerCount = speakers.length;
        }
        
        function setContentSort(prop) {
            vm.content.predicate = prop;
            vm.content.reverse = !vm.content.reverse;
        }
        
    }
})();