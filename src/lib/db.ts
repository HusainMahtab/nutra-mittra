import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}

const connection:ConnectionObject={}

async function dbConnection():Promise<void>{
    if(connection.isConnected){
       console.log("db already connected")
       return
    }
     try {
       const db= await mongoose.connect(String(process.env.MONGO_DB_CONNECTION_URI))
       connection.isConnected=db.connections[0].readyState
       console.log("db connected successfully")
     } catch (error) {
        console.log("db connection faild!",error)
        process.exit(1)
     } 
}

export default dbConnection