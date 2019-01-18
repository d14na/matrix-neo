'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

let input = create({
  displayName: "Input",
  render: function() {
    return <div className="input">
      <input placeholder="unencrypted message"></input>
    </div>
  }
})


module.exports = input
