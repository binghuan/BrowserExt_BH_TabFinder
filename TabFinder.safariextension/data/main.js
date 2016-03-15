var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var data = require('sdk/self').data;
var base64 = require("sdk/base64");

var winUtils = require('sdk/window/utils');
var windows = require('sdk/windows');
var Request = require('sdk/request').Request;
var xhrRequest = require('sdk/net/xhr');
var tabs = require('sdk/tabs');
var _ = require("sdk/l10n").get;
var system = require("sdk/system");

// create main console popup
var panel;

//var urlOfPopup = "http://127.0.0.1/popup.html";
var urlOfPopup = require('sdk/self').data.url("popup.html");
function createPanel() {
    panel = require("sdk/panel").Panel({
        height: 480,
        width: 640,
        contentURL: urlOfPopup,
        onShow: function() {
            panel.port.emit("refreshUi");
        },
        onHide: function() {
            panel.port.emit("hideUi");
        }
    });
}
createPanel();

panel.port.on("activateTab", function(tabid) {
    for (let tab of tabs) {
        if (tab.id == tabid) {
            tab.activate();
        }
    }
});

function handleClick(state) {

    panel.show({
        position: button
    });

    var tabArray = [];
    for (let tab of tabs) {
        tabArray.push({
            "id": tab.id,
            "title": tab.title,
            "url": base64.encode(tab.url)
        });
    }

    panel.port.emit("showTabList", JSON.stringify(tabArray));
}

var button = buttons.ActionButton({
    id: "mozilla-link",
    label: "Visit Mozilla",
    icon: {
        "16": data.url('../Icon-16.png'),
        "32": data.url('../Icon-32.png'),
        "64": data.url('../Icon-64.png')
    },
    onClick: handleClick
});
