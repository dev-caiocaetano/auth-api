import { validationResult } from "express-validator";
import * as userService from "../services/userService.js";
import UserModel from "../models/User.js";

export async function createUser(req, res, next) {
  try {
    // Verifica se houve erros de validação detectados pelo middleware (express-validator).
    const errors = validationResult(req);

    // Se houver erros, retorna 400 Bad Request com a lista de erros.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    // Delega a lógica de criar usuário, enviar e-mail, etc, para o userService.
    // Passa o corpo da requisição (req.body) para o serviço.
    const registerResult = await userService.registerUser(req.body);

    // Envia a resposta de sucesso (201 Created) com o resultado do serviço.
    return res.status(201).json(registerResult);
  } catch (error) {
    // Se a função lançar um erro (ex: e-mail duplicado), passa o erro para o middleware central de tratamento de erros.
    next(error);
  };
};

export async function verifyEmail(req, res, next) {
  try {
    // Pega o token da query string da URL
    const { token } = req.query;

    // Chama o serviço para validar o token e atualizar o usuário.
    const verifyResult = await userService.verifyUserEmail(token);

    // Decide para onde redirecionar o usuário com base no status retornado pelo serviço.
    // Definir URLs de redirecionamento do frontend para sucesso e falha/já verificado.
    if (verifyResult.status === 'already_verified') {
      // Se já verificado, redireciona para outra página
      return res.redirect('/');
    } else {
      // Se verificado com sucesso agora, redireciona para página de sucesso.
      return res.redirect('/');
    }
  } catch (error) {
    // Passa erros lançados pela função (token inválido/expirado) para o errorHandler.
    next(error);
  };
};

export async function userLogin(req, res, next) {
  try {
    // Verifica erros de validação (e-mail/senha fornecidos e válidos).
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    // Chama a função de login, passando os dados do corpo da requisição.
    //O função fará a checagem de senha, e-mail verificado, etc.
    const loginResult = await userService.loginUser(req.body);

    // Envia a resposta de sucesso (200 OK) com os dados do usuário e o token JWT.
    return res.status(200).json(loginResult);
  } catch (error) {
    // Passa erros da função (credenciais inválidas, e-mail não verificado) para o errorHandler.
    next(error);
  }
};
