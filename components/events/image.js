'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const defaultValue = require('default-value')

const mediaLib = require('../../lib/media.js')

const Text = require('./text.js')

let Event = create({
  displayName: "m.image",

  getInitialState: function() {
    let event = this.props.event
    if (event.content.url == undefined) {
      return null
    }
    return mediaLib.parseEvent(this.props.client, event, 1000, 1000)
  },

  updateSize: function(e) {
    console.log("image was loaded")
  },

  render: function() {
    let event = this.props.event

    if (this.state == null) {
      return "malformed image event: " + event.content.body
    }

    return (
      <div className="body">
        <a href={this.state.full} target="_blank">
          <img src={this.state.thumb} style={{height: this.state.size.h, width: this.state.size.w}}/>
        </a>
        <Text event={this.props.event} nested={true}/>
      </div>
    )
  }
})

module.exports = Event;
