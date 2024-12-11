import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import multer from "multer";

import userRoutes from './routes/userRoutes.js'

// Verbindung zur MongoDB
await mongoose.connect(process.env.MONGODB_DB)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));
const app = express();

// CORS-Einstellungen
app.use(
  cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  })
);
    
// Middleware zur JSON-Parsierung
app.use(express.json());
const upload = multer();
app.use(upload.single('profilePicture')); 

app.use("/api", userRoutes);


// Server starten
app.listen(port, () => console.log(`Server started on port: http://localhost:${port}`));