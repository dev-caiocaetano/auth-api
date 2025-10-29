import app from "./app.js";
import mongoose from "mongoose";

// Conecta ao MongoDB usando a string de conexão do .env.
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    // Executado SE a conexão com o banco for bem-sucedida.
    console.log("Conectando ao MongoDB.");

    // Inicia o servidor Express para ouvir requisições na porta 3000.
    // Isso só acontece DEPOIS que o banco está conectado.
    app.listen(3000, () => {
      console.log("Servidor executado na porta 3000...");
      console.log("Acessar: http://localhost:3000"); // URL para acessar a API localmente.
    });
  })
  .catch(error => console.log("Erro ao tentar conectar ao MongoDB:", error ));

