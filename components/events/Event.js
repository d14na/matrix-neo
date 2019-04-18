'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const defaultValue = require('default-value')

const elements = {
  "m.text": require('./text.js'),
  "m.image": require('./image.js')
}

let Event = create({
  displayName: "Event",

  render: function() {
    let state = ""

    if (this.props.event.local) {
      state = " local"
    }

    return (
      <div className={"event" + state}>
        {getRenderedEvent(this.props.event, this.props.client)}
      </div>
    )
  }
})

function getRenderedEvent(event, client) {
  if (event.type == "m.room.message") {
    let msgtype = event.content.msgtype;
    return React.createElement(defaultValue(elements[msgtype], elements["m.text"]), {event: event, client: client})
  }
}

module.exports = Event
