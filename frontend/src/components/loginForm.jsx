/** Import React. */
import React from 'react'

/** Import Axios. */
import Axios from 'axios'

import {Form, Input, Button} from '../blocks/forms'

export default class LoginForm extends React.Component {

  constructor(props) {

    super(props)
    this.state = {}

  }

  formSubmit = (e, data) => {

    e.preventDefault()

    Axios.post('http://localhost:5000/api/login', data).then(response => {

      localStorage.setItem('authToken', response.data.account.authToken)
      if(this.props.onSubmit) this.props.onSubmit(e, response.data)

    })

  }

  render() {

    return <Form onSubmit={(e, data) => this.formSubmit(e, data)}>
             <Input label="Username" type="text" name="login" value=""/>
             <Input label="Password" type="password" name="password" value=""/>
             <Button type="submit">Sign In</Button>
           </Form>

  }

}