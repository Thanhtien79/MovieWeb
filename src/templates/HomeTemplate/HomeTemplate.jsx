import React, { useEffect } from 'react'
import { Outlet } from 'react-router'
import FooterHome from '../../components/FooterHome/FooterHome'
import HeaderHome from '../../components/HeaderHome/HeaderHome'

export default function HomeTemplate() {

  useEffect(() => {
    window.scrollTo(0,0);
  })
  return (
    <div>
        <HeaderHome/>
        <Outlet/>
        <FooterHome/>
    </div>
  )
}
