'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const debounce = require('debounce')
const jdenticon = require('jdenticon')

const Matrix = require('./backends/Matrix.js')

jdenticon.config = {
    lightness: {
        color: [0.58, 0.66],
        grayscale: [0.30, 0.90]
    },
    saturation: {
        color: 0.66,
        grayscale: 0.00
    },
    backColor: "#00000000"
};

let chat = create({
  displayName: "Chat",

  getSnapshotBeforeUpdate: function(oldProps, oldState) {
    let ref = this.state.ref
    if ((ref.scrollHeight - ref.offsetHeight) - ref.scrollTop < 100) { // Less than 100px from bottom
      return true
    }
    return null
  },

  componentDidUpdate(prevProps, prevState, snapshot) {
    let ref = this.state.ref
    if (snapshot) { // scroll to bottom
      ref.scrollTop = (ref.scrollHeight - ref.offsetHeight)
    }
  },

  setRef: function(ref) {
    if (ref != null) {
      this.setState({ref: ref})
    }
  },

  render: function() {
    let messageGroups = {
      current: [],
      groups: [],
      sender: ""
    }

    // if the sender is the same, add it to the 'current' messageGroup, if not,
    // push the old one to 'groups' and start with a new array.

    this.props.events.forEach((event, id) => {
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
    return <div className="chat" ref={this.setRef}>
      <div className="events">
        {events}
      </div>
    </div>
  }
})

let EventGroup = create({
  displayName: "EventGroup",

  getInitialState: function() {
    console.log(this.props.events);
    let color = ["red", "green", "yellow", "blue", "purple", "cyan"][Math.floor(Math.random()*6)]
    return {
      color: color,
      sender: this.props.events[0].props.event.sender
    }
  },

  avatarRef: function(ref) {
    jdenticon.update(ref, this.state.sender)
  },

  render: function() {
    let events = this.props.events;
    //let events = this.props.events.map((event, id) => {
      //return event
    //})
    return <div className="eventGroup">
      <svg id="avatar" ref={this.avatarRef} ></svg>
      <div className="col">
        <div id="name" className={`fg-palet-${this.state.color}`}>{this.state.sender}</div>
        {events}
      </div>
    </div>
  }
})

module.exports = chat
