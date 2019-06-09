'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const urllib = require('url')
const sdk = require('matrix-js-sdk')

const Sidebar = require('./components/sidebar.js')
const Login = require('./components/Login.js')
const Chat = require('./components/chat.js')

// Things that will get settings:
// colorscheme
// avatar tilt
// incoming/outgoing message alignment (split)

let App = create({
  displayName: "App",

  getInitialState: function() {
    return {
      rooms: [],
      options: {
        fallbackMediaRepos: []
      }
    }
  },

  componentDidMount: function() {
    //check if accessToken is stored in localStorage
    let accessToken = localStorage.getItem('accessToken')
    if (localStorage.accessToken != undefined) {
      let userId = localStorage.getItem('userId')
      let apiUrl = localStorage.getItem('apiUrl')
      this.loginCallback(userId, accessToken, apiUrl, true)
    }
  },

  loginCallback: function(userId, accessToken, apiUrl, restored) {
    if (restored) {
      console.log("Restoring from localStorage")
    } else {
      userId = '@' + userId.replace('@', '')
      localStorage.setItem('userId', userId)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('apiUrl', apiUrl)
    }
    let client = sdk.createClient({
      baseUrl: apiUrl,
      accessToken: accessToken,
      userId: userId
    });

    this.setState({
      client: client
    })
    this.startClient(client)
  },

  startClient: function(client) {
    console.log(client)
    client.on("sync", (state, prevState, data) => {
      if (state == "ERROR") {
      } else if (state == "SYNCING") {
        let rooms = {}
        client.getRooms().forEach((room) => {
          rooms[room.roomId] = room
        })
        this.setState({rooms: rooms})
      } else if (state == "PREPARED") {
      }
    })
    client.on("Room.localEchoUpdated", (event) => {
      let rooms = {}
      client.getRooms().forEach((room) => {
        rooms[room.roomId] = room
      })
      this.setState({rooms: rooms})
    })
    client.startClient()
  },

  render: function() {
    if (this.state.client == undefined) {
      //Login screen
      return <Login callback={this.loginCallback}/>
    }
    return (
      <>
        <Sidebar options={this.state.options} client={this.state.client} rooms={this.state.rooms} selectRoom={(roomId) => {this.setState({roomId: roomId})}}/>
        <Chat client={this.state.client} roomId={this.state.roomId}/>
      </>
    )
  }
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
