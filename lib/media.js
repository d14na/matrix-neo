// should be able to handle images, stickers, and video

module.exports = {
  parseEvent: function(client, event, maxHeight, maxWidth) {
    if (event.content.msgtype == "m.image") {
      let h = maxHeight
      let w = maxWidth

      let media_url = client.mxcUrlToHttp(event.content.url)
      let thumb_url = event.content.url

      if (event.content.info != null) {
        if (event.content.info.thumbnail_url != null) {
          thumb_url = event.content.info.thumbnail_url
        }

        if (event.content.info.thumbnail_info != null) {
          h = (event.content.info.thumbnail_info.h < maxHeight) ? event.content.info.thumbnail_info.h : h
          w = (event.content.info.thumbnail_info.w < maxWidth)  ? event.content.info.thumbnail_info.w : w
        } else {
          h = (event.content.info.h < maxHeight) ? event.content.info.h : h
          w = (event.content.info.w < maxWidth)  ? event.content.info.w : w
        }
      }

      thumb_url = client.mxcUrlToHttp(thumb_url, w, h, 'scale', false)

      return {
        full: media_url,
        thumb: thumb_url,
        size: {h, w}
      }
    }
    if (event.content.msgtype == "m.video") {
      let thumb = null
      let h = maxHeight
      let w = maxWidth

      if (event.content.info != null) {
        if (event.content.info.thumbnail_url != null) {
          if (event.content.info.thumbnail_info != null) {
            h = (event.content.info.thumbnail_info.h < maxHeight) ? event.content.info.thumbnail_info.h : h
            w = (event.content.info.thumbnail_info.w < maxWidth)  ? event.content.info.thumbnail_info.w : w
          }

          thumb = client.mxcUrlToHttp(event.content.thumbnail, w, h, 'scale', false)
        }
      }
      return {
        full: client.mxcUrlToHttp(event.content.url),
        thumb: thumb,
        size: {h, w}
      }
    }
  }
}
