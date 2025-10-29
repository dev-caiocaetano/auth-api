// Cria uma classe de erro customizada que herda da classe Error padrão do JavaScript.
// O objetivo é poder "lançar" erros que já carregam o status code HTTP apropriado.
class ApiError extends Error {
  constructor(statusCode, message) {
    // Chama o construtor da classe pai (Error) para definir a mensagem.
    super(message);
    // Adiciona a propriedade customizada "statusCode" ao erro.
    this.statusCode = statusCode;
  };
};

// Exporta a classe para ser usada em outros arquivos (services, controllers).
export default ApiError;
