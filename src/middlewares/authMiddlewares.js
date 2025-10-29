import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

export function authenticatedUser(req, res, next) {
  // Pega o valor do cabeçalho
  const authenticatedHeader = req.headers.authorization;

  // Se o cabeçalho não existe, barra a requisição (401 Unauthorized).
  if (!authenticatedHeader) {
    // Usa 'return' para parar a execução aqui.
    return res.status(401).json({ message: "Acesso negado. Token não fornecido." })
  }

  // Pega apenas o Token do dabeçalho
  const token = authenticatedHeader.split(' ')[1];

  try {
    // Verifica a assinatura e a validade (expiração) do token.
    // Usa a chave definida no .env.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Se o token é válido, anexa o ID do usuário (do payload) ao 'req'.
    // Permitindo que os próximos middlewares/controllers saibam quem fez a requisição.
    req.userId = decodedToken._id;

    // Chama o próximo middleware.
    next()
  } catch (error) {
    // Se jwt.verify falhar (token inválido, expirado, etc.), barra a requisição.
    return res.status(401).json({ message: "Token inválido ou expirado" })
  }
}

export async function authenticatedAdmin(req, res, next) {
  try {
    // Busca o usuário completo no banco usando o ID que 'authenticatedUser' forneceu.
    const userAuthorizated = await UserModel.findById(req.userId);

    // Verificandose o usuário existe E tem uma das roles permitidas
    if (userAuthorizated && ["admin", "master"].includes(userAuthorizated.role)) {
      // Se sim, permite que a requisição continue para o controller.
      next();
    } else {
      // Se não (usuário não encontrado ou role incorreto), barra o acesso (403 Forbidden).
      return res.status(403).json({ message: "Acesso negado. Usuário não autorizado." });
    }

  } catch (error) {
    // Captura erros inesperados (ex: falha na conexão com o banco).
    console.error("Erro no middleware authenticatedAdmin:", error);
    // Retorna um erro genérico 500. O errorHandler central poderia tratar isso.
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
