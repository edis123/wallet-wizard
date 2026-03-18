
import { authTokenMethods } from "./lib.auth";

const BASE = process.env.NEXT_PUBLIC_API_URL///next reads only NEXT_PUBLIC prefix...

// const BASE = "https://wallet-wizard-backend-ge1c.onrender.com"

//fetching helper method that retruns data after url+ token is added
async function fetching(path:string,options: RequestInit={}) {

    if(!BASE) throw new Error ("Missing PUBLIC_API_URL!")

    const token = authTokenMethods.getToken();

    const res = await fetch(`${BASE}${path}`,{

    ...options,
    headers:{
        "Content-Type":"application/json",
        ...(token?{Authorization:`Bearer ${token}`}:{}),// if token exits add token or nothing
        ...(options.headers||{})
    }
    })

    const data = await res.json().catch(()=>({}))

    if(!res.ok){
        throw new Error(data.error || data.message|| "Request failed!!!")
    }

return data
}

export const fetchMethod = {fetching}