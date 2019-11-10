import React from 'react'

import './mediaList.scss'

export default class MediaList extends React.Component {

  constructor(props) {

    super(props)
    this.state = {}
    
    this.state.library = props.library
    this.state.section = props.library.sections[props.section]
    this.state.allMedia = props.library.sections.all

  }

  render() {

    return <div className="media-list">
            <h2>{this.props.title}</h2>
            <ul className="media-list-items" section={this.props.section}>

              {this.props.section === 'collection' &&
              
                Object.values(this.state.section).reverse().map(collection => {

                  return <li className="media-list-item" key={collection.key}>
                           <a href={`/${this.props.library.slug}/collections/${collection.slug}/`}>
                            <figure className="media-list-item-image">
                              <strong>{collection.title}</strong>
                            </figure>
                           </a>
                         </li>

                })
              
              }

              {this.props.section !== 'collection' &&
              
                Object.values(this.state.section).reverse().map(uuid => {

                  let itemKey = Object.keys(this.state.section).find(key => this.state.section[key] === uuid)
                  let item = this.state.allMedia[itemKey]

                  let duration = Math.floor(((item.duration / 1000) / 60))

                  return <li className="media-list-item" key={uuid}>
                           <a href={`/${this.props.library.slug}/${item.slug}/`}>
                            <figure className="media-list-item-image" 
                            style={{backgroundImage: `url(${item.poster.medium}${localStorage.getItem('authToken')})`}}>
                              <time>{duration} min</time>
                            </figure>
                            <div className="media-list-item-content">
                              <span className="media-list-item-title">{item.title}</span>
                            </div>
                           </a>
                        </li>

                })

              }
            </ul>
           </div>

  }

}