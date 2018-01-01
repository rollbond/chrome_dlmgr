function GetAnchors(document_root) {
    var html = []
        , obj = {}
        , allAnchors = document.getElementsByTagName("A");

    Array.prototype.forEach.call(allAnchors, function(element) {
        if (element.href.substr(element.href.length - 4, 4) == ".mp3" && element.className != "wp-playlist-caption"){
            obj = {name: element.innerText, href: element.href};
            html.push(obj);
        }
    });
    return html;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: GetAnchors(document)
});
chrome.tabs.create({url: 'popup.html'}) 