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
    this.props.client.sendEvent(this.props.roomId, "m.room.message", content, (err, res) => {
      console.log(err)
    })
  },

  sendHTML: function(html) {
    let content = {
      body: html, // this should probably be stripped to plaintext
      formatted_body: html,
      format: "org.matrix.custom.html",
      msgtype: "m.text"
    }
    this.props.client.sendEvent(this.props.roomId, "m.room.message", content, (err, res) => {
      console.log(err)
    })
  },

  render: function() {
    return <div className="input">
      <textarea ref={this.setRef} rows="1" spellCheck="false" placeholder="unencrypted message"></textarea>
    </div>
  }
})

function handleCommands(command, parts) {
  if (command == "/rainbow") {
    if (parts.length < 2) {
      return
    }
    let string = ""
    for(let i=1; i < parts.length; i++) {
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
  let h = 0;
  let delta = 360/text.length;
  if (delta < 10) {
    delta = 10;
  } else if (delta > 20) {
    delta = 20;
  }

  let rainbowArray = array.map((char) => {
    h = h + delta;
    if (h > 360) {
      h = 0;
    }
    return `<font color="${hslToHex(h, 100, 50)}">${char}</font>`;
  });
  let rainbow = rainbowArray.join("");
  return rainbow;
}

function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

module.exports = input
