
import React from "react"; 
import { useState , useEffect } from "react";
import { fetchMethod } from "@/lib/api";
import TransactionForm from "@/components/Transaction.component"; 
import CategoryForm from "@/components/Category.component";
import TransactionList from "@/components/Transaction.compnent.list";

function HomePage(){


    const [categories,setCategories] = useState([])
    const [error, setError] = useState("")

    async function loadCategories() {
      setError("")
      
      try{

        const data = await fetchMethod.fetching("/api/categories")
        setCategories(data)


      }catch(err){

        if(err instanceof Error){
            setError(err.message)
        }
        else{

            setError("Something went wrong when loading categories!!!")
        }
      }
    }

    useEffect(()=>{

         (async ()=>{await loadCategories()})();
    },[categories])

    


    return(

<div style={{ display: "grid", gap: 18 }}>
      {/* <h2>Testing Entry</h2>
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Category</h3>
        <CategoryForm onCreated={() => loadCategories()} />
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Transaction</h3>
        <TransactionForm categories={categories} />
      </div> */}
      
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, background:"white"}}>
        <TransactionList categoryList={categories} loadCategories={loadCategories}/>
      </div>
    </div>

    )
}


export default HomePage