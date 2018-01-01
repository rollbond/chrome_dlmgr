var MAX_CONCURRENT_DOWNLOADS = 6;

function onWindowLoad() {
  chrome.tabs.executeScript(null, {
      file: "getPagesSource.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        $('#message').innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });
}
var anchorList = [];
$(function() {
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      anchorList = request.source;
      fnList();
      var o = document.getElementById("btnDownload");
      o.innerText = "Download first " + MAX_CONCURRENT_DOWNLOADS + " marked files at once (Total: " + anchorList.length + ")";
      o.addEventListener("click", fnDownload);
      var o = document.getElementById("btnDeselect");
      o.addEventListener("click", fnDeselect);
    }
  });

  onWindowLoad();
});

function fnList(){
  var buf = [], o;
  buf.push("<table>");
  for(var i = 0; i < anchorList.length; i++){
    o = anchorList[i];
    buf.push("<tr><td><input class=\"chkFiles\" id=\"chk" + i + "\" type=\"checkbox\" checked value=\"" + o.href + "\"/></td><td>" + (i + 1) + ".</td><td><a href=\"" + o.href + "\" download>Download</a></td><td>" + o.name + "</td></tr>");
  }
  buf.push("</table>");
  $("#list").html(buf.join(""));
}

function fnDownload(){
  var objDL = $(".chkFiles:checked").slice(0, MAX_CONCURRENT_DOWNLOADS);
  for(var i = 0; i < MAX_CONCURRENT_DOWNLOADS; i++){
    chrome.downloads.download({ url: objDL[i].value });
    objDL[i].checked = false;
  }
}

function fnDeselect(){
  var objChk = $(".chkFiles")
    , count = $("#txtDeselect").val();
    for(var i = 0; i < count; i++){
      objChk[i].checked = false;
    }
}