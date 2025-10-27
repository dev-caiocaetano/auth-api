import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

export function authenticatedUser(req, res, next) {
  const authenticatedHeader = req.headers.authorization;

  if (!authenticatedHeader) {
    return res.status(401).json({ message: "Acesso negado. Token não fornecido." })
  }

  const token = authenticatedHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decodedToken._id;
    next()
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" })
  }
}

export async function authenticatedAdmin(req, res, next) {
  try {
    const userAuthorizated = await UserModel.findById(req.userId);

    if (userAuthorizated && ["admin", "master"].includes(userAuthorizated.role)) {
      next();
    } else {
      return res.status(403).json({ message: "Acesso negado. Usuário não autorizado." });
    }

  } catch (error) {
    console.error("Erro no middleware authenticatedAdmin:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
