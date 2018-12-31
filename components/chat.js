'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

let chat = create({
  displayName: "Chat",
  render: function() {
    return <div className="chat">chat window</div>
  }
})


module.exports = chat
