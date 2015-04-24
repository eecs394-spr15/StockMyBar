angular.module('inputs').filter('addItemsList', function(supersonic) {
<<<<<<< HEAD
    return function(items, barContents, searchText, category) {
=======
    return function(items, ingredIdList, searchText) {
>>>>>>> df8d21f54e5bf4e6c60952f545847df92afaf256
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
