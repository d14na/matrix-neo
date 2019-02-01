class Matrix {
  constructor(user, password, homeserver) {
    this.a = false
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

    this.rooms = ["Neo", "version 4", "Codename", "Iris", "Let's All Love Lain", "Very long room name abcdefghijklmnopqrstuvwxyz"]
    this.a = 0
  }

  getEvents(roomId) {
    return this.events["roomId"]
  }

  getRooms() {
    console.log("getting rooms", this.rooms)
    return this.rooms
  }

  sync() {
    //this.events.push({sender: "Random person", content: "New message"})
    if (this.a > 0) {
      console.log("reordering")
      this.rooms = ["AAAAAAAAAAA"]
    }
    console.log(this.a)
    this.a++
    setTimeout(() => {this.sync()}, 2000)
  }
}


module.exports = Matrix
