
import { useState,useEffect } from "react";
import { fetchMethod } from "@/lib/api";

type CategoryType = "INCOME"|"EXPENSE"

type Props={onCreated?: (cat:" ")=>void} ///callback 

function CategoryForm({onCreated}:Props){


 const [name, setName] = useState("")
 const [type,setType] = useState<CategoryType>("EXPENSE")
 const [busy,setBusy] = useState(false)
 const [error,setError] = useState("")

 async function onSubmit(event: React.SubmitEvent) {
 
     event.preventDefault()
     setBusy(true)
     setError("")

     try{
         
        //create new category by fetching + data
      const newCat = await fetchMethod.fetching("/api/categories",{

      method:"POST",
      body:JSON.stringify({name,type})
      });

      //RESET
      setName("")
      setType("EXPENSE")
      onCreated?.(newCat)// calling the callabck

     }catch(err){

        if(err instanceof Error){
            setError(err.message)
        }else{
            setError("Failed to Create a New Category!!!")
        }

     }
     finally{
        setBusy(false)
     }


 }





return(<form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Groceries"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as CategoryType)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        >
          <option value="EXPENSE">EXPENSE</option>
          <option value="INCOME">INCOME</option>
        </select>
      </div>

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
        {busy ? "Saving..." : "Create Category"}
      </button>

      {error && <div style={{ color: "crimson" }}>{error}</div>}
    </form>)
}

export default CategoryForm