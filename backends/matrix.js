'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const defaultValue = require('default-value')

class Matrix {
  constructor(user, password, homeserver) {
    this.user = user;
    this.password = password;
    this.homeserver = homeserver;
    this.a = 0
    this.events = {
      "roomId": [
        {
          type: "m.room.message",
          sender: "@f0x:lain.haus",
          content: {
            body: "Image caption",
            info: {
              size: 1331429,
              mimetype: "image/png",
              thumbnail_info: {
                w: 600,
                h: 600,
                mimetype: "image/png",
                size: 151911
              },
              w: 2000,
              h: 2000,
              thumbnail_url: "mxc://lain.haus/PnptnVmLprDNICfhCqIIurHZ"
            },
            msgtype: "m.image",
            url: "mxc://lain.haus/MXtCRwxheuSEVsIyHfyUGJNz"
          },
          event_id: "$155317808164309EPnWP:lain.haus",
          origin_server_ts: 1553178081145,
          unsigned: {
            age: 587,
            transaction_id: "m1553178080798.12"
          },
          room_id: "!bghqZrxFTiDyEUzunK:disroot.org"
        }
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

  getHS() {
    return this.homeserver
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

  addEvent(event) {
    this.events["roomId"].push(event)
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
    this.events["roomId"].push(event)
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
