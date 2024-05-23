const axios = require("axios");

const user ={
    ref:"takamdev",
    password:"loic"
}

axios.post('http://localhost:5000/api/sign',user).then(res=>{
    console.log(res.data);
}).catch(erros=>{
    console.log(erros);
})