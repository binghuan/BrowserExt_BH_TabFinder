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
        chrome.tabs.update(tab.id, {
            active: true
        }, null);
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
    onChange: function(e) {

        //console.log("Get SearchText: " + e.target.value);

        var newItems = [];
        var keyword = e.target.value;
        var items = this.props.items;
        var filterRex = new RegExp(keyword);
        for (var i = 0; i < items.length; i++) {
            if (items[i].title.match(filterRex) != null || items[i].url.match(filterRex) != null) {
                newItems.push(items[i]);
                //console.log("Add [" + i + "]");
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

chrome.tabs.getAllInWindow(null, function(tabs) {
            console.log("Total tabs: " + tabs.length);

            ReactDOM.render( < TabFinder tabs = {
                    tabs
                }
                />, document.getElementById("popover_page"));

            })
