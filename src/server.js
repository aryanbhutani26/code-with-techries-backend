import express from 'express';
import "../config/dbconfig.js";
import cookieParser from "cookie-parser";
import passport from 'passport';
import './auth/googleAuth.js';
import dotenv from 'dotenv';
import session from 'express-session';
import authRoutes from './routes/googleAuthRoutes.js';
import cors from 'cors';

const app = express();

dotenv.config();

app.use(cors({
    origin: "http://localhost:5050",
    credentials: true,
}));





app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended: true}));

app.use('/auth', authRoutes);

app.get("/", (req, res) => res.send("Welcome to Auth App"));
app.get("/profile", (req, res) => {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
    res.json(req.user);
});


export default app;