'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const defaultValue = require('default-value')
const sdk = require('matrix-js-sdk')

class Matrix {
  constructor(user, token, homeserver) {
    this.user = user;
    this.homeserver = homeserver;
    this.client = sdk.createClient({
      baseUrl: homeserver,
      accessToken: token,
      userId: user
    });

    this.events = {}
    this.rooms = {}
    this.startClient()
    this.updates = true
  }

  startClient() {
    this.client.on("Room.timeline", (event, room, toStartOfTimeline) => {
      if (toStartOfTimeline) {
          return
        }
        if (this.events[room.roomId] == undefined) {
          this.events[room.roomId] = []
          this.rooms[room.roomId] = {
            name: room.name,
            lastEvent: 0
          }
        }
        this.events[room.roomId].push(event.event)
        this.updates = true
        console.log("NEW EVENTS")
    })
    this.client.startClient()
  }

  getHS() {
    return this.homeserver
  }

  getEvents(roomId) {
    return this.events
  }

  getRooms() {
    return this.rooms
  }

  hasUpdates() {
    if (this.updates) {
      this.updates = false
      return true
    }
    return false
  }

  sync() {
    // let rand = this.lastRand
    // while(rand == this.lastRand) {
    //   rand = Math.floor(Math.random()*Object.keys(this.rooms).length)
    // }
    // this.lastRand = rand
    // let roomId = `room${rand}`
    // let now = new Date().getMilliseconds()
    // this.rooms[roomId].lastEvent = now
    // this.updates = true

    // let event = {
    //   content: {
    //     body: "New <code>m.text</code> Event",
    //     msgtype: "m.text"
    //   },
    //   event_id: this.fakeEventId(),
    //   origin_server_ts: 1432735824653,
    //   room_id: "!jEsUZKDJdhlrceRyVU:domain.com",
    //   sender: "@example:domain.com",
    //   type: "m.room.message",
    //   unsigned: {
    //     age: 1234
    //   }
    // }
    // this.events["roomId"].push(event)

    setTimeout(() => {this.sync()}, 2000)
  }

  fakeEventId() {
    let id = ""
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for (let i = 0; i < 32; i++) {
      id += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return id
  }
}

module.exports = Matrix
