'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const debounce = require('debounce')
const jdenticon = require('jdenticon')
const defaultValue = require('default-value')

const Event = require('./events/Event.js')
const Info = require('./info.js')
const Input = require('./input.js')
const User = require('./events/user.js')

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
    if (ref == null) {return null}
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

  onReplyClick: function(e) {
    this.setState({replyEvent: e})
  },

  render: function() {
    let empty = (
      <div className="main">
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

    let events = []
    if (room.timeline.length > 0) {
      room.timeline.forEach((timeline) => {
        let event = timeline.event;
        if (event.user_id != null) { // localecho messages
          event.sender = event.user_id
          event.local = true
        }
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
        return <EventGroup key={`${this.props.roomId}-${id}`} events={events} client={this.props.client} room={room} onReplyClick={this.onReplyClick}/>
      })
    }
    //TODO: replace with something that only renders events in view
    return (
      <div className="main">
        <Info room={room} />
        <div className="chat" ref={this.setRef}>
          <div className="events">
            {events}
          </div>
        </div>
        <Input client={this.props.client} roomId={this.props.roomId} replyEvent={this.state.replyEvent} onReplyClick={this.onReplyClick}/>
      </div>
    )
  }
})

let EventGroup = create({
  displayName: "EventGroup",

  getInitialState: function() {
    let user = this.props.client.getUser(this.props.events[0].sender)
    let avatar = <svg id="avatar" ref={this.avatarRef} />

    if (user.avatarUrl != null) {
      let hs = this.props.client.baseUrl
      let media_mxc = user.avatarUrl.slice(6)
      let url = `${hs}/_matrix/media/v1/thumbnail/${media_mxc}?width=128&height=128&method=scale`
      avatar = <img id="avatar" src={url}/>
    }

    let color = ["red", "green", "yellow", "blue", "purple", "cyan"][Math.floor(Math.random()*6)]
    return {
      color: color,
      user: user,
      avatar: avatar
    }
  },

  avatarRef: function(ref) {
    jdenticon.update(ref, this.state.user.userId)
  },

  render: function() {
    let events = this.props.events.map((event, key) => {
      return <Event event={event} key={key} client={this.props.client} room={this.props.room} onReplyClick={this.props.onReplyClick}/>
    })
    return <div className="eventGroup">
      {this.state.avatar}
      <div className="col">
        <User user={this.state.user}/>
        {events}
      </div>
    </div>
  }
})

module.exports = chat
