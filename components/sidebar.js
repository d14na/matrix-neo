'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const debounce = require('debounce')

let Filter = create({
  displayName: "Filter",

  inputRef: function(ref) {
    if (ref == null) {
      return
    }
    this.setState({
      inputRef: ref
    })
    ref.addEventListener("keyup", debounce(this.input, 20))
  },

  input: function(e) {
    this.props.setFilter(e.target.value.toUpperCase())
  },

  render: function() {
    return <div className="filter">
        <input ref={this.inputRef} placeholder="Filter roomlist"/>
      </div>
  }
})

let List = create({
  displayName: "List",

  getInitialState: function() {
    return {
      roomId: 0
    }
  },

  select: function(id) {
    this.setState({roomId: id})
  },

  render: function() {
    let rooms = ["Neo", "version 4", "Codename", "Iris", "Let's All Love Lain", "Very long room name abcdefghijklmnopqrstuvwxyz"]
    let roomList = rooms.map((room, i) => {
      return <RoomListItem
        active={this.state.roomId == i}
        name={room}
        filter={this.props.filter}
        key={i}
        roomId={i}
        select={this.select}
      />
    })
    return <div className="list">
      {roomList}
    </div>
  }
})

let RoomListItem = create({
  displayName: "RoomListItem",

  getInitialState: function() {
    return {
      filterName: this.props.name.toUpperCase(),
      unread: Math.random() > 0.7
    }
  },

  setRef: function(ref) {
    if (ref == null) {
      return
    }
    this.setState({ref: ref})
    ref.addEventListener("click", () => {this.props.select(this.props.roomId)})
  },

  render: function() {
    if (this.state.filterName.indexOf(this.props.filter) == -1) {
      return null
    }
    let className = "roomListItem"
    if (this.props.active) {
      className += " active"
    }
    if (this.state.unread) {
      className += " unread"
    }
    console.log(className)
    return <div className={className} ref={this.setRef}>
      <svg id="avatar" data-jdenticon-value={this.props.name}></svg>
      <span id="name">{this.props.name}</span>
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
    console.log("setting", filter)
  },

  render: function() {
    return <div className="sidebar">
      <Filter setFilter={this.setFilter} />
      <List filter={this.state.filter} />
    </div>
  }
})


module.exports = Sidebar
