'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const urllib = require('url')

const Matrix = require('./backends/matrix.js')

const Sidebar = require('./components/sidebar.js')

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

  login: function() {
    let user = document.getElementById("user").value
    let pass = document.getElementById("pass").value
    let hs = document.getElementById("hs").value
    hs = urllib.parse(hs)

    let data = {
      user: user,
      password: pass,
      type: "m.login.password",
      initial_device_display_name: "Neo v4",
    };

    let url = urllib.format(Object.assign(hs, {
      pathname: "/_matrix/client/r0/login"
    }));

    fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({json: responseJson});
        if(responseJson.access_token != undefined) {
          let backend = new Matrix(responseJson.user_id, responseJson.access_token, "https://"+responseJson.home_server)
          this.setState({
            backend: backend
          })
          this.checkBackend()
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },

  render: function() {
    if (this.state.backend == undefined) {
      //Login screen
      return (
        <div className="loginwrapper">
          <img src="/neo.png"/>
          <div className="login">
            <label htmlFor="user">Username: </label><input type="text" id="user" placeholder="username"/>
            <label htmlFor="pass">Password: </label><input type="password" id="pass"/>
            <label htmlFor="hs">Homeserver: </label><input type="text" id="hs" placeholder="https://lain.haus"/>
            <button onClick={()=>this.login()}>Log in</button>
          </div>
        </div>
      )
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
