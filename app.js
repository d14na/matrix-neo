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


let backend = new Matrix("user", "pass", "http://localhost")
backend.sync()

let App = create({
  displayName: "App",

  render: function() {
    console.log("Render function")
    let rooms = backend.getRooms()
    return (
      <>
        <Sidebar rooms={rooms}/>
        <div className="main">
          <Info />
          <Chat events={backend.getEvents()}/>
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
