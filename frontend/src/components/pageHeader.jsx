/** Import React. */
import React from 'react'

/** Import Axios. */
import Axios from 'axios'

import {ReactComponent as Logo} from '../svg/nav-brand.svg'
import './pageHeader.scss'

export default class PageHeader extends React.Component {

  constructor(props) {

    super(props)
    this.state = {}
    this.state.server = []

  }

  componentDidMount() {

    Axios.get('http://localhost:5000/api/data/server').then(response => {

      this.setState({server: response.data.server})

    })

  }

  render() {

    return <header id="page-header">
             <h1 id="page-header-logo">
              <a className="page-header-primary-link" href="/">
                <Logo/>
              </a>
             </h1>
             <nav id="page-header-primary-nav">
               <button>
                 <svg className="fill" width="28" height="20" viewBox="0 0 28 20">
                   <path d="M2 18h24V8H2v10zm-2 2V6h28v14H0zM2 3h24v2H2V3zm2-3h20v2H4V0z"></path>
                 </svg>
                 <span className="nav-label">Browse</span>
               </button>
               <div className="sub-menu" id="browse-menu">
                 <nav></nav>
               </div>
               <button>
                 <svg className="stroke" viewBox="0 0 29 22" width="29" height="22">
                   <g fill="none" fillRule="evenodd">
                     <path d="M1 21h27V1H1z" strokeWidth="1.66"></path>
                     <path d="M19.805 7.667l.6.576-7.21 6.924-3.758-3.606.603-.576 3.154 3.028z" strokeWidth=".83"></path>
                   </g>
                 </svg>
                 <span className="nav-label">My Deck</span>
               </button>
             </nav>
             <nav id="page-header-secondary-nav">
               <button>
                 <figure className="avatar">
                   <img alt={this.props.status.account.username} src={this.props.status.account.thumb}/>
                 </figure>
                 <span className="nav-label">{this.props.status.account.username}<br/><small>{this.props.status.account.email}</small></span>
               </button>
             </nav>
           </header>

  }

}