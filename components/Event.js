'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

let Event = create({
  displayName: "Event",

  render: function() {
    let eventBody = this.props.event.content.split("\n").map((line, id) => {
      if (line.startsWith("image")) {
        return <img key={id} src="neo.png"/>
      }
      return <span key={id}>{line}<br/></span>
    })

    return <div className="event">
      <div className="body">
        {eventBody}
      </div>
    </div>
  }
})


module.exports = Event;
