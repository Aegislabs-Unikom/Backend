export const respone = (msg: any, data:any)=> {
  return {
    error: false,
    msg,
    data,
  };
}

export const errorRespone = (msg:any)=>{
   return {
    error: true,
    msg,
  };
}