angular.module('inputs').filter('addItemsList', function(supersonic) {
    return function(items, ingredIdList, searchText, category) {
        var filtered = [];
        angular.forEach(items, function(item) {
            if (ingredIdList.indexOf(item.id) == -1) {
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
