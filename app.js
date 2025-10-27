import "dotenv/config";
import express from "express";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import { errorHandler } from "./src/middlewares/errorMiddleware.js";
import rateLimit from "express-rate-limit";

const app = express();

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
      message: "Diversas tentativas de autenticação a partir deste IP. Por favor, tente novamente mais tarde."
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/usuarios", authLimiter);
}

app.use("/usuarios", userRoutes);
app.use("/produtos", productRoutes);

app.get("/", (req, res) => {
  res.send("Hello World - API de Controle de Usuário está no ar!");
});

app.use(errorHandler);

export default app;
