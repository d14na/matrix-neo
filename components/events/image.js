'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const defaultValue = require('default-value')

const Text = require('./text.js')

let Event = create({
  displayName: "m.image",

  getInitialState: function() {
    let client = this.props.client
    let hs = this.props.client.baseUrl
    let event = this.props.event
    if (event.content.url == undefined) {
      return {url: {media: null, thumb: null}}
    }
    console.log(event)

    let h = 1000
    let w = 1000
    try {
      if (event.content.info.h < h) {
        h = event.content.info.h
      }

      if (event.content.info.w < w) {
        w = event.content.info.w
      }

      if (event.content.info.thumbnail_info < h) {
        h = event.content.info.thumbnail_info.h
      }

      if (event.content.info.thumbnail_info < w) {
        w = event.content.info.thumbnail_info.w
      }
    } catch(error) {
      
    }

    let media_url = client.mxcUrlToHttp(event.content.url)
    let thumb_url = client.mxcUrlToHttp(event.content.url, w, h, "scale", false)

    return {
      url: {
        media: media_url,
        thumb: thumb_url
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
