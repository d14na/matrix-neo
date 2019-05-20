'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const colorConvert = require('color-convert')
const sanitize = require('sanitize-html')

const riot = require('../lib/riot-utils.js')
const FileUpload = require('./fileUpload.js')

let input = create({
  displayName: "Input",

  getInitialState: function() {
    return {
      uploads: []
    }
  },

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

  addUpload: function(upload) {
    let uploads = this.state.uploads
    uploads.push(upload)
    this.setState({uploads: uploads})
  },

  removeUpload: function(index) {
    let uploads = this.state.uploads
    uploads.splice(index, 1)
    this.setState({uploads: uploads})
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
    if (msg.trim().length != 0) {
      //TODO: parse markdown (commonmark?)
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
    }

    if (this.state.uploads.length > 0) {
      this.uploadFiles(this.state.uploads)
      this.setState({uploads: []})
    }
    e.target.value = ""
    e.preventDefault()
    this.resize_textarea_delayed(e)
  },

  uploadFiles: function(uploads) {
    let client = this.props.client
    Promise.map(uploads, (upload) => {
      let fileUploadPromise = client.uploadContent(upload.file,
        {onlyContentUri: false}).then((response) => {
        return response.content_uri
      })

      let mimeType = upload.file.type
      let eventType = "m.file"
      let additionalPromise
      if (mimeType.startsWith("image/")) {
        eventType = "m.image"
        // create and upload thumbnail
        let thumbnailType = "image/png"
        if (mimeType == "image/jpeg") {
          thumbnailType = mimeType
        }
        additionalPromise = riot.loadImageElement(upload.file)
          .then((img) => {
            return riot.createThumbnail(img,
              img.width,
              img.height,
              thumbnailType)
            })
            .catch((error) => {
              console.error("neo: error getting thumbnail", error)
            })
            .then((thumbResult) => {
              return client.uploadContent(thumbResult.thumbnail, {onlyContentUri: false})
            }).then((response) => {
              return {
                thumbnail_url: response.content_uri,
                thumbnail_info: {
                  mimetype: thumbnailType
                }
              }
            })
      } else if (mimeType.startsWith("video/")) {
        eventType = "m.video"
      } else if (mimeType.startsWith("audio/")) {
        eventType = "m.audio"
      } else {
        // m.file
      }
      Promise.all([fileUploadPromise, additionalPromise]).then((result) => {
        console.log(result)
        let info = {
          mimetype: mimeType
        }
        if (result[1] != undefined) {
          info = Object.assign(info, result[1])
        }
        client.sendEvent(this.props.roomId, "m.room.message", {
          body: upload.file.name,
          msgtype: eventType,
          info: info,
          url: result[0]
        })
      })
    })
  },

  sendPlain: function(string) {
    let content = {
      body: string,
      msgtype: "m.text"
    }
    content = this.sendReply(content)
    this.props.client.sendEvent(this.props.roomId, "m.room.message", content, (err, res) => {
      if (err != null) {
        console.log(err)
      }
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
        <div className="replyEvent" onClick={() => this.props.onReplyClick()}>
          {this.props.replyEvent.plaintext()}
        </div>
      }
      {this.state.uploads.length > 0 &&
        <div className="imgPreview">
          {this.state.uploads.map((upload, key) => {
            return (
              <div key={key}>
                <img src={upload.preview}/>
                <span onClick={() => this.removeUpload(key)}>X</span>
              </div>
            )
          })}
        </div>
      }
      <div className="content">
        <textarea ref={this.setRef} rows="1" spellCheck="false" placeholder="unencrypted message"></textarea>
        <FileUpload addUpload={this.addUpload}/>
      </div>
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
