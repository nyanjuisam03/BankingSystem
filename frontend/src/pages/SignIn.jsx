import React, { useState } from 'react' 
import SignInForm from '../components/Forms/SignInForm'
import LoginSlideShow from '../components/SlideShows/LoginSlideShow'

function SignIn() {
 

  return (
   <div className='flex h-screen'>
    <div className='w-1/2 h-full'>
    <LoginSlideShow/>
   </div>
   <div className='w-1/2  bg-gray-50 p-4  shadow  h-full'>
    <SignInForm/>
   </div>
   </div>
  )
}

export default SignIn
