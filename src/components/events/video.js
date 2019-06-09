'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const defaultValue = require('default-value')

const mediaLib = require('../../lib/media.js')

const Text = require('./text.js')

let Event = create({
  displayName: "m.video",

  getInitialState: function() {
    let event = this.props.event
    if (event.content.url == undefined) {
      return null
    }
    return mediaLib.parseEvent(this.props.client, event, 1000, 1000)
  },

  render: function() {
    let event = this.props.event

    if (this.state == null) {
      return "malformed video event: " + event.content.body
    }

    return (
      <div className="body">
        <video controls poster={this.state.thumb} style={{maxHeight: this.state.size.h, maxWidth: this.state.size.w}}>
          <source src={this.state.full}></source>
        </video>
      </div>
    )
  }
})

module.exports = Event;
