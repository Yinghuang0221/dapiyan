import express from 'express'
import morgan from 'morgan'
import router from './routes/router'
import bodyParser from 'body-parser';
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv-defaults'
dotenv.config()


const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))


app.get('/', async(req, res ,next)=> {
    res.send({message: "piyan is working"})
})

mongoose
    .connect(
        process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then((res) => {
        console.log("mongo db connection created")
    })


app.use('/api', router)

app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        status: err.status ||500,
        message: err.message
    })
})


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server is on http://locolhost:${PORT}`))

