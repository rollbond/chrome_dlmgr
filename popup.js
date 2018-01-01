var currentDownloadingIndex = 0;
var anchorList = [];

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

$(function() {
  AddDownloadListener();
  chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      anchorList = request.source;
      fnList();
      var o = document.getElementById("btnDownload");
      $("#btnDownload span").text("Download all " + anchorList.length + " songs")
      o.addEventListener("click", fnDownload);
    }
  });

  onWindowLoad();
});

function fnList(){
  var buf = [], o;
  buf.push("<table>");
  for(var i = 0; i < anchorList.length; i++){
    o = anchorList[i];
    buf.push("<tr><td>" + (i + 1) + ".</td><td><a href=\"" + o.href + "\" download>Download</a></td><td>" + o.name + "</td></tr>");
  }
  buf.push("</table>");
  $("#list").html(buf.join(""));
}

function fnDownload(){
  if(currentDownloadingIndex < anchorList.length){
    chrome.downloads.download({ url: anchorList[currentDownloadingIndex].href });
    currentDownloadingIndex++;
  }
}

function fnDeselect(){
  var objChk = $(".chkFiles")
    , count = $("#txtDeselect").val();
    for(var i = 0; i < count; i++){
      objChk[i].checked = false;
    }
}

function AddDownloadListener() {
  chrome.downloads.onCreated.addListener(DownloadCreated);
  chrome.downloads.onChanged.addListener(DownloadChanged);

  function DownloadCreated(el) {
    //console.log("Download Begins");
  }

  function DownloadChanged(el) {
    if(typeof el.state === 'object' && el.state !== null) {
      if (el.state.current == 'complete'){
        State=false;
        $("tr:nth-child(" + currentDownloadingIndex + ")").css({"color":"gray", "text-decoration": "line-through"});
        fnDownload();
      }
    }
  }
}