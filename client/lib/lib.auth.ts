
const KEY  = "_token"

function setToken(token: string){
    localStorage.setItem(KEY, token)
} 

function getToken(){

    return localStorage.getItem(KEY)
}

function deleteToken(){
    localStorage.removeItem(KEY)
}

export const authTokenMethods = {setToken,getToken,deleteToken}