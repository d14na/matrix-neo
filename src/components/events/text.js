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
    let formattedEvent = this.props.formattedEvent

    let eventBody

    if (formattedEvent.html) {
      eventBody = <div
        className="body"
        dangerouslySetInnerHTML={{__html: formattedEvent.body}}
      />
    } else {
      eventBody =
        <div className="body">
          {formattedEvent.body}
        </div>
    }


    let eventClass = ""
    if (event.local) {
      eventClass += " local"
    }

    return <div className={eventClass}>
      {eventBody}
    </div>
  }
})


module.exports = Event
