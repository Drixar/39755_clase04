const express = require("express");
const manager = require('./ProductManager')

const app = express();
const productManager = new manager('./','productos.txt');

app.listen(8080,()=>console.log("server listening on port 8080"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/products/:id", async(req,res, next)=>{
    const {id} = req.params;
    const [status, message, product] = await productManager.getById(parseInt(id));
    switch(status) {
        case '200': 
            res.status(200).send({
                message:message,
                response: product
            });
            return;
        case '404':
            res.status(404).send({
                message:message
            });
            next();
    }
})

app.get("/products", async(req, res, next) => {
    const limit = req.query.limit? +req.query.limit : 0;
    const [status, message, productos] = await productManager.getAll();
    switch(status) {
        case '200': 
            res.status(200).send({
                message:"Listado de Productos",
                response: productos.length > limit && limit > 0 ? productos.slice(0,limit) : productos
            });
            return;
        case '404':
            res.status(404).send({
                message:message
            });
    }
})

app.post("/",async(req,res,next)=>{
    const newProduct = req.body;
    const [status, message, productos] = await productManager.addProduct(newProduct);
    switch(status) {
        case '200': 
            res.status(200).send({
                message:message,
                response: productos
            });
            return
        case '400':
            res.status(400).send({
                message:message
            });

    }
})


// no implementado
// app.put("/:id", async(req,res)=>{
//     const {id} = req.params;
//     const newInfo = req.body;
//     const productosActualizados = await productManager.updateById(parseInt(id),newInfo);
//     res.json({
//         message:`El producto con el id ${id} fue actualizado`,
//         response: productosActualizados
//     })
// })

