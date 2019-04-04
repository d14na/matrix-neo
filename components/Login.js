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
    return {error: null}
  },

  login: function() {
    let user = document.getElementById("user").value
    let pass = document.getElementById("pass").value

    let parts = user.split(':')
    if (parts.length != 2) {
      return this.setState({error: "Please enter a full mxid, like @username:homeserver.tld"})
    }

    let hostname = urllib.parse("https://" + parts[1])
    getApiServer(hostname).then((hostname) => {
      hostname.pathname = ""
      let hs = urllib.format(hostname)
      console.log("Using API server", hs)
      this.setState({apiUrl: hs})
      //this.login()
    })
  },

  login: function() {
    let data = {
      user: this.state.user,
      password: this.state.password,
      type: "m.login.password",
      initial_device_display_name: "Neo v4",
    };

    let url = urllib.format(Object.assign(this.state.apiUrl, {
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
        this.props.loginCallback()
      }
    })
    .catch((error) => {
      console.error(error);
    });
  },

  render: function() {
    return (
      <div className="loginwrapper">
        <img src="./neo.png"/>
        <div className="error">{this.state.error != null && this.state.error}</div>
        <div className="login">
          <label htmlFor="user">Username: </label>
          <input type="text" id="user" placeholder="username" defaultValue="f0x:hacklab.fi"/>

          <label htmlFor="pass">Password: </label>
          <input type="password" id="pass"/>

          {this.state.promptHS &&
            <>
              <label htmlFor="hs">Homeserver: </label>
              <input type="text" id="hs" placeholder="https://lain.haus"/>
            </>
          }

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
      resolve(hostname)
    }).catch(() => {
      console.log("trying .well-known")
      tryWellKnown(hostname).then((hostname) => {
        console.log("got .well-known host", hostname)
      }).catch((err) => {
        console.log("Fatal error trying to get API host", err)
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
          reject()
        }
        return response
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
        reject()
      })
  })
}

function buildUrl(host, path) {
  return urllib.format(Object.assign(host, {
    pathname: path
  }))
}

module.exports = login
