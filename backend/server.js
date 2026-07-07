const express = require("express");
const app = express();
const port =5000;

app.listen(port,()=>{
    console.log("Server is running on port", port);
});

app.get("/",(req,res) =>{
    res.send("welcome");
});

app.get("/students",(req,res) =>{
    res.json([{
        id:1,
    name:"Aryan"
}])
});