//----------------------------------------------- Create logic for api call-----------------------------------------------

// Import db
const db=require('./db')

// Import jwt token
const jwt=require('jsonwebtoken')

// Register logic
const register=(acno,username,password)=>{
    console.log('Inside register function');

    return db.User.findOne({acno}).then((response)=>{
        console.log(response);

        if(response){
            // if acno is already registered
            return{
                statusCode:401,
                message:"User already registered"
            }
        }else{
            // if acno is not present in mongodb then create a new one
            const newUser=new db.User({
                acno,
                username,
                password,
                balance:2000,
                transaction:[]
            })
            // to store new user in mongodb
            newUser.save()
            // send response to the client
            return{
                statusCode:200,
                message:"User registered successfully"
            }
        }
    })
}


// login logic
const login=(acno,password)=>{
    console.log("inside login function")
    return db.User.findOne({acno,password}).then((result)=>{
        if(result){//acno present in mongodb
            // generation of token
            const token =jwt.sign({ 
                loginAcno:acno
            },'superkey2023')
            return {
                statusCode:200,
                message:"Login Successful",
                currentUser:result.username,
                token,
                currentAcno:acno
            }
        }else{
            return{
            statusCode:401,
            message:"Invalid Data"
            }
        }
    })
}


// get balance logic
const getBalance=(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }else{
            return{
                statusCode:401,
                message:"Invalid Account Number"
            }
        }
    })
}

// Fund transfer
const fundTransfer=(fromAcno,fromAcnoPswd,toAcno,amt)=>{
    // convert amt to number
    let amount=parseInt(amt)
    // check fromAcno in mongodb
    return db.User.findOne({acno:fromAcno, password:fromAcnoPswd}).then((debit)=>{
        if(debit){
            // to check toAcno in mongodb
            return db.User.findOne({acno:toAcno}).then((credit)=>{
                if(credit){
                    if(debit.balance>=amount){
                        debit.balance-=amount
                        // update transaction details in transaction array
                        debit.transaction.push({
                            type:'Debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        // save changes in mongodb
                        debit.save()

                        // update in toAcno in transaction
                        credit.balance+=amount
                        credit.transaction.push({
                            type:'Credit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                        // save changes in mongodb
                        credit.save()
                        // send response back to client
                        return {
                            statusCode:200,
                            message:'Successfully Completed the Transaction'
                        }
                    }else{
                        return{
                            statusCode:401,
                            message:"Insufficient Balance"
                        }
                    }
                }else{
                    return{
                        statusCode:401,
                        message:"Invalid debit number"
                    }
                }
            })
        }else{
            return{
                statusCode:401,
                message:"Invalid debit number"
            }
        }
    })
}

// Get transaction details
const getTransaction=(acno)=>{
    // to check acno in mongodb
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return {
                statusCode:200,
                transaction:result.transaction
            }
        }else{//acno not found in mongodb
            return{
                statusCode:401,
                message:"Invalid transaction number"
            }
        }
    })
}

// Delete user account
const deleteUserAccount=(acno)=>{
    // delete account from mongodb
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:'Your account has been deleted'
        }
    })
}

module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    getTransaction,
    deleteUserAccount
}