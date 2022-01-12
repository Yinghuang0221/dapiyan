import React from 'react'
import {GoogleLogin} from 'react-google-login'
import axios from '../api'
import { useState } from 'react'

const Calender = ()=>{


  const responseGoogle = (response) => {
    console.log(response)
    const {code} = response
    axios.post('/api/create-tokens', { code })
      .then(response => {
        console.log(response.data)
        setSignedIn(true)
      })
      .catch(error => console.log(error.message))
  }

  const responseError = (error) => {
    console.log(error)
  }

  const handleSubmit = (e) =>{
    e.preventDefault()
    // console.log(summary, description, location, startDateTime, endDateTime)
    axios.post('/api/create-event', {
      summary, 
      description, 
      location, 
      startDateTime, 
      endDateTime
    })
    .then(response =>{
      console.log(response.data)
    })
    .catch(error => {console.log(error.message)})
  }

  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [startDateTime, setStartDateTime] = useState('')
  const [endDateTime, setEndDateTime] = useState('')
  const [signedIn, setSignedIn] = useState(false)


  return (
    <div>
      <div>
        <h1>Piyan</h1>
      </div>
      {
        !signedIn ? (<div>
          <GoogleLogin 
            clientId="824943228622-9cffm6j6jboi5v04j7o1sla2rvekva0k.apps.googleusercontent.com"
            buttonText="piyan" 
            onSuccess={responseGoogle}
            onFailure={responseError}
            cookiepolicy={'single_host_origin'}
            responseType='code'
            accessType='offline'
            scope='openid email profile https://www.googleapis.com/auth/calendar'
            />
        </div>) : (<div>
        <form onSubmit={handleSubmit}>
          <label htmlFor='summary'> Summary </label>
          <br />
          <input 
          type='text' 
          id='summary'
          value={summary}
          onChange={e => {setSummary(e.target.value)}} 
          />
          <br />



          <label htmlFor='description'> Description </label>
          <br />
          <input 
          type='text' 
          id='description'
          value={description}
          onChange={e => {setDescription(e.target.value)}} 
          />
          <br />

          <label htmlFor='location'> Location </label>
          <br />
          <input 
          type='text' 
          id='location'
          value={location}
          onChange={e => {setLocation(e.target.value)}} 
          />
          <br />

          <label htmlFor='startDateTime'> Start Date Time </label>
          <br />
          <input 
          type='datetime-local' 
          id='startDateTime'
          value={startDateTime}
          onChange={e => {setStartDateTime(e.target.value)}} 
          />
          <br />

          <label htmlFor='endDateTime'> End Date Time </label>
          <br />
          <input 
          type='datetime-local' 
          id='endDateTime'
          value={endDateTime}
          onChange={e => {setEndDateTime(e.target.value)}} 
          />
          <br />

          
          <button type='submit'> 加入到行事曆 </button>

        </form>
      </div>)
      }
      
      
    </div>
  )
}
export default Calender