'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

const riot = require('../../lib/riot-utils.js')

let Event = create({
  displayName: "m.text",

  render: function() {
    let event = this.props.event;
    // let eventBody = event.content.body.split("\n").map((line, id) => {
    //   return <span key={id}>{line}<br/></span>
    // })

    let eventBody = riot.sanitize(event.content.body)

    return <div className="event">
      <div
        className={this.props.nested ? "nested" : "body"}
        dangerouslySetInnerHTML={{__html: eventBody}}
      />
    </div>
  }
})


module.exports = Event;
