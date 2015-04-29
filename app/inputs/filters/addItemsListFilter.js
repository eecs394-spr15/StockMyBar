angular.module('inputs').filter('addItemsList', function(supersonic) {
    return function(items, ingredIdList, searchText, category) {
        var filtered = [];
        for(var i=0; i < items.length; i++) {
            if (ingredIdList.indexOf(items[i].id) == -1) {
                if (items[i].category == category || category == '') {
                    if (!searchText) {
                        filtered.push(items[i]);
                    } else if (items[i].name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        filtered.push(items[i]);
                    } else if (items[i].common_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        filtered.push(items[i]);
                    } else if (items[i].tags.toLowerCase().indexOf(searchText.toLowerCase()) > -1) {
                        filtered.push(items[i]);
                    }
                }
            }
        }
        return filtered;
    };
});
