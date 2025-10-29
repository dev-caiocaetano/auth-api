import "dotenv/config";
import express from "express";
import userRoutes from "./src/routes/userRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import { errorHandler } from "./src/middlewares/errorMiddleware.js";
import rateLimit from "express-rate-limit";

// Cria a instância principal da aplicação Express.
const app = express();

// Configura o middleware para requisição JSON.
app.use(express.json());

// Aplica o limitador de taxa apenas se NÃO estiver em ambiente de teste.
if (process.env.NODE_ENV !== "test") {
  // Configura o limitador para rotas de autenticação.
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Janela de 15 minutos.
    max: 5, // Limite de 5 requisições por IP nesta janela.
    message: {
      message: "Diversas tentativas de autenticação a partir deste IP. Por favor, tente novamente mais tarde."
    },
    standardHeaders: true, // Envia cabeçalhos padrão de rate limit.
    legacyHeaders: false, // Desabilita cabeçalhos antigos.
  });
  app.use("/usuarios", authLimiter); // Aplica o limitador ANTES das rotas de usuário.
}

app.use("/usuarios", userRoutes); // Direciona requisições de "/usuarios" para o userRoutes.
app.use("/produtos", productRoutes); // Direciona requisições de "/produtos" para o productRoutes.

app.get("/", (req, res) => {
  res.send("Hello World - API de Autenticação e Catálogo está no ar!");
});

// Captura erros passados por 'next(error)'.
app.use(errorHandler);

// Exporta a instância configurada do app para ser usada pelo server.js.
export default app;
