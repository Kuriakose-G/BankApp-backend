// Database connection with node

//1 Import mongoose
const mongoose=require('mongoose')

//2 Define connection string
mongoose.connect('mongodb://localhost:27017/BankServerFeb')

//3 Create model and schema
// model in express is same as mongodb collection
const User=mongoose.model('User',{
    acno:Number,
    username:String,
    password:String,
    balance:Number,
    transaction:[]
})

//4 Export model
module.exports={
    User 
}   