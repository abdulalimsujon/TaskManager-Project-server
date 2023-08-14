const { readdirSync } = require("fs");
const path = require('path')
const express = require('express')
const app = express()


const mongoose = require('mongoose')
require('dotenv').config()

const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')


//middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json({limit:"50mb"}))
app.use(helmet())
app.use(express.urlencoded({ limit: "50mb" }));


//routes middlewares

readdirSync('./src/routes').map(r => app.use('/api/v1', require(`./src/routes/${r}`)))


mongoose
    .connect(process.env.STRING)
    .catch((err) => {
        console.log('mongoose error ', err)
    })





module.exports=app;