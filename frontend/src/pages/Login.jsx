import React, { useState } from 'react' 
import LoginForm from '../components/Forms/LoginForm'
import LoginSlideShow from '../components/SlideShows/LoginSlideShow'

function Login() {
 

  return (
   <div className='flex h-screen'>
   <div className='hidden md:block w-1/2 h-full'>
    <LoginSlideShow/>
   </div>
   <div className='w-full md:w-1/2  bg-white p-4  shadow  h-full'>
    <LoginForm/>
   </div>
   </div>
  )
}

export default Login
