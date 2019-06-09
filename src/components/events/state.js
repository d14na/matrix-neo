'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')

let Event = create({
  displayName: "genericStateEvent",

  render: function() {
    let event = this.props.event
    return (
      <div className="body">
        {event.plaintext()}
      </div>
    )
  }
})

module.exports = Event
