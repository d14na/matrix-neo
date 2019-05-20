'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')

let fileUpload = create({
  displayName: "FileUpload",

  setFileRef: function(e) {
    if (e != null) {
      e.addEventListener('change', this.startUpload)
      this.setState({
        fileRef: e
      })
    }
  },

  startUpload: function(e) {
    Array.from(e.target.files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        let reader = new FileReader()
        reader.onloadend = () => {
          let fileObject = {
            file: file,
            preview: reader.result
          }
          this.props.addUpload(fileObject)
        }
        reader.readAsDataURL(file)
      } else {
        this.props.addUpload({file: file, preview: "/icons/file.svg"})
      }
    })
  },

  render: function() {
    return (
      <div className="fileUpload">
        <input type="file" id="fileUpload" multiple ref={this.setFileRef} />
        <label htmlFor="fileUpload">file</label>
      </div>
    )
  }
})

module.exports = fileUpload
