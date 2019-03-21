'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const defaultValue = require('default-value');

const components = require('../components/backends/Matrix.js');

class Matrix {
  constructor(user, password, homeserver) {
    this.a = 0
    this.events = {
      "roomId": [
      ]
    }

    //this.rooms = ["Neo", "version 4", "Codename", "Iris", "Let's All Love Lain", "Very long room name abcdefghijklmnopqrstuvwxyz"]
    this.rooms = {
      "room0": {
        name: "Neo",
        lastEvent: 10
      },
      "room1": {
        name: "v4: iris",
        lastEvent: 10
      },
      "room2": {
        name: "groups",
        lastEvent: 10
      },
      "room3": {
        name: "GUI Demo",
        lastEvent: 0
      }
    }
    this.updates = true
  }

  getEvents(roomId) {
    return this.events["roomId"]
  }

  getRooms() {
    let orderList = Object.keys(this.rooms)
    orderList.sort((a, b) => {
      return this.rooms[b].lastEvent - this.rooms[a].lastEvent
    })
    return {rooms: this.rooms, order: orderList}
  }

  hasUpdates() {
    if (this.updates) {
      this.updates = false
      return true
    }
    return false
  }

  sync() {
    let rand = this.lastRand
    while(rand == this.lastRand) {
      rand = Math.floor(Math.random()*Object.keys(this.rooms).length)
    }
    this.lastRand = rand
    let roomId = `room${rand}`
    let now = new Date().getMilliseconds()
    this.rooms[roomId].lastEvent = now
    this.updates = true

    let event = {
      content: {
        body: "Testing m.text",
        msgtype: "m.text"
      },
      event_id: this.fakeEventId(),
      origin_server_ts: 1432735824653,
      room_id: "!jEsUZKDJdhlrceRyVU:domain.com",
      sender: "@example:domain.com",
      type: "m.room.message",
      unsigned: {
        age: 1234
      }
    }
    this.events["roomId"].push(this.getReactEvent(event))
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

  getReactEvent(event) {
    let msgTypes = {
      "m.text": components.text
    }
    if (event.type == "m.room.message") {
      let msgtype = event.content.msgtype
      return React.createElement(
        defaultValue(msgTypes[msgtype], components.text),
        {event: event, key: event.event_id}
      )
    }
  }
}


module.exports = Matrix
