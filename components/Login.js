'use strict'
const React = require('react')
const ReactDOM = require('react-dom')
const create = require('create-react-class')
const Promise = require('bluebird')
const urllib = require('url')
const debounce = require('debounce')
const defaultValue = require('default-value')

let login = create({
  displayName: "Login",

  getInitialState: function() {
    return {
      error: null,
      formState: {
        user: "",
        pass: "",
        hs: ""
      },
      hs: {
        prompt: false,
        error: null,
        valid: false
      }
    }
  },

  login: function() {
    this.setState({error: ""})

    if (this.state.hs.valid) {
      return this.doLogin()
    }

    let parts = this.state.formState.user.split(':')
    if (parts.length != 2) {
      return this.setState({error: "Please enter a full mxid, like username:homeserver.tld"})
    }

    let hostname = urllib.parse("https://" + parts[1])
    getApiServer(hostname).then((hs) => {
      console.log("Using API server", hs)
      let formState = this.state.formState
      formState.user = parts[0]
      formState.hs = hs
      let hsState = Object.assign(this.state.hs, {valid: true})
      this.setState({apiUrl: hs, formState: formState, hs: hsState})
      this.doLogin()
    }).catch((error) => {
      console.log("ERROR fetching homeserver url", error)
      let hsState = Object.assign(this.state.hs, {error: error, valid: false})
      this.setState({hs: hsState})
    })
  },

  doLogin: function() {
    console.log("Logging in")
    let user = this.state.formState.user.replace('@', '')
    let password = this.state.formState.pass
    let hs = this.state.apiUrl

    let data = {
      user: user,
      password: password,
      type: "m.login.password",
      initial_device_display_name: "Neo v4",
    };

    let url = hs + "/_matrix/client/r0/login"

    fetch(url, {
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      method: 'POST',
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log("got access token", responseJson)
      this.setState({json: responseJson})
      if(responseJson.access_token != undefined) {
        this.props.callback(responseJson.user_id, responseJson.access_token, hs)
      } else {
        this.setState({error: responseJson.error})
      }
    })
    .catch((error) => {
      console.error(url, error);
    });
  },

  handleUserChange: function(e) {
    let formState = this.state.formState
    let user = e.target.value
    formState.user = e.target.value
    let parts = user.split(':')
    if (parts.length == 2) {
      formState.hs = parts[1]
      let hsState = Object.assign(this.state.hs, {error: null, valid: false})
      this.setState({hs: hsState})
    }
    this.setState({formState: formState})
  },

  handlePassChange: function(e) {
    let formState = this.state.formState
    formState.pass = e.target.value
    this.setState({formState: formState})
  },

  handleHsChange: function(e) {
    let formState = this.state.formState
    formState.hs = e.target.value
    this.setState({formState: formState})
  },

  render: function() {
    let hsState = "inactive"
    if (this.state.hs.prompt) {
      hsState = "active"
    }
    if (this.state.hs.error != null) {
      hsState = "error"
    }
    if (this.state.hs.valid) {
      hsState = "validated"
    }

    return (
      <div className="loginwrapper">
        <img src="./neo.png"/>
        <div className="errorMessage">{this.state.error}</div>
        <div className="login">
          <label htmlFor="user">Username: </label>
          <input type="text" id="user" placeholder="@user:homeserver.tld" value={this.state.formState["user"]} onChange={this.handleUserChange}/>

          <label htmlFor="pass">Password: </label>
          <input type="password" id="pass" placeholder="password" value={this.state.formState["pass"]} onChange={this.handlePassChange}/>

          <label htmlFor="hs" className={hsState}>Homeserver: </label>
          {this.state.hs.prompt ? (
            <>
              <input type="text" id="hs" placeholder="https://lain.haus" value={this.state.formState["hs"]} onChange={this.handleHsChange}/>
            </>
          ) : (
            <span id="hs">{this.state.formState["hs"]}</span>
          )}

          <button onClick={()=>this.login()}>Log in</button>
        </div>
      </div>
    )
  }
})

function getApiServer(hostname) {
  return new Promise((resolve, reject) => {
    console.log("Checking for api server from mxid", urllib.format(hostname))
    checkApi(hostname).then(() => {
      // Hostname is a valid api server
      hostname.pathname = ""
      resolve(urllib.format(hostname))
    }).catch(() => {
      console.log("trying .well-known")
      tryWellKnown(hostname).then((hostname) => {
        console.log("got .well-known host", hostname)
        resolve(hostname)
      }).catch((err) => {
        reject("Fatal error trying to get API host")
      })
    })
  })
}

function checkApi(host) {
  let versionUrl = buildUrl(host, "/_matrix/client/versions")
  return new Promise((resolve, reject) => {
    fetch(versionUrl).then((response) => {
      if (response.status != 200) {
        console.log("Invalid homeserver url", versionUrl)
        return reject()
      }
      resolve()
    }).catch((err) => {
      reject(err)
    })
  })
}

function tryWellKnown(host) {
  let wellKnownUrl = urllib.format(Object.assign(host, {
    pathname: "/.well-known/matrix/client"
  }))
  console.log("Trying", wellKnownUrl, "for .well-known")
  return new Promise((resolve, reject) => {
    return fetch(wellKnownUrl)
      .then((response) => {
        if (response.status != 200) {
          console.log("no well-known in use")
          reject("No homeserver found")
        }
        return response
      }).catch((error) => {
        reject("can't fetch .well-known")
      })
      .then((response) => response.json())
      .then((json) => {
        console.log("Parsed json", json)
        if (json['m.homeserver'] != undefined && json['m.homeserver'].base_url != undefined) {
          resolve(json['m.homeserver'].base_url)
        }
      })
      .catch((err) => {
        console.log("Error in json", err)
        reject("Error while parsing .well-known")
      })
  })
}

function buildUrl(host, path) {
  return urllib.format(Object.assign(host, {
    pathname: path
  }))
}

module.exports = login
