export const baseUrl="http://localhost:5000/api"

export const postRequest = async(url , body )=> {
  const Response =  await fetch(url, {
        method:"POST", 
        headers:{
           "content-type" : "application/json" 
        }, 
        body
    })
    const data = await Response.json()
    if (!Response.ok){
        let message; 
        if (data?.message){
            message= data.message;

        }
        else{
            message=data ;
        }
        return { error:true , message
        } ; 
    } 
    return data ; 
}

export const getRequest = async(url) =>{
    const response=await fetch(url)
    const data = await response.json()
    if(!response.ok){
    let message ="An error occured..."
    if(data?.message) {
    message  =data.message
    }
    return {error: true, message }
}
return data ; 
}