import express from "express"
import cors from "cors"
import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import categoryRouter from "./routes/category"
import productRouter from "./routes/product"
import reviewRouter from "./routes/review"
import orderRouter from "./routes/order"

const app = express()

app.use(cors())
app.use(express.json())

// Health check
app.get('/', (req, res) => {
    res.json({ success: true, message: "Welcome to server", data: {} })
})

// Routes
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/categories", categoryRouter)
app.use("/api/products", productRouter)
app.use("/api/reviews", reviewRouter)
app.use("/api/orders", orderRouter)

export default app