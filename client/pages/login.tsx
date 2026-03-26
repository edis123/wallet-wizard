import React from "react";
import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import { fetchMethod } from "@/lib/api";
import { authTokenMethods } from "@/lib/lib.auth";
import Title from "@/components/Title.component";
import Register from "@/components/Register.component";



function LoginPage(){

  const router = useRouter()

  const [email, setEmail] = useState("")
  const[password, setPassword] = useState("")
  const [name, setName] =useState("");
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [registerForm, setRegisterForm]= useState(false)

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
        authTokenMethods.setUser(data.user)

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
    <div className="min-h-screen bg-sky-900 flex items-center justify-center sepia-30">
    <div className="w-full max-w-md bg-orange-400 rounded-2xl shadow-2xl p-8 sepia">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-2">
<Title/>
    </h1>
    <p className="text-center text-gray-700 mb-6">
      Track your income and expenses
    </p>


      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoComplete="email"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <input
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />

        <button  
          className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition"
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

        {error && <div style={{ color: "crimson" }}>{error}</div>} <button
            type="button"
            onClick={() => setRegisterForm(true)}
            className="w-full bg-gray-800 text-white rounded-lg p-3 hover:bg-gray-900 transition"
          >
            Create account
          </button>

          {error && <div style={{ color: "crimson" }}>{error}</div>}
        </form>
      </div>

      <Register open={registerForm} onClose={() => setRegisterForm(false)} />
    
    </div>
  );


}

export default LoginPage