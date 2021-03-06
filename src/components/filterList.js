'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const debounce = require('debounce')

let FilterList = create({
  displayName: "FilterList",

  getInitialState: function() {
    return {
      selection: "room0",
      filter: ""
    }
  },

  select: function(id) {
    this.setState({selection: id, filter: ""})
    this.state.inputRef.value = ""
    this.props.callback(id)
  },

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
    this.setState({
      filter: e.target.value.toUpperCase()
    })
  },

  render: function() {
    let keys = Object.keys(this.props.items)
    let items = keys.map((itemKey, id) => {
      let item = this.props.items[itemKey]
      let props = {
        selected:   this.state.selection == itemKey,
        filter:     this.state.filter,
        content:    item,
        key:        itemKey,
        listId:     itemKey,
        select:     this.select,
        properties: this.props.properties
      }
      return React.createElement(this.props.element, props)
    })
    return <>
      <input className="filter" ref={this.inputRef} placeholder="Search"/>
      <div className="list">
        {items}
      </div>
    </>
  }
})

module.exports = FilterList
