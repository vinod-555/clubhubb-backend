import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import userModel from './models/userModel.js';
import clubModel from './models/clubModel.js'
import userAuthRoutes from './routes/userAuthRoute.js';
import eventRoutes from "./routes/eventRoute.js"
import clubRoutes from "./routes/clubRoute.js"
 import { requireSignIn} from "./middlewares/userAuthMiddleware.js";
 import {orders,verfiy} from "./controllers/paymentController.js"

//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();
//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use('/api/v1/user-auth',userAuthRoutes);
app.use('/api/v1/event',requireSignIn,eventRoutes)
app.use('/api/v1/club',requireSignIn,clubRoutes)
 


// PAYMENT routes
app.post("/api/v1/orders", orders);

app.post("/api/v1/verify", verfiy);

 
//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan
      .white
  );
});