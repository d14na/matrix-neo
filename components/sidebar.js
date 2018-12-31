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
        <input ref={this.inputRef}/>
      </div>
  }
})

let List = create({
  displayName: "List",

  render: function() {
    let rooms = ["Test", "aaaa", "Neo", "zzz", "Iris"]
    let roomList = rooms.map((room, i) => {
      return <RoomListItem name={room} filter={this.props.filter} key={i}/>
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
      filterName: this.props.name.toUpperCase()
    }
  },

  render: function() {
    if (this.state.filterName.indexOf(this.props.filter) == -1) {
      return null
    }
    return <div className="roomListItem">
      {this.props.name}
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
