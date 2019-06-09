'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const debounce = require('debounce')
const jdenticon = require('jdenticon')
const defaultValue = require('default-value')
const sdk = require('matrix-js-sdk')
const sanitize = require('sanitize-html')

const Event = require('./events/Event.js')
const Info = require('./info.js')
const Input = require('./input.js')
const User = require('./events/user.js')
const Loading = require('./loading.js')

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

let eventFunctions = {
  plaintext: function() {
    let plain = "unknown event"

    if (this.type == "m.room.message") {
      plain = this.content.body

      if (this.content.format == "org.matrix.custom.html") {
        plain = sanitize(this.content.formatted_body, {allowedTags: []})
      }
    }
    if (this.type == "m.room.member") {
      if (this.content.membership == "invite") {
        plain = `${this.sender} invited ${this.state_key}`
      } else if (this.content.membership == "join") {
        plain = `${this.state_key} joined the room`
      } else if (this.content.membership == "leave") {
        plain = `${this.state_key} left the room`
      } else if (this.content.membership == "kick") {
        plain = `${this.sender} kicked ${this.state_key}`
      } else if (this.content.membership == "ban") {
        plain = `${this.sender} banned ${this.state_key}`
      }
    }
    if (this.type == "m.room.avatar") {
      if (this.content.url.length > 0) {
        plain = `${this.sender} changed the room avatar`
      }
    }
    if (this.type == "m.room.name") {
      return `${this.sender} changed the room name to ${this.content.name}`
    }
    return plain
  }
}

let chat = create({
  displayName: "Chat",

  getInitialState: function() {
    return {
      ref: null,
      loading: false
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

  paginateBackwards: function() {
    if (this.state.loading) {
      return
    }
    let client = this.props.client
    client.paginateEventTimeline(client.getRoom(this.props.roomId).getLiveTimeline(), {backwards: true}).then(() => {
      this.setState({loading: false})
    })
    this.setState({loading: true})
  },

  render: function() {
    let client = this.props.client
    let empty = (
      <div className="main">
      </div>
    )
    if (this.props.roomId == undefined) {
      //empty screen
      return empty
    }

    let room = client.getRoom(this.props.roomId)
    if (room == null) {
      return empty
    }

    let messageGroups = {
      current: [],
      groups: [],
      sender: "",
      type: ""
    }

    // if the sender is the same, add it to the 'current' messageGroup, if not,
    // push the old one to 'groups' and start with a new array.

    let liveTimeline = room.getLiveTimeline()
    let liveTimelineEvents = liveTimeline.getEvents()

    let events = []
    if (liveTimelineEvents.length > 0) {
      liveTimelineEvents.forEach((MatrixEvent) => {
        let event = MatrixEvent.event;
        event = Object.assign(event, eventFunctions)
        if (event.sender == null) { // localecho messages
          event.sender = event.user_id
          event.local = true
        }
        if (event.sender != messageGroups.sender || event.type != messageGroups.type) {
          messageGroups.sender = event.sender
          messageGroups.type = event.type
          if (messageGroups.current.length != 0) {
            messageGroups.groups.push(messageGroups.current)
          }
          messageGroups.current = []
        }
        messageGroups.current.push(event)
      })
      messageGroups.groups.push(messageGroups.current)

      events = messageGroups.groups.map((events, id) => {
        return <EventGroup key={`${this.props.roomId}-${events[0].event_id}`} events={events} client={this.props.client} room={room} onReplyClick={this.onReplyClick}/>
      })
    }
    //TODO: replace with something that only renders events in view
    return (
      <div className="main">
        <Info room={room} />
        <div className="chat" ref={this.setRef}>
          <div className="events">
            <div className="paginateBackwards" onClick={this.paginateBackwards}>
              {this.state.loading ?
                <Loading/> :
                <span>load older messages</span>
              }
            </div>
            {events}
          </div>
        </div>
        <Input client={client} roomId={this.props.roomId} replyEvent={this.state.replyEvent} onReplyClick={this.onReplyClick}/>
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

    return {
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
