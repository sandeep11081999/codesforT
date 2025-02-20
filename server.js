import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import {dbConnection} from "./config/db.js";
import setupSocket from "./sockets/socket.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
dbConnection();

const app = express();
const server = http.createServer(app);
setupSocket(server);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);

// server.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });


const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
