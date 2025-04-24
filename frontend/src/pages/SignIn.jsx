import React, { useState } from 'react' 
import SignInForm from '../components/Forms/SignInForm'
import LoginSlideShow from '../components/SlideShows/LoginSlideShow'

function SignIn() {
 

  return (
   <div className='flex h-screen'>
    <div className='hidden sm:block w-1/2 h-full'>
    <LoginSlideShow/>
   </div>
   <div className='w-full sm:w-1/2 p-4  shadow  h-full'>
    <SignInForm/>
   </div>
   </div>
  )
}

export default SignIn
