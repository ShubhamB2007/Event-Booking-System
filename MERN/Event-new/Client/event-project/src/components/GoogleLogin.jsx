import React from 'react'
import {useGoogleLogin} from '@react-oauth/google'
import { googleAuth } from '../api'
import { useNavigate } from 'react-router-dom'

const GoogleLogin = () => {

    const navigate = useNavigate()
    const resGoogle = async (authResult)=>{
        try {
          if(authResult['code']){
            const result = await googleAuth(authResult['code'])
            const {email,name} = result.data.user
            const {token} = result.data.token
            localStorage.setItem('userName', name)
            localStorage.setItem('token', token)
            localStorage.setItem('email', email)
            navigate('/')
          }
        } catch (error) {
          console.log(error)
        }
    }
  
    const googleLogin = useGoogleLogin({
      onSuccess: resGoogle,
      onError:resGoogle,
      flow: 'auth-code'
    })          

  return (
    <div className="flex-row flex items-center" onClick={googleLogin}>
     <img src="./google.png" alt="" className="absolute w-6 left-36 mt-3" />
      <button className="btn google border border-neutral-800 rounded-xl font-semibold">
          Google
      </button>
    </div>
  )
}

export default GoogleLogin