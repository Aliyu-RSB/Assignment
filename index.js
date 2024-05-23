const express = require('express')
let bodyParser = require('body-parser')
let morgan = require('morgan')
const multer = require("multer")
const upload = multer()
const mongoose = require("mongoose")


mongoose.connect("mongodb://localhost:27017")

let app = express();

const productSchema = mongoose.Schema({
    name: String,
    id: Number,
    note: String
 })


 let Product = mongoose.model("Product", productSchema);


app.use(morgan('combined'))
app.use(upload.array())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'pug');
app.set('views','./host');

app.get('/product', (req, res) => {
     res.render('product')
 })


app.post("/new-Product", async (req, res) => {
    console.log("creating new product");
    let productInfo = req.body
    if (!productInfo.name || !productInfo.id || !productInfo.note) {
        res.render("show_message", {
            message: "Sorry you provided the wrong info", type: "error"})
    } else {
      console.log("going into else")
      let newProduct = new Product({
          name: productInfo.name,
          id: productInfo.id,
          note: productInfo.note
       })
 

      const savedProduct = await newProduct.save().then((resp)=>{
         console.log("saved product: ", {...productInfo});
         res.render("show_message", {message: "New product added", type: "success", product: {...productInfo}})
 
 
       }).catch((error)=> {
          res.render("show_message", {message: "Database Error", type: "error"})
 
       })
      
       
    }
  })

  app.get("/check", (req, res)=>{
    Product.find().then((resp)=>{
       console.log("product:", resp);
       res.json(resp)
    })
  })
 



  app.get('*', function(req, res){
    res.send('404 NOT FOUND');
 });

 




 app.listen("5000", ()=>{
    console.log("starting server")
});