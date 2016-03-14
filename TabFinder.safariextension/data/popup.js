'use strict'
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import RaisedButton from 'material-ui/lib/raised-button';
import Colors from 'material-ui/lib/styles/colors';
import TextField from 'material-ui/lib/text-field';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';

import AppBar from 'material-ui/lib/app-bar';

// tutorial10.js
var TabList = React.createClass({
    onItemClick: function(tab) {
        console.log("onItemClick:", tab.index, tab.id);
        if(window.addon) {
            addon.port.emit("activateTab", tab.id);
        } else if(window.chrome) {
            chrome.tabs.update(tab.id, {
                active: true
            }, null);
        }
    },
    createItem: function(tab) {

        //console.log(">> createItem: ", item);

        return <ListItem key={tab.id} onClick = {
            this.onItemClick.bind(this, tab)
        }
        primaryText = {
            tab.title
        }
        secondaryText = {
            tab.url
        }
        />
    },
    render: function() {

        return <list > {
            this.props.items.map(this.createItem)
        } < /list>;
    }
});
var TabFinder = React.createClass({
    getInitialState: function() {
        return {
            items: this.props.tabs,
            text: ''
        };
    },
    setupTabs: function(newItems) {
        this.setState({
            items: newItems
        });
        console.log("setupTabs: " , newItems.length);
    },
    onChange: function(e) {

        console.log("Get SearchText: " + e.target.value);

        var newItems = [];
        var keyword = e.target.value;
        var items = this.props.tabs;
        var filterRex = new RegExp(keyword);
        for (var i = 0; i < items.length; i++) {
            if (items[i].title.match(filterRex) != null || items[i].url.match(filterRex) != null) {
                newItems.push(items[i]);
            }
        }
        this.setState({
            text: e.target.value,
            items: newItems
        });
    },
    render: function() {
        return ( < div >
            < AppBar title = "All Tabs" / > < br / >
            < TextField onChange = {
                this.onChange
            }
            hintText = "Search Keyword" / > < br / >
            < TabList items = {
                this.state.items
            }
            /> < /div >
        );
    }
});

if(window.addon) {// for firefox
    console.log("This is firefox add-on");
    addon.port.on("showTabList", function showTabList(msg) {
        console.log("<< receive msg to showTabList:", msg);
        var tabs = JSON.parse(msg);
        console.log("Total tabs: " + tabs.length);
        for(var i =0; i< tabs.length ; i++) {
            tabs[i].url = atob(tabs[i].url);
        }

        console.log("ready to setupTabs: " , tabs.length);
        var tabFinderClass = ReactDOM.render( < TabFinder tabs = {
                tabs
            }
            />, document.getElementById("popover_page"));
        tabFinderClass.setupTabs(tabs);

    });
} else if(window.chrome) {// for chrome
    chrome.tabs.getAllInWindow(null, function(tabs) {
                console.log("Total tabs: " + tabs.length);
                ReactDOM.render( < TabFinder tabs = {
                        tabs
                    }
                    />, document.getElementById("popover_page"));
                });
} else if(window.safari) {
    for(var i =0; i< safari.application.activeBrowserWindow.tabs.length; i++) {
        var tabs = safari.application.activeBrowserWindow.tabs;
        ReactDOM.render( < TabFinder tabs = {
                tabs
            }
            />, document.getElementById("popover_page"));
    }
}
