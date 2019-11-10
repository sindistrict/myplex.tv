import React from 'react'

import PageHeader from '../components/pageHeader'
import MediaList from '../blocks/mediaList'

export default class PageHome extends React.Component {

  constructor(props) {

    super(props)
    this.state = {}

    this.state.featured = []
    this.state.activeFeatured = 0

  }

  componentDidMount() {

    let itemKeys = []
    let featured = this.state.featured
    Object.keys(this.props.status.server.libraries['movies'].sections.all).map(key => itemKeys.push(key))

    for(let i = 0; i < 10; i++) {

      let randKey = Math.floor(Math.random() * itemKeys.length) + 1
      let item = this.props.status.server.libraries['movies'].sections.all[itemKeys[randKey]]
      featured.push(item)

    }

    this.setState({featured})

    setInterval(() => {

      let activeFeatured = this.state.activeFeatured
      activeFeatured++
      if(activeFeatured > this.state.featured.length - 1) activeFeatured = 0
      this.setState({activeFeatured})

    }, 10000)

  }

  render() {

    return <div>
             <PageHeader status={this.props.status}/>
             <div id="featured-media">
             {Object.keys(this.state.featured).map(i => {
               let featured = this.state.featured[i]
               return <figure key={i} id={`featured-${i}`} aria-current={i == this.state.activeFeatured} style={{backgroundImage: `url(${featured.background.large}${localStorage.getItem('authToken')})`}}>
                        <div id="featured-media-content">
                          <h1>{featured.title}</h1>
                          <p>{featured.summary}</p>
                        </div>
                      </figure>
             })}
             </div>
             <MediaList title="Movie Collections" section="collection" library={this.props.status.server.libraries['movies']}/>
             <MediaList title="Recently Added Movies" section="recentlyAdded" library={this.props.status.server.libraries['movies']}/>
             <MediaList title="Recently Released Movies" section="newest" library={this.props.status.server.libraries['movies']}/>
           </div>

  }

}