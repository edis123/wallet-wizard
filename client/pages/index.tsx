import React from 'react'
import { useEffect,useState } from 'react'

function Index() {


  const [message, setMessage] = useState("Loading)(HOLD)...")

  useEffect(()=>{




    fetch("http://localhost:3100/api/home")
    .then((response)=>response.json())
    .then((data)=>{
      setMessage(data.message+" This is a test")
    })
  },[])
  return (
    <div>{message}</div>
  )
}

export default Index