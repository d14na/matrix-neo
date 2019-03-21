'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

const Matrix = require('./backends/matrix.js')

const Sidebar = require('./components/sidebar.js')

const Info = require('./components/info.js')
const Chat = require('./components/chat.js')
const Input = require('./components/input.js')

// Things that will get settings:
// colorscheme
// avatar tilt
// incoming/outgoing message alignment (split)


let backend = new Matrix("user", "pass", "https://lain.haus")
backend.sync()

let App = create({
  displayName: "App",

  getInitialState: function() {
    return this.checkBackend()
  },

  checkBackend: function() {
    let returnValue = null
    if(backend.hasUpdates()) {
      returnValue = {
        rooms: backend.getRooms(),
        events: backend.getEvents()
      }
    }
    setTimeout(() => {
      this.setState(this.checkBackend())
    }, 100)
    return returnValue
  },

  render: function() {
    return (
      <>
        <Sidebar rooms={this.state.rooms}/>
        <div className="main">
          <Info />
          <Chat events={this.state.events} backend={backend}/>
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
