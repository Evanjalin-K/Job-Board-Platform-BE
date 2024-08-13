const express = require('express');
const userRouter = require('./routes/userRouter');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const morgan = require('morgan');
const jobRouter = require('./routes/jobRouter');
const companyRouter = require('./routes/companyRouter');
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://job-board-platform-backend-hw9v.onrender.com'],
    credentials: true,
}))
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'))

app.use(express.json());

app.use(cookieParser());


app.use('/user', userRouter)
app.use('/job', jobRouter)
app.use('/company', companyRouter)



module.exports= app;