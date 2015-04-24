angular.module('inputs').filter('addItemsList', function(supersonic) {
    return function(items, barContents, searchText, category) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if (barContents.indexOf(item.name) == -1) {
                if (!searchText || item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                    if (item.category == category) {
                    filtered.push(item);
                    }
                }
            }
        });
        return filtered;
    };
});
