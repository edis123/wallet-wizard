import React, { useMemo } from "react";
import { fetchMethod } from "@/lib/api";
 import { useEffect,useState } from "react";
import { moneyMethods } from "@/lib/money";
import { ClientRequest } from "http";
import { redirect } from "next/dist/server/api-utils";

type Direction = "INCOME" | "EXPENSE"
type CategoryType  = "INCOME" | "EXPENSE"

type Category ={id: string, name:string, type: CategoryType}

type Props={categories: Category[],onCreated?:(tr: " ")=>void;}///array type, and a callback

function TransactionForm({categories,onCreated}:Props ){

    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [direction, setDirection] = useState<Direction>("EXPENSE")
    const [date, setDate] = useState(()=>new Date().toISOString().slice(0,10))
    const [categoryId, setCategoryId] = useState("")
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState("")

   //filters category types athe equeals the transaction type
    const filteredCat = useMemo(()=> categories.filter((c)=>c.type===direction),[categories,direction])
   
    async function onSubmit(event:React.SubmitEvent) {

        event.preventDefault()
        setBusy(true)
        setError("")
   try{

   // data for the newTransaction
     const data = {

        amountCents: moneyMethods.convertionToCents(amount),
        direction,
        description,
        date:new Date(date).toISOString(),
        categoryId:categoryId|| null,
        clientRequestId: crypto.randomUUID // idempotency!!!!

     }
      // create newTransaction by fetching
     const  newTransaction = await fetchMethod.fetching("/api/transactions",{
        method:"POST",
        body: JSON.stringify(data)
     });

    
     //Reset
     setAmount("")
     setDescription("")
     setCategoryId("")
     onCreated?.(newTransaction)

  

   }catch(err){

    if(err instanceof Error){
            setError(err.message)
   }else{ setError("Failed to Create a new Transaction!!!")}
 
    }finally{
        setBusy(false)
    }
 }

    return(<form className= "grid grid-flow-col grid-rows-6" onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>

      <div className= "row-span-7"  style={{ display: "grid", gap: 6, borderRadius: 10, border:"5px solid black" }}>
        <label>AMOUNT (USD)</label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 12.50"
          style={{ padding: 2, borderRadius: 10, border: "1px solid #dddd" }}
        />
      </div>

      <div className= "row-span-7 "  style={{ display: "grid", gap: 6 }}>
        <label>Direction</label>
        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as Direction)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        >
          <option value="EXPENSE">EXPENSE</option>
          <option value="INCOME">INCOME</option>
        </select>
      </div>

      <div className= "row-span-7"  style={{ display: "grid", gap: 6 }}>
        <label>Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Trader Joe's"
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
      </div>

      <div className= "row-span-7"  style={{ display: "grid", gap: 6 }}>
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
      </div>

      <div className= "row-span-7"  style={{ display: "grid", gap: 6 }}>
        <label>Category (optional)</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        >
          <option value="">No category</option>
          {filteredCat.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div style={{ fontSize: 12, color: "#666" }}>
          Showing categories with type = {direction}
        </div>
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
        {busy ? "Saving..." : "Create Transaction"}
      </button>

      {error && <div style={{ color: "crimson" }}>{error}</div>}
    </form>)
}

export default TransactionForm