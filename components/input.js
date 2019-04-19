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
        if (e.key == "Enter") {
          if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
            this.send(e)
            return
          }
        }
      })
      ref.addEventListener('change',  this.resize_textarea)
      ref.addEventListener('cut',     this.resize_textarea_delayed)
      ref.addEventListener('paste',   this.resize_textarea_delayed)
      ref.addEventListener('drop',    this.resize_textarea_delayed)
      ref.addEventListener('keydown', this.resize_textarea_delayed)
      this.setState({ref: ref})
    }
  },

  resize_textarea: function(element) {
    if (element == undefined) {
      return;
    }
    let ref = element.target;
    if (ref != undefined) {
      ref.style.height = 'auto';
      ref.style.height = ref.scrollHeight+'px';
    }
  },

  resize_textarea_delayed: function(e) {
    setTimeout(() => this.resize_textarea(e), 5);
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
      <textarea ref={this.setRef} rows="1" spellCheck="false" placeholder="unencrypted message"></textarea>
    </div>
  }
})


module.exports = input
