const exp =  require('express')
let app = exp()

app.use(exp.static('public'))

app.set('view engine' , "ejs")


 

app.get("/contact" , (req , res)=>{
    res.render("cv")
})

app.get("/home" , (req , res)=>{
    res.render("home")
})

app.listen (5000 , ()=>{
    console.log('server stated at localhost : 5000');
})