/* Input controller */

angular
	.module('inputs')
    .controller('HomeCtrl', function ($scope, MyBarService, supersonic) {


    	/* Hide back button */
    	options = {
    	  overrideBackButton: true,
    	}
    	supersonic.ui.navigationBar.update(options);


    });