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

//   useEffect(() => {
//     apiMethods.api("/api/transactions")
//       .then((d) => console.log("data", d))
//       .catch((e) => console.error("err", e.message));
//   }, []);
}

export default Index