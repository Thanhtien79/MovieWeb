import React, { useEffect } from 'react'
import { Navigate, Outlet} from 'react-router'
import { NavLink } from 'react-router-dom'
import { history } from '../../index'

import { USER_LOGIN } from '../../util/config'

export default function CheckoutTemplate() {

  useEffect(() => {
    window.scrollTo(0,0);
  })

    if(!localStorage.getItem(USER_LOGIN)){
        return <Navigate to='/user'/>
        //return history.push("/user")
    }

  return (
    <div> 
        <Outlet/> 
    </div>
  )
}
