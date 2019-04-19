'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

let info = create({
  displayName: "Info",
  render: function() {
    let title = ""
    if (this.props.room != undefined) {
      title = this.props.room.name
    }
    return <div className="info">{title}</div>
  }
})


module.exports = info
