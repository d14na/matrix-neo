'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const jdenticon = require('jdenticon')

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

let User = create({
  displayName: "user",

  getInitialState: function() {
    let icon = jdenticon.toSvg(this.props.user.userId, 200)
    let match = icon.match(/#([a-f0-9]{6})/g)
    console.log(match, icon)
    let color = '#ff0000'
    for(let i=match.length-1; i>= 0; i--) {
      color = match[i]
      let r = color.substr(1, 2)
      let g = color.substr(3, 2)
      let b = color.substr(5, 2)
      console.log(r, g, b)
      if (r != g && g != b) { //greyscale
        break
      }
    }
    return {
      color: color
    }
  },

  render: function() {
    return (
      <div className="user" style={{color: this.state.color}}>
        {this.props.user.displayName}
      </div>
    )
  }
})

module.exports = User
