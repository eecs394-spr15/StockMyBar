/* Input controller */

angular
	.module('inputs')
    .controller('HomeCtrl', function ($scope, MyBarService, supersonic) {

        /* Deal with tabs when this view is visible */
        var stopListening = supersonic.ui.views.current.whenVisible( function() {
            supersonic.ui.tabs.show();
        });

    });