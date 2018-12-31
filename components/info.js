'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

let info = create({
  displayName: "Info",
  render: function() {
    return <div className="info">Room Title</div> 
  }
})


module.exports = info
