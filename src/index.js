import mongoose from 'mongoose'
import {DB_NAME} from './constants.js'
import express from 'express'
import connectDB from './db/index.js'
import dotenv from 'dotenv'
connectDB()
dotenv.config({
    path: 'backend\.env'
})






/*
const app=express()
(async ()=>{
    try {
        mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error",()=>{
            console.log("ERR:",error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.port}`)
        })
        
    } catch (error) {
        console.error("ERROR:",error)
        throw err
    }
})()*/