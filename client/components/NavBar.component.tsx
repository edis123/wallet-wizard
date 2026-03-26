import React from "react"
import { fetchMethod } from "@/lib/api" 
import { authTokenMethods } from "@/lib/lib.auth"   
import { useState ,useEffect} from "react"
import { useRouter } from "next/router"
function NavBar(){

const router = useRouter()
 
const user = authTokenMethods.getUser()

const usersName = user?.name?.trim() || user?.email|| "USER...."


  function logout(){
    authTokenMethods.clearAuth()
    router.push("/login")
  }
  
return(

    <div className="w-full bg-orange-500 text-white rounder flex justify-between items-center px-6 py-3">
      <div className="text-lg font-semibold">
        {usersName || "Guest"}
      </div>

      <button
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  

)
}
export default NavBar;