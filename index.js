// Backend for Bank App
// code to create server using express

// 1. Import express
const express=require('express');

// 4. Import cors
const cors=require('cors');

//9 Import logic
const logic=require('./services/logic')

// 11 import jwt token
const jwt=require('jsonwebtoken')

// 2. Create server using express
const server=express();

// 5. Use cors in server app
server.use(cors({
    origin:'http://localhost:4200'
}))

// 6. Parse json data to js in server app
server.use(express.json());

// 3. Setup port for server
server.listen(5000,()=>{
    console.log('server listening to the port 5000');
});

// 7. Resolving client requests (api call)
// server.get('/',(req,res)=>{
    // res.send('Client gets request')
// })

//   ------------------------// Bank app requests

// // Application specific middleware
// const appMiddleware=(req,res,next)=>{
//     console.log('Application specific middleware');
//     next()
// }
// server.use(appMiddleware)

//12 Router specific middleware
const routerMiddleware = (req,res,next)=>{
    console.log('Router specific middleware');
    try{
        const token=req.headers['verify-token'];
        // console.log(token);
        const data=jwt.verify(token,'superkey2023')
        console.log(data); //to get login acno
        req.currentAcno=data.loginAcno
        next()
    } catch{
        res.status(404).json({message:'please login first'})
    }
  
}

//8 Register
server.post('/register',(req,res)=>{
    console.log('Inside the register');
    console.log(req.body);
    logic.register(req.body.acno,req.body.username,req.body.password).then((result)=>{
         // res.send('Register request received')
    res.status(result.statusCode).json(result);//Send to the client
    })
   
})

//9 Login
server.post('/login',(req,res)=>{
    console.log("Inside the login api");
    console.log(req.body);
    logic.login(req.body.acno,req.body.password).then((result)=>{
        res.status(result.statusCode).json(result);
    })
})

//10 Balance enquiry
server.get('/balance/:acno',routerMiddleware,(req,res)=>{
    console.log('Inside the balance enq');
    console.log(req.params);
    logic.getBalance(req.params.acno).then((result)=>{
        res.status(result.statusCode).json(result); //send to client
    })
})

//13 Fund transfer
server.post('/fundtransfer',routerMiddleware,(req,res)=>{
    console.log('Inside the fund transfer api');
    console.log(req.body);
    logic.fundTransfer(req.currentAcno, req.body.password, req.body.toAcno ,req.body.amount).then((result)=>{
        res.status(result.statusCode).json(result); //send to client
    })
})

//14 get transaction
server.get('/transactions',routerMiddleware,(req,res)=>{
    console.log('Inside the transaction api');
    logic.getTransaction(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result); //send to client
  
    })
}) 

//15 delete user account
server.delete('/deleteAccount',routerMiddleware,(req,res)=>{
    console.log('Inside delete function');
    logic.deleteUserAccount(req.currentAcno).then((result)=>{
        res.status(result.statusCode).json(result); //send to client 
    })
})