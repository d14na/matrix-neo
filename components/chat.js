'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const debounce = require('debounce')
const jdenticon = require('jdenticon')
const defaultValue = require('default-value')

const elements = {
  "m.text": require('./events/text.js'),
  "m.image": require('./events/image.js')
}

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

  getInitialState: function() {
    return {
      ref: null
    }
  },

  getSnapshotBeforeUpdate: function(oldProps, oldState) {
    let ref = this.state.ref
    if (ref == null) {return}
    if ((ref.scrollHeight - ref.offsetHeight) - ref.scrollTop < 100) { // Less than 100px from bottom
      return true
    }
    return null
  },

  componentDidUpdate(prevProps, prevState, snapshot) {
    let ref = this.state.ref
    if (ref == null) {return}
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
    let empty = (
      <div className="chat" ref={this.setRef}>
        <div className="events">
        </div>
      </div>
    )
    if (this.props.roomId == undefined) {
      //empty screen
      return empty
    }

    let room = this.props.client.getRoom(this.props.roomId)
    if (room == null) {
      return empty
    }

    let messageGroups = {
      current: [],
      groups: [],
      sender: ""
    }

    // if the sender is the same, add it to the 'current' messageGroup, if not,
    // push the old one to 'groups' and start with a new array.

    console.log("GROUPING EVENTS", room.timeline.length)
    let events = []
    if (room.timeline.length > 0) {
      room.timeline.forEach((timeline) => {
        console.log("TIMELINE", timeline);
        let event = timeline.event;
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

      events = messageGroups.groups.map((events, id) => {
        return <EventGroup key={`${this.props.roomId}-${id}`} events={events} client={this.props.client}/>
      })
    }
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
    let user = this.props.client.getUser(this.props.events[0].sender)
    let color = ["red", "green", "yellow", "blue", "purple", "cyan"][Math.floor(Math.random()*6)]
    return {
      color: color,
      user: user
    }
  },

  avatarRef: function(ref) {
    jdenticon.update(ref, this.state.user.userId)
  },

  render: function() {
    let events = this.props.events.map((event, id) => {
      return getRenderedEvent(event, id, this.props.client)
    })
    return <div className="eventGroup">
      <svg id="avatar" ref={this.avatarRef} ></svg>
      <div className="col">
        <div id="name" className={`fg-palet-${this.state.color}`}>{this.state.user.displayName}</div>
        {events}
      </div>
    </div>
  }
})

function getRenderedEvent(event, id, client) {
  if (event.type == "m.room.message") {
    let msgtype = event.content.msgtype;
    return React.createElement(defaultValue(elements[msgtype], elements["m.text"]), {event: event, key: id, client: client})
  }
}

module.exports = chat
