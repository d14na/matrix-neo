'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const colorConvert = require('color-convert')
const sanitize = require('sanitize-html')

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
    let msg = e.target.value
    if (msg.startsWith('/')) {
      // Handle other commands
      let parts = msg.split(' ')
      let command = parts[0]
      let result = handleCommands(command, parts)
      if (result != null) {
        if (result.type == "html") {
          this.sendHTML(result.content)
        } else {
          this.sendPlain(result.content)
        }
      }
    } else {
      this.sendPlain(msg)
    }
    e.target.value = ""
    e.preventDefault()
    this.resize_textarea_delayed(e)
  },

  sendPlain: function(string) {
    let content = {
      body: string,
      msgtype: "m.text"
    }
    content = this.sendReply(content)
    this.props.client.sendEvent(this.props.roomId, "m.room.message", content, (err, res) => {
      console.log(err)
    })
  },

  sendHTML: function(html) {
    let content = {
      body: sanitize(html, {allowedTags: []}),
      formatted_body: html,
      format: "org.matrix.custom.html",
      msgtype: "m.text"
    }

    content = this.sendReply(content)

    this.props.client.sendEvent(this.props.roomId, "m.room.message", content, (err, res) => {
      console.log(err)
    })
  },

  sendReply: function(content) {
    if (this.props.replyEvent != undefined) {
      content['m.relates_to'] = {
        'm.in_reply_to': {
          event_id: this.props.replyEvent.event_id
        }
      }
      this.props.onReplyClick()
    }
    return content
  },

  render: function() {
    return <div className="input">
      {this.props.replyEvent &&
        <div className="replyEvent">
          {this.props.replyEvent.content.body}
        </div>
      }
      <textarea ref={this.setRef} rows="1" spellCheck="false" placeholder="unencrypted message"></textarea>
    </div>
  }
})

function handleCommands(command, parts) {
  if (command == "/rainbow") {
    if (parts.length < 2) {
      return
    }
    let string = parts[1]
    for(let i=2; i < parts.length; i++) {
      string += " " + parts[i]
    }
    let html = rainbowTransform(string)
    return {
      type: 'html',
      content: html
    }
  }
  return null
}

function rainbowTransform(text) {
  let array = text.split("");
  let delta = 360/text.length;
  if (delta < 10) {
    delta = 10;
  } else if (delta > 20) {
    delta = 20;
  }
  let h = -1 * delta; // start at beginning

  let rainbowArray = array.map((char) => {
    h = h + delta;
    if (h > 360) {
      h = 0;
    }
    return `<font color="${colorConvert.hsl.hex(h, 100, 50)}">${char}</font>`;
  });
  let rainbow = rainbowArray.join("");
  return rainbow;
}

module.exports = input
