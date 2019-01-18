'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

let chat = create({
  displayName: "Chat",
  render: function() {
    let tmpEvents = [
      {sender: "Foks", content: "Hello"},
      {sender: "Foks", content: "This is Neo v4"}
    ]
    let events = tmpEvents.map((event, id) => {
      return <Event event={event} key={id}/>
    })
    //TODO: replace with something that only renders events in view
    return <div className="chat">
      <div className="events">
        Chat content
      </div>
    </div>
  }
})

let Event = create({
  displayName: "Event",
  render: function() {
    return <div className="event">
      <img id="avatar" src="https://placekitten.com/200/200"/>
      <span id="content">{this.props.event.sender}</span>
      <div id="content">{this.props.event.content}</div>
    </div>
  }
})

module.exports = chat
