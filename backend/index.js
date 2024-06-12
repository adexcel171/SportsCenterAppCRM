// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import userdataRoutes from "./routes/userdataRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors({
    origin: 'https://excel-crm.onrender.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable cookies
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Authorization'
  }));
  



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/userdata", userdataRoutes);



app.listen(port, () => console.log(`Server running on port: ${port}`));
