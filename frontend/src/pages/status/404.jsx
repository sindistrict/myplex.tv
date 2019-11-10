import React from 'react'
import PageHeader from '../../components/pageHeader'

export default class Page404 extends React.Component {

  render() {

    return <div>
             <PageHeader status={this.props.status}/>
             <h1>404 Not Found</h1>
           </div>

  }

}