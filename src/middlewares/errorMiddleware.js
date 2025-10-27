export function errorHandler(error, req, res, next) {
  console.error("Erro encontrado: ", error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Erro interno do servidor.";

  res.status(statusCode).json({ message: message })
}
