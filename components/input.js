'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

let input = create({
  displayName: "Input",

  setRef: function(ref) {
    if (ref !=null) {
      ref.addEventListener("keydown", (e) => {
        // only send on plain 'enter'
        if (e.key == "Enter" && !e.shiftKey && !e.altKey && !e.ctrlKey) {
          this.send(e)
        }
      })
      this.setState({ref: ref})
    }
  },

  send: function(e) {
    let content = {
      "body": e.target.value,
      "msgtype": "m.text"
    }
    this.props.client.sendEvent(this.props.roomId, "m.room.message", content, (err, res) => {
      console.log(err)
    })
    e.target.value = ""
  },

  render: function() {
    return <div className="input">
      <input ref={this.setRef} placeholder="unencrypted message"></input>
    </div>
  }
})


module.exports = input
