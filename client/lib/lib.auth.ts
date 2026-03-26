
const KEY  = "_token"
const USER = "_user"

type UserData ={
 
    id:string,
    email:string,
    name?: string | null
    currency?:string|"USD"

}

function setToken(token: string){
    localStorage.setItem(KEY, token)
} 

function getToken(){

    return localStorage.getItem(KEY)
}

function deleteToken(){
    localStorage.removeItem(KEY)
}

function setUser(user: UserData){

    localStorage.setItem(USER, JSON.stringify(user))

}

function getUser():UserData | null{

    const data= localStorage.getItem(USER)

    if(!data) return  null
    try{

        return JSON.parse(data)

    }catch{
        return null;
    }

}

function deleteUser(){
    localStorage.removeItem(USER)
}


function clearAuth(){
    deleteToken();
    deleteUser()
}

export const authTokenMethods = {setToken,getToken,deleteToken, setUser, getUser, deleteUser,clearAuth}