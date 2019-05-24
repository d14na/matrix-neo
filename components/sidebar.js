'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const debounce = require('debounce')
const jdenticon = require('jdenticon')

const FilterList = require('./filterList.js')

let RoomListItem = create({
  displayName: "RoomListItem",

  getInitialState: function() {
    let room = this.props.content
    let client = this.props.properties.client
    let jdenticon = <svg id="avatar" ref={this.jdenticonRef}/>
    let avatarUrl

    let roomState = room.getLiveTimeline().getState('f')
    let avatarState = roomState.getStateEvents('m.room.avatar')
    if (avatarState.length > 0) {
      let event = avatarState[avatarState.length-1].event
      let hs = client.baseUrl
      let media_mxc = event.content.url.slice(6)
      let path = `/_matrix/media/v1/thumbnail/${media_mxc}?width=128&height=128&method=scale`
      avatarUrl = {
        hs: hs,
        path: path
      }
    }

    return {
      filterName: room.name.toUpperCase(),
      unread: Math.random() > 0.7,
      avatarUrl: avatarUrl,
      jdenticon: jdenticon,
      tries: 0
    }
  },

  jdenticonRef: function(ref) {
    jdenticon.update(ref, this.props.content.roomId)
  },

  avatarFallback: function() {
    // instead of falling back on jdenticon immediately, we can try
    // a third-party homeserver's media repo
    // this does come with trust issues, and is opt-in in settings
    let fallbackMediaRepos = this.props.properties.options.fallbackMediaRepos

    if (this.state.tries < fallbackMediaRepos.length) {
      let avatarUrl = this.state.avatarUrl
      avatarUrl.hs = fallbackMediaRepos[this.state.tries]
      this.setState({
        avatarUrl: avatarUrl,
        tries: this.state.tries + 1
      })
    } else {
      this.setState({avatarUrl: null, avatar: jdenticon})
    }
  },

  setRef: function(ref) {
    if (ref == null) {
      return
    }
    this.setState({ref: ref})
    ref.addEventListener("click", () => {this.props.select(this.props.listId)})
  },

  render: function() {
    if (this.state.filterName.indexOf(this.props.filter) == -1) {
      return null
    }
    let className = "roomListItem"
    if (this.props.selected) {
      className += " active"
    }
    if (this.state.unread) {
      className += " unread"
    }
    return <div className={className} ref={this.setRef}>
      {this.state.avatarUrl ?
        <img id="avatar" src={`${this.state.avatarUrl.hs}${this.state.avatarUrl.path}`} onError={this.avatarFallback}></img>
        :
        this.state.jdenticon
      }
      <span id="name">{this.props.content.name}</span>
    </div>
  }
})

let Sidebar = create({
  displayName: "Sidebar",

  getInitialState: function() {
    return {
      filter: ""
    }
  },

  setFilter: function(filter) {
    this.setState({
      filter: filter.toUpperCase()
    })
  },

  render: function() {
    return <div className="sidebar">
      <FilterList items={this.props.rooms} properties={{client: this.props.client, options: this.props.options}} element={RoomListItem} callback={(roomId) => {this.props.selectRoom(roomId)}}/>
    </div>
  }
})


module.exports = Sidebar
