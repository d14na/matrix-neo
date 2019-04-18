'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

const riot = require('../../lib/riot-utils.js')

let Event = create({
  displayName: "m.text",

  render: function() {
    let event = this.props.event

    let eventBody

    if (event.content.format == "org.matrix.custom.html") {
      let html = riot.sanitize(event.content.formatted_body)
      eventBody = <div
        className={this.props.nested ? "nested" : "body"}
        dangerouslySetInnerHTML={{__html: html}}
      />
    } else {
      eventBody =
        <div className={this.props.nested ? "nested" : "body"}>
          {event.content.body}
        </div>
    }


    let eventClass = "event"
    if (event.local) {
      eventClass += " local"
    }

    return <div className={eventClass}>
      {eventBody}
    </div>
  }
})


module.exports = Event;
