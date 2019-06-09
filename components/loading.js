'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')

let Loading = create({
  displayName: "Loading",

  render: function() {
    return (
      <div className="spinner">
        <div className="bounce1"/>
        <div className="bounce2"/>
        <div className="bounce3"/>
      </div>
    )
  }
})

module.exports = Loading
