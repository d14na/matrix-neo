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

const mxReplyRegex = /<mx-reply>(.+)<\/mx-reply>/

let Event = create({
  displayName: "Event",

  render: function() {
    let event = this.props.event
    let state = ""
    let reply = ""
    let element = "unsupported event"

    if (event.local) {
      state = " local"
    }

    if (event.type == "m.room.message") {
      let msgtype = event.content.msgtype;
      let formattedEvent = getEvent(event)
      let parsedBody = formattedEvent.body

      let parsedReply = formattedEvent.parsedReply
      if (parsedReply.isReply) {
        let repliedEvent = this.props.room.findEventById(parsedReply.to)
        let shortText = getEvent(repliedEvent.event).body
        if (shortText.length > 50) {
          shortText = shortText.substr(0, 50) + "..."
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
      <div className={"event" + state}>
        {reply}
        {element}
      </div>
    )
  }
})

function getEvent(event) {
  let body = event.content.body
  if (event.content.format == "org.matrix.custom.html") {
    body = riot.sanitize(event.content.formatted_body)
  }
  let parsedReply = parseReply(event, body)
  if (parsedReply.isReply) {
    body = parsedReply.body
  }
  return {body: body, parsedReply: parsedReply}
}

function parseReply(event, body) {
  let replyTo
  try {
    replyTo = event.content['m.relates_to']['m.in_reply_to'].event_id
    if (replyTo) {
      // strip <mx-reply> from message if it exists
      body = body.replace(mxReplyRegex, "")
    }
  } catch(err) {
    // no reply
    return {isReply: false}
  }
  return {isReply: true, body: body, to: replyTo}
}

module.exports = Event
