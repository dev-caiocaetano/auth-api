import UserModel from "../models/User.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "./emailService.js";
import ApiError from "../utils/ApiError.js";

// Função para registrar um novo usuário.
export async function registerUser(userData) {
  const { name, lastName, email, password, birthDate } = userData;

  // Checa se o e-mail já está em uso.
  const existingUser = await UserModel.findOne({ email: email });
  if (existingUser) {
    throw new ApiError(409, "E-mail já cadastrado."); // Retorna erro 409 (Conflict) se e-mail duplicado.
  };

  // Gera o hash da senha (async). Custo 10 é o padrão.
  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);

  const cryptoToken = crypto.randomBytes(32).toString("hex"); // Gera token seguro para verificação de e-mail.

  // Define a expiração do token (1 hora a partir de agora).
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1);

  // Cria o usuário no banco, incluindo o token de verificação.
  const newUser = await UserModel.create({
    name,
    lastName,
    email,
    password: hash, // Salva o hash, não a senha original.
    birthDate,
    emailVerificationToken: cryptoToken,
    emailVerificationTokenExpires: expirationDate
  });

  // Envio do e-mail de verificação.
  await sendVerificationEmail(newUser.email, newUser.emailVerificationToken, newUser.name);

  // Retorna mensagem de sucesso para o controller.
  return { message: "Usuário cadastrado com sucesso! Verifique seu e-mail para ativar sua conta." };
};

// Função para verificar o e-mail usando o token.
export async function verifyUserEmail(token) {

  // Verifica se o Token foi fornecido.
  if (!token) {
    throw new Error("Token de verificação não fornecido.");
  };

  // Busca o usuário pelo token de verificação.
  const user = await UserModel.findOne({ emailVerificationToken: token });

  // Lança um erro caso o Token seja inválido.
  if (!user) {
    throw new Error("Token de verificação inválido.");
  };

  // Lança um erro caso o Token esteja expirado.
  if (new Date() > user.emailVerificationTokenExpires) {
    throw new Error("Token de verificação expirado, Por favor, solicite um novo.");
  };

  //Retorna status específico se o e-mail já foi verificado.
  if (user.emailVerified) {
    return { status: 'already_verified', message: 'Este e-mail já foi verificado.' };
  };

  // Atualiza o status do usuário e limpa os campos do token.
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;

  await user.save(); // Salva as alterações no banco.

  // Retorna status de sucesso para o controller.
  return { status: 'verified_now', message: 'E-mail verificado com sucesso!' };
};

// Função para autenticar um usuário.
export async function loginUser(userData) {
  const { email, password } = userData

  // Busca o usuário pelo e-mail.
  const user = await UserModel.findOne({ email: email });

  // Lança um erro caso Usuário não encontrado.
  if (!user) {
    throw new Error("Usuário ou senha inválidos");
  };

  // Impede o login em caso de e-mail ainda não verificado.
  if (!user.emailVerified) {
    throw new Error("Seu e-mail ainda não foi verificado. Por favor, cheque a caixa de entrada do e-mail cadastrado.")
  };

  // Compara a senha enviada com o hash salvo (async).
  const passwordValid = await bcryptjs.compare(password, user.password);

  // Lança um erro em caso de Senha inválida.
  if (!passwordValid) {
    throw new Error("Usuário ou senha inválidos");
  };

  // Gera o token JWT apenas com o _id do usuário.
  const payload = { _id: user._id }
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    { expiresIn: '30d' } // Validade de 30 dias.
  );

  // Prepara os dados do usuário para retornar (sem senha!).
  const userResponse = { name: user.name, email: user.email };

  // Retorna os dados do usuário e o token para o controller.
  return {
    message: 'Login efetuado com sucesso!',
    user: userResponse,
    token: token
  };
};
