import React from 'react'
import Axios from 'axios'

import './setup.scss'

import LoginForm from '../components/loginForm'
import {Form, Input, Select, CheckButton, Progress, Button} from '../blocks/forms'


export default class PageSetup extends React.Component {

  constructor(props) {

    super(props)
    this.state = {}

    this.state.loading = true

    this.state.step = !props.status.account ? 'login' : 'servers'
    this.state.installed = props.status.installed || false
    this.state.account = props.status.account || false

    this.state.servers = []
    this.state.selectedServer = null
    this.state.selectedLibraries = []

    this.state.imported = {progress: 0, total: -1}

    this.state.settings = {title: ''}

    this.loginSubmit = this.loginSubmit.bind(this)
    this.serverSelect = this.serverSelect.bind(this)
    this.librarySelect = this.librarySelect.bind(this)
    this.importLibraries = this.importLibraries.bind(this)
    this.completeSetup = this.completeSetup.bind(this)

  }

  loginSubmit = (e, data) => {

    if(data.account && data.status === 200) {

      this.setState({step: 'servers', account: data.account})

    }

  }

  FetchServers() {

    Axios.get('http://localhost:5000/api/plex/servers', {

      headers: {'authToken': this.state.account.authToken}

    }).then(response => {

      if(!Object.keys(this.state.servers).length) {

        let servers = response.data.servers

        Object.keys(servers).map(i => {

          let server = servers[i]
          server.libraries = {}

          Axios.get(`http://localhost:5000/api/plex/servers/${server.host}:${server.port}/libraries`, {

            headers: {'authToken': this.state.account.authToken}

          }).then(response => {

            let libraries = response.data.libraries

            Object.keys(libraries).map(i => {

              let slug = libraries[i].title.toString().toLowerCase().replace(/\s+/g, '-')
                         .replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-')
                         .replace(/^-+/, '').replace(/-+$/, '')

              server.libraries[slug] = libraries[i]

            })

          })

        })

        setTimeout(() => {

          this.setState({servers, loading: false})

        }, 2000)

      }

    }).catch(error => {

      console.error(error)

    })

  }


  serverSelect(e) {

    let key = e.target.value
    let server = this.state.servers[key]

    this.setState({selectedServer: server, selectedLibraries: []})

  }


  librarySelect(e) {

    let selectedLibraries = this.state.selectedLibraries

    if(e.target.checked) {

      selectedLibraries.push(e.target.value)

    }else{

      selectedLibraries = selectedLibraries.filter(i => i !== e.target.value)
      
    }

    this.setState({selectedLibraries})

  }


  importLibraries(e, data) {

    this.setState({step: 'importing', loading: true})
    
    let server = this.state.selectedServer
    let sections = ['all', 'newest', 'recentlyAdded', 'genre', 'collection']

    let imported = this.state.imported
    imported.total = sections.length * Object.keys(this.state.selectedLibraries).length

    Object.values(this.state.selectedLibraries).map(lib => {

      let library = server.libraries[lib]
      library.sections = {}

      Object.values(sections).map(section => {

        setTimeout(() => {

          Axios.get(`http://localhost:5000/api/plex/servers/${server.host}:${server.port}/libraries/${library.key}/${section}`, {

            headers: {'authToken': this.state.account.authToken}
    
          }).then(response => {

            setTimeout(() => {

              if(response.data.status !== 200) {

                imported.total--
  
              }else{
  
                library.sections[section] = response.data.section
  
                imported.progress++
  
                if(imported.progress >= imported.total) {
  
                  this.setState({loading: false, step: 'settings'})
  
                }
  
              }
  
              this.setState({imported, selectedServer: server})

            }, 2000)
    
          })

        }, 2000)

      })

    })

  }

  completeSetup(e, settings) {

    settings.installed = Date.now()

    Axios.post('http://localhost:5000/api/setup', {

      owner: this.state.account, 
      server: this.state.selectedServer,
      settings: settings

    }).then(response => {

      if(response.data.status === 200) window.location.reload()

    })

  }


  render() {

    if(!this.state.account) {

      return <div id="page-setup" loading={`${this.state.loading}`}>
               <div id="setup-content">
                <h1>Setup Page</h1>
                <LoginForm onSubmit={(e, data) => this.loginSubmit(e, data)}/>
               </div>
             </div>

    }else{

      if(this.state.step === 'servers') {

        this.FetchServers()

        return <Form onSubmit={(e, data) => this.importLibraries(e, data)}>
                 <div id="page-setup" loading={`${this.state.loading}`}>
                  <div id="setup-account-preview">
                    <figure className="avatar">
                      <img draggable={false} alt={this.state.account.username} src={this.state.account.thumb}/>
                    </figure>
                    <div>
                      <strong>{this.state.account.username}</strong>
                      <span>{this.state.account.email}</span>
                    </div>
                  </div>
                  <div id="setup-content">
                    <Select name="server" defaultValue="" disabled={this.state.loading} onChange={this.serverSelect}>
                      <option disabled value="">{this.state.loading ? 'Fetching servers...' : 'Select a server'}</option>
                      {Object.keys(this.state.servers).map((key, server) => 
                        <option key={key} value={key}>{this.state.servers[key].name}</option>
                      )}
                    </Select>
                    <div id="setup-libraries">
                      {this.state.selectedServer !== null &&
                        Object.keys(this.state.selectedServer.libraries).map((key, library) => 
                          <CheckButton key={key} name="libraries" value={key} disabled={this.state.loading} onChange={this.librarySelect}>
                            {this.state.selectedServer.libraries[key].title}
                          </CheckButton>
                        )
                      }
                    </div>
                    <Button type="submit" disabled={Object.keys(this.state.selectedLibraries).length === 0}>
                      Import Libraries
                    </Button>
                  </div>
                 </div>
               </Form>

      }

      if(this.state.step === 'importing') {

        return <div id="page-setup" loading={`${this.state.loading}`}>
                <div id="setup-account-preview">
                  <figure className="avatar">
                    <img draggable={false} alt={this.state.account.username} src={this.state.account.thumb}/>
                  </figure>
                  <div>
                    <strong>{this.state.account.username}</strong>
                    <span>{this.state.account.email}</span>
                  </div>
                </div>
                  <div id="setup-content">
                    <p>Importing Libraries</p>
                    <Progress value={this.state.imported.progress} max={this.state.imported.total}/>
                  </div>
              </div>

      }

      if(this.state.step === 'settings') {

        return <Form onSubmit={(e, data) => this.completeSetup(e, data)}>
                 <div id="page-setup" loading={`${this.state.loading}`}>
                  <div id="setup-account-preview">
                    <figure className="avatar">
                      <img draggable={false} alt={this.state.account.username} src={this.state.account.thumb}/>
                    </figure>
                    <div>
                      <strong>{this.state.account.username}</strong>
                      <span>{this.state.account.email}</span>
                    </div>
                  </div>
                  <div id="setup-content">
                    <Input id="settings-title" name="title" label="Site Title" type="text" value={this.state.selectedServer.name}/>
                    <Button type="submit">
                      Complete Setup
                    </Button>
                  </div>
                 </div>
               </Form>

      }

    }

  }


}