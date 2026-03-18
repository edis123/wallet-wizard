import React from 'react'
import { useEffect,useState } from 'react'
import { useRouter } from "next/router";
function Index() {

  const router = useRouter()
  const [message, setMessage] = useState("Loading)(HOLD)...")

  useEffect(()=>{




    fetch("http://localhost:3100/api/home")
    .then((response)=>response.json())
    .then((data)=>{
      setMessage(data.message+" This is a test")
  
    })
  router.push("/login")
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