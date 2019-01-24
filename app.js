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

let App = create({
  displayName: "App",

  getInitialState: function() {
    setTimeout(this.newEvent, 5000)
    return {
      events: [
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
  },

  newEvent: function() {
    let events = this.state.events
    events.push({sender: "Random person", content: "New message"})
    this.setState({events: events})
    setTimeout(this.newEvent, 5000)
  },

  render: function() {
    return (
      <>
        <Sidebar/>
        <div className="main">
          <Info />
          <Chat events={this.state.events}/>
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
