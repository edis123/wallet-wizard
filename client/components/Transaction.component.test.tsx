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

function TransactionUpdate({categories,onCreated}:Props ){

    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [direction, setDirection] = useState<Direction>("EXPENSE")
    const [date, setDate] = useState(()=>new Date().toISOString().slice(0,10))
    const [categoryId, setCategoryId] = useState("")
    const [clientRequestId,setClientRequestID]=useState("")
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState("")

   //filters category types athe equeals the transaction type
    const filteredCat = useMemo(()=> categories.filter((c)=>c.type===direction),[categories,direction])
   
    async function UpdateTransaction() {
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
        clientRequestId// idempotency!!!!

     }
      // create newTransaction by fetching
     const  newTransaction = await fetchMethod.fetching("/api/transactions",{
        method:"PUT",
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
   }else{ setError("Failed to Update a new Transaction!!!")}
 
    }finally{
        setBusy(false)
    }
 }

    return({})
}

export default TransactionUpdate