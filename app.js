'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const jdenticon = require('jdenticon')

const Matrix = require('./backends/matrix.js')

const Sidebar = require('./components/sidebar.js')

const Info = require('./components/info.js')
const Chat = require('./components/chat.js')
const Input = require('./components/input.js')

jdenticon.config = {
    lightness: {
        color: [0.58, 0.66],
        grayscale: [0.30, 0.90]
    },
    saturation: {
        color: 0.66,
        grayscale: 0.00
    },
    backColor: "#00000000"
};

// Things that will get settings:
// colorscheme
// avatar tilt
// incoming/outgoing message alignment (split)


let backend = new Matrix("user", "pass", "http://localhost")

let App = create({
  displayName: "App",

  render: function() {
    return (
      <>
        <Sidebar/>
        <div className="main">
          <Info />
          <Chat />
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
