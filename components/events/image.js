'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

const Text = require('./text.js')

let Event = create({
  displayName: "m.image",

  getInitialState: function() {
    let hs = this.props.backend.getHS()
    let event = this.props.event;
    let media_mxc = event.content.url.slice(7);
    let thumb_mxc = event.content.info.thumbnail_url.slice(6);
    let base = `${hs}/_matrix/media/v1/download`
    return {
      url: {
        media: `${base}/${media_mxc}`,
        thumb: `${base}/${thumb_mxc}`
      }
    }
  },

  render: function() {
    return <div className="event">
      <div className="body">
        <a href={this.state.url.media} target="_blank">
          <img src={this.state.url.thumb}/>
        </a>
        <Text event={this.props.event} nested={true}/>
      </div>
    </div>
  }
})

module.exports = Event;
