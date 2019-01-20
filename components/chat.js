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
      {sender: "Foks", content: "This is Neo v4"},
      {sender: "Foks", content: "Here are a bunch of test messages\nWithout Multiple\nLines\n:("},
      {sender: "Foks", content: "Look at these nice colors"},
      {sender: "Foks", content: "And the font"},
      {sender: "Foks", content: "And the avatars"}
    ]
    let events = tmpEvents.map((event, id) => {
      return <Event event={event} key={id}/>
    })
    //TODO: replace with something that only renders events in view
    return <div className="chat">
      <div className="events">
        {events}
      </div>
    </div>
  }
})

let Event = create({
  displayName: "Event",

  getInitialState: function() {
    let color = ["red", "green", "yellow", "blue", "purple", "cyan"][Math.floor(Math.random()*6)]
    //TODO: HTML Sanitize
    // needs an unsafe html content set
    let parsedBody = this.props.event.content.replace(/\n/g, "<br>")
    return {
      color: color,
      parsedBody: parsedBody
    }
  },

  render: function() {
    return <div className="event">
      <svg id="avatar" data-jdenticon-value={this.props.event.sender}></svg>
      <div className="body">
        <div id="name" className={`fg-palet-${this.state.color}`}>{this.props.event.sender}</div>
        <div id="content">{this.state.parsedBody}</div>
      </div>
    </div>
  }
})

module.exports = chat
