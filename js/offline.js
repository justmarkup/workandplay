(function () {
    var appCache = window.applicationCache;
    if (appCache) {
        appCache.onupdateready = function () {
            if (confirm("The app has been updated. Do you want to download the latest files? \nOtherwise they will be updated at the next reload.")) {
                location.reload(true);
            }
        };
    }
})();