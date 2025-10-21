import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import attdRoutes from "./routes/attdRoutes.js"
import errorHandler from "./middleware/errorHandler.js"
import connectDb from "./config/dbConnection.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import postRoutes from "./routes/postRoutes.js"

dotenv.config()
connectDb();
const app=express()

// Middleware
app.use(cors())
app.use(express.json())

//const PORT = process.env.PORT || 8000

app.use("/api", attdRoutes)
app.use("/api", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/posts", postRoutes)
app.get("/", (req, res) => res.send("Server is working"));
app.use(errorHandler)

const PORT = process.env.PORT || 8000

app.listen(PORT,()=>{
    console.log(`Server running on port:${PORT}`)
})
export default app;