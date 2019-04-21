'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const defaultValue = require('default-value')

const riot = require('../../lib/riot-utils.js')

const elements = {
  "m.text": require('./text.js'),
  "m.image": require('./image.js')
}

const mxReplyRegex = /^<mx-reply>[\s\S]+<\/mx-reply>/

let Event = create({
  displayName: "Event",

  render: function() {
    let event = this.props.event
    let state = ""
    let reply = ""
    let element = "unsupported event"
    let parsedBody

    if (event.local) {
      state = " local"
    }

    if (event.type == "m.room.message") {
      let msgtype = event.content.msgtype;

      let formattedEvent = parseEvent(event)
      parsedBody = formattedEvent.body

      let parsedReply = formattedEvent.parsedReply
      if (parsedReply.isReply) {
        let repliedEvent = this.props.room.findEventById(parsedReply.to)
        let shortText
        if (repliedEvent == undefined) {
          shortText = "Can't load this event"
        } else {
          shortText = parseEvent(repliedEvent.event)
          if (shortText.html) {
            shortText = <span dangerouslySetInnerHTML={{__html: shortText.body}}/>
          } else {
            shortText = shortText.body
          }
        }
        reply = (
          <div className="reply">
            {shortText}
          </div>
        )
      }
      element = React.createElement(defaultValue(elements[msgtype], elements["m.text"]), {body: parsedBody, event: event, client: this.props.client})
    }

    return (
      <div className={"event" + state} onClick={() => {console.log(parsedBody, event)
        }}>
        {reply}
        {element}
      </div>
    )
  }
})

function parseEvent(event, context) {
  // context can be either 'main' or 'reply'
  let body = event.content.body
  let html = false

  if (event.content.format == "org.matrix.custom.html") {
    body = riot.sanitize(event.content.formatted_body)
    html = true
  }

  let parsedReply = parseReply(event, body)
  if (parsedReply.isReply) {
    // body with fallback stripped
    body = parsedReply.body
  }
  return {body: body, parsedReply: parsedReply, html: html}
}

function parseReply(event, body) {
  let replyTo
  try {
    replyTo = event.content['m.relates_to']['m.in_reply_to'].event_id
    if (replyTo) {
      // strip <mx-reply> from message if it exists
      console.log("STRIPPING FROM", body)
      body = body.replace(mxReplyRegex, "")
      console.log("TO            ", body)
    }
  } catch(err) {
    // no reply
    return {isReply: false}
  }
  return {isReply: true, body: body, to: replyTo}
}

module.exports = Event
