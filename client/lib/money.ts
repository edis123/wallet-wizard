function convertionToCents(amount: string){

  const trimmedAmount = amount.trim();//remove spaces before and after
  

  if(!trimmedAmount) throw new Error("Enter an amount!") 
const cleanedAmount = trimmedAmount.replace(/[$,\s]/g, "") // remove symbols

const numberAmount = Number(cleanedAmount)

if(!Number.isFinite(numberAmount)) throw new Error("Enter a valid Number!")

  
 return Math.round(numberAmount*100)
}

function convertionToDollars(cents:number){

   if(!Number.isFinite(cents)) return "0.00"

   return (cents/100).toFixed(2) // 2 decimals


}

export const moneyMethods = {convertionToCents,convertionToDollars}