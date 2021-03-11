// YouTube tutorial: https://www.youtube.com/watch?v=2vnu4n62GAw

function scrapeGoogle() {

    var searchResults = UrlFetchApp.fetch("https://www.google.co.in/search?q=" + encodeURIComponent("amarindaz youtube channel"));
    var titleExp = /<h3 class=\"r\">([\s\S]*?)<\/h3>/gi;

    var titleResults = searchResults.getContentText().match(titleExp);

    // Logger.log(titleResults);

    for (var i in titleResults) {
        var actualTitle = titleResults[i].replace(/(^\s+)|(\s+$)/g, "").replace(/<\/?[^>]+>/gi, "");
        Logger.log(actualTitle);
    }
}