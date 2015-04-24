angular.module('inputs').filter('preList', function(supersonic) {
    return function(items, searchText) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if (!searchText || item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                filtered.push(item);
            }
        });
        return filtered;
    };
});