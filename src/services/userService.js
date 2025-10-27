import UserModel from "../models/User.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "./emailService.js";
import ApiError from "../utils/ApiError.js";

export async function registerUser(userData) {
  const { name, lastName, email, password, birthDate } = userData;

  const existingUser = await UserModel.findOne({ email: email });
  if (existingUser) {
    throw new ApiError(409, "E-mail já cadastrado.");
  }

  const salt = await bcryptjs.genSalt(10);
  const hash = await bcryptjs.hash(password, salt);

  const cryptoToken = crypto.randomBytes(32).toString("hex");
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 1);

  const newUser = await UserModel.create({
    name,
    lastName,
    email,
    password: hash,
    birthDate,
    emailVerificationToken: cryptoToken,
    emailVerificationTokenExpires: expirationDate
  });

  await sendVerificationEmail(newUser.email, newUser.emailVerificationToken, newUser.name);
  return { message: "Usuário cadastrado com sucesso! Verifique seu e-mail para ativar sua conta." };
};

export async function verifyUserEmail(token) {
  if (!token) {
    throw new Error("Token de verificação não fornecido.");
  };

  const user = await UserModel.findOne({ emailVerificationToken: token });

  if (!user) {
    throw new Error("Token de verificação inválido.");
  };

  if (new Date() > user.emailVerificationTokenExpires) {
    throw new Error("Token de verificação expirado, Por favor, solicite um novo.");
  };

  if (user.emailVerified) {
    return { status: 'already_verified', message: 'Este e-mail já foi verificado.' };
  };

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;

  await user.save();
  return { status: 'verified_now', message: 'E-mail verificado com sucesso!' };
};

export async function loginUser(userData) {
  const { email, password } = userData
  const user = await UserModel.findOne({ email: email });

  if (!user) {
    throw new Error("Usuário ou senha inválidos");
  };

  if (!user.emailVerified) {
    throw new Error("Seu e-mail ainda não foi verificado. Por favor, cheque a caixa de entrada do e-mail cadastrado.")
  };

  const passwordValid = bcryptjs.compareSync(password, user.password);

  if (!passwordValid) {
    throw new Error("Usuário ou senha inválidos");
  };

  const payload = { _id: user._id }
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY,
    { expiresIn: '30d' }
  );

  const userResponse = { name: user.name, email: user.email };
  return {
    message: 'Login efetuado com sucesso!',
    user: userResponse,
    token: token
  };
};
