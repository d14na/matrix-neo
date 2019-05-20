'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

const Text = require('./text.js')

let Event = create({
  displayName: "m.image",

  getInitialState: function() {
    let hs = this.props.client.baseUrl
    let event = this.props.event
    if (event.content.url == undefined) {
      return {url: {media: null, thumb: null}}
    }
    let media_mxc = event.content.url.slice(6)
    let thumb_mxc = media_mxc
    if (event.content.info != undefined && event.content.info.thumbnail_info != undefined) {
      thumb_mxc = event.content.info.thumbnail_url.slice(6)
    }
    let download = `${hs}/_matrix/media/v1/download`
    let thumbnail = `${hs}/_matrix/media/v1/thumbnail/${thumb_mxc}?width=1000&height=1000&method=scale`
    return {
      url: {
        media: `${download}/${media_mxc}`,
        thumb: thumbnail
      }
    }
  },

  render: function() {
    return (
      <div className="body">
        <a href={this.state.url.media} target="_blank">
          <img src={this.state.url.thumb}/>
        </a>
        <Text event={this.props.event} nested={true}/>
      </div>
    )
  }
})

module.exports = Event;
