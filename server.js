import app from "./app.js";
import mongoose from "mongoose";


mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Conectando ao MongoDB.");
    app.listen(3000, () => {
      console.log("Servidor executado na porta 3000...");
      console.log("Acessar: http://localhost:3000");
    });
  })
  .catch(error => console.log("Erro ao tentar conectar ao MongoDB:", error ));

