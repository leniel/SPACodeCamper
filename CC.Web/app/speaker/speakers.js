(function()
{
    'use strict';

    var controllerId = 'speakers';

    // TODO: replace app with your module name
    angular.module('app').controller(controllerId,
        ['common', 'datacontext', 'config', speakers]);

    function speakers(common, datacontext, config)
    {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;

        vm.speakers = [];
        vm.filteredSpeakers = [];
        vm.refresh = refresh;
        vm.search = search;
        vm.title = 'Speakers';

        activate();

        function activate()
        {
            common.activateController([getSpeakers()], controllerId)
                .then(function() { log('Activated Speakers View'); });
        }

        function getSpeakers(forceRefresh)
        {
            return datacontext.getSpeakerPartials(forceRefresh).then(function(data)
            {
                vm.speakers = data;

                applyFilter();

                return vm.speakers;
            });
        }

        function refresh()
        {
            getSpeakers(true);
        }

        function applyFilter()
        {
            vm.filteredSpeakers = vm.speakers.filter(speakerFilter);
        }

        function speakerFilter(speaker) {
            var isMatch = vm.speakerSearch ? common.textContains(speaker.fullName, vm.speakerSearch) : true;

            return isMatch;
        }

        function search($event) {
            if ($event.keyCode == config.keyCodes.esc) {
                vm.speakerSearch = '';
            }

            applyFilter();
        }
    }
})();
