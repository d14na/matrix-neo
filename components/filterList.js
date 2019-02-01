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
      selection: 0,
      filter: ""
    }
  },

  select: function(id) {
    this.setState({selection: id})
    //this.props.callback(id)
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
    let items = this.props.items.map((item, id) => {
      let props = {
        selected:  this.state.selection == id,
        filter:  this.state.filter,
        content: item,
        key:     id,
        listId:  id,
        select:  this.select,
      }
      return React.createElement(this.props.element, props)
    })
    return <>
      <div className="filter">
        <input ref={this.inputRef} placeholder="Search"/>
      </div>
      <div className="list">
        {items}
      </div>
    </>
  }
})

module.exports = FilterList
