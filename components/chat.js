'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const debounce = require('debounce')

let chat = create({
  displayName: "Chat",

  render: function() {
    let tmpEvents = [
      {sender: "Foks", content: "Hello"},
      {sender: "Foks", content: "This is Neo v4"},
      {sender: "Foks", content: "Here is one test event\nWith\n Multiple\nLines\n:)"},
      {sender: "Different Foks", content: "Look at these nice colors"},
      {sender: "Different Foks", content: "And the font"},
      {sender: "Lain", content: "image"},
      {sender: "Lain", content: "image"},
      {sender: "Lain", content: "image"},
      {sender: "Different Foks", content: "And the avatars"},
      {sender: "Foks", content: "Every line has it's own message"},
      {sender: "Foks", content: "But if the sender is the same, we don't repeat the name+image"},
      {sender: "Foks", content: "Isn't message grouping great?"}
    ]
    let messageGroups = {
      current: [],
      groups: [],
      sender: ""
    }

    // if the sender is the same, add it to the 'current' messageGroup, if not,
    // push the old one to 'groups' and start with a new array.

    tmpEvents.forEach((event, id) => {
      if (event.sender != messageGroups.sender) {
        messageGroups.sender = event.sender
        if (messageGroups.current.length != 0) {
          messageGroups.groups.push(messageGroups.current)
        }
        messageGroups.current = []
      }
      messageGroups.current.push(event)
    })
    messageGroups.groups.push(messageGroups.current)

    let events = messageGroups.groups.map((events, id) => {
      return <EventGroup events={events} key={id}/>
    })

    //TODO: replace with something that only renders events in view
    return <div className="chat">
      <div className="events">
        {events}
      </div>
    </div>
  }
})

let EventGroup = create({
  displayName: "EventGroup",

  getInitialState: function() {
    let color = ["red", "green", "yellow", "blue", "purple", "cyan"][Math.floor(Math.random()*6)]
    return {
      color: color
    }
  },

  render: function() {
    let events = this.props.events.map((event, id) => {
      return <Event event={event} key={id}/>
    })
    return <div className="eventGroup">
      <svg id="avatar" data-jdenticon-value={this.props.events[0].sender}></svg>
      <div className="col">
        <div id="name" className={`fg-palet-${this.state.color}`}>{this.props.events[0].sender}</div>
        {events}
      </div>
    </div>
  }
})

let Event = create({
  displayName: "Event",

  render: function() {
    //TODO: HTML Sanitize
    let parsedBody = this.props.event.content.split("\n").map((line, id) => {
      if (line.startsWith("image")) {
        return <img src="neo.png"/>
      }
      return <span key={id}>{line}<br/></span>
    })
    return <div className="event">
      <div className="body">
        {parsedBody}
      </div>
    </div>
  }
})

module.exports = chat
