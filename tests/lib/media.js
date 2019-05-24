let assert = require('assert')
let urllib = require('url')
let querystring = require('querystring')

let mediaLib = require('../../lib/media.js')

let client = {
  mxcUrlToHttp: function(url, w, h, method, allowDirectLinks) {
    let hs = "https://chat.privacytools.io"
    let mxc = url.slice(6)
    if (w) {
      return `${hs}/_matrix/media/v1/thumbnail/${mxc}?w=${w}&h=${h}&method=${method}`
    } else {
      return `${hs}/_matrix/media/v1/download/${mxc}`
    }
  }
}

let mockEventTemplate = {
  type: "m.room.message",
  sender: "@f0x:privacytools.io",
  content: {
    body: "image.png",
    info: {
      size: 16692,
      mimetype: "image/png",
      thumbnail_info: {
        w: 268,
        h: 141,
        mimetype: "image/png",
        size: 16896
      },
      w: 268,
      h: 141,
      thumbnail_url: "mxc://privacytools.io/zBSerdKMhaXSIxfjzCmOnhXH"
    },
    msgtype: "m.image",
    url: "mxc://privacytools.io/khPaFfeRyNdzlSttZraeAUre"
  },
  event_id: "$aaa:matrix.org",
  origin_server_ts: 1558470168199,
  unsigned: {
    age: 143237861
  },
  room_id: "!aaa:matrix.org"
}

describe('media', function() {
  describe('#parseEvent()', function() {
    it('event without info', function() {
      let mockEvent = JSON.parse(JSON.stringify(mockEventTemplate))
      mockEvent.content.info = null

      checkParsedEvent(mockEvent, {
        w: 1000,
        h: 1000,
        method: 'scale'
      })
    }),
    it('event without thumbnail', function() {
      let mockEvent = JSON.parse(JSON.stringify(mockEventTemplate))
      mockEvent.content.info.thumbnail_url = null
      mockEvent.content.info.thumbnail_info = null
      checkParsedEvent(mockEvent, {
        w: 268,
        h: 141,
        method: 'scale'
      })
    })
    it('event without thumbnail_info', function() {
      let mockEvent = JSON.parse(JSON.stringify(mockEventTemplate))
      mockEvent.content.info.thumbnail_url = null
      checkParsedEvent(mockEvent, {
        w: 268,
        h: 141,
        method: 'scale'
      })
    })
  })
})

function checkParsedEvent(mockEvent, expected) {
  let media = mediaLib.parseEvent(client, mockEvent, 1000, 1000)
  let params = querystring.decode(urllib.parse(media.thumb).query)

  Object.keys(params).forEach((key) => {
    assert.equal(expected[key], params[key])
  })
}
