'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const urllib = require('url')

const Matrix = require('./backends/matrix.js')

const Sidebar = require('./components/sidebar.js')

const Login = require('./components/Login.js')
const Info = require('./components/info.js')
const Chat = require('./components/chat.js')
const Input = require('./components/input.js')

// Things that will get settings:
// colorscheme
// avatar tilt
// incoming/outgoing message alignment (split)



let App = create({
  displayName: "App",

  getInitialState: function() {
    return {rooms: {}, events: {}}
  },

  checkBackend: function() {
    if(this.state.backend.hasUpdates()) {
      console.log("RECEIVING UPDATES FROM BACKEND")
      this.setState({
        rooms: this.state.backend.getRooms(),
        events: this.state.backend.getEvents()
      })
    }
    setTimeout(() => {
      this.checkBackend()
    }, 100)
  },

  loginCallback: function(userId, accessToken, apiUrl) {
    let backend = new Matrix(userId, accessToken, apiUrl)
    this.setState({
      backend: backend
    })
    this.checkBackend()
  },

  render: function() {
    if (this.state.backend == undefined) {
      //Login screen
      return <Login callback={this.loginCallback}/>
    }
    return (
      <>
        <Sidebar rooms={this.state.rooms} selectRoom={(roomId) => {this.setState({roomId: roomId})}}/>
        <div className="main">
          <Info />
          <Chat events={this.state.events} backend={this.state.backend} roomId={this.state.roomId}/>
          <Input />
        </div>
      </>
    )
  }
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
