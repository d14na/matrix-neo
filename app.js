'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')

const Matrix = require('./backends/matrix.js')

const Sidebar = require('./components/sidebar.js')

const Info = require('./components/info.js')
const Chat = require('./components/chat.js')

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
        </div>
      </>
    )
  }
})

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
