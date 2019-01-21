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
      {sender: "Different Foks", content: "Look at these nice colors"},
      {sender: "Different Foks", content: "And the font"},
      {sender: "Different Foks", content: "And the avatars"},
      {sender: "Foks", content: "Every line has it's own message"},
      {sender: "Foks", content: "But if the sender is the same, we don't repeat the name+image"},
      {sender: "Foks", content: "Isn't message grouping great?"}
    ]
    let lastSender = ""
    let groupCount = 0

    let events = tmpEvents.map((event, id) => {
      if (event.sender == lastSender) {
        groupCount++
      } else {
        groupCount = 0
        lastSender = event.sender;
      }
      return <Event event={event} key={id} groupCount={groupCount}/>
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
    let className = "event"
    if (this.props.groupCount > 0) {
      className += " grouped"
      if (this.props.groupCount == 1) {
        className += " first"
      }
    }
    return <div className={className}>
      {this.props.groupCount == false &&
        <svg id="avatar" data-jdenticon-value={this.props.event.sender}></svg>
      }
      <div className="body">
        {this.props.groupCount == false &&
          <div id="name" className={`fg-palet-${this.state.color}`}>{this.props.event.sender}</div>
        }
        <div id="content">{this.state.parsedBody}</div>
      </div>
    </div>
  }
})

module.exports = chat
