import React from "react";
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { fetchMethod } from "@/lib/api";
import { authTokenMethods } from "@/lib/lib.auth";



function LoginPage(){

  const router = useRouter()

  const [email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const [name, setName] =useState("");
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function onSubmit( event :React.SubmitEvent) {

    event.preventDefault();

    setError("")
    setBusy(true);
    try{

        const data = await fetchMethod.fetching("/api/auth/login",{


            method: "POST",
            body: JSON.stringify({email,password}),
        });
    
        if(!data.token) throw new Error("Login did not retrun a token")

        authTokenMethods.setToken(data.token)

        router.push("/test")///needs to change to homeage or dshboard


    }catch(err){

        if(err instanceof Error){
            setError(err.message)
        }else{setError("LOGIN FAILED!")}

    }
    finally{
        setBusy(false)
    }
    
  }

return(
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <button
          disabled={busy}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #111",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          {busy ? "Logging in..." : "Login"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
    </div>
  );


}

export default LoginPage