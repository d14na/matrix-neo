class Matrix {
  constructor(user, password, homeserver) {
    this.a = 0
    this.events = {
      "roomId": [
        {sender: "Foks", content: "Hello"},
        {sender: "Foks", content: "This is Neo v4"},
        {sender: "Foks", content: "Here is one test event\nWith\n Multiple\nLines\n:)"},
        {sender: "Different Foks", content: "Look at these nice colors"},
        {sender: "Different Foks", content: "And the font"},
        {sender: "Lain", content: "image"},
        {sender: "Lain", content: "image"},
        {sender: "Lain", content: "image"},
        {sender: "Different Foks", content: "And the avatars"},
        {sender: "Foks", content: "Every line has it's own message"},
        {sender: "Foks", content: "But if the sender is the same, we don't repeat the name+image"},
        {sender: "Foks", content: "Isn't message grouping great?"}
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
    setTimeout(() => {this.sync()}, 2000)
  }
}


module.exports = Matrix
