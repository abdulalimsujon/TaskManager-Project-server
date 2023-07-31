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
app.use(express.json())
app.use(helmet())
app.use(express.urlencoded({ extended: false }));


//routes middlewares

readdirSync('./src/routes').map(r => app.use('/api/v1', require(`./src/routes/${r}`)))


mongoose
    .connect('mongodb://127.0.0.1:27017/TaskManager')
    .catch((err) => {
        console.log('mongoose error ', err)
    })





module.exports=app;