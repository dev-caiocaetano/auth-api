export function errorHandler(error, req, res, next) {
  // Loga o erro completo no console do servidor para depuração.
  console.error("Erro encontrado: ", error);

  // Usa o statusCode do erro, senão 500.
  const statusCode = error.statusCode || 500;
  // Tenta usar a 'message' do objeto de erro.
  // Se não tiver, usa uma mensagem genérica.
  const message = error.message || "Erro interno do servidor.";

  // Envia a resposta JSON padronizada.
  res.status(statusCode).json({ message: message })
}
