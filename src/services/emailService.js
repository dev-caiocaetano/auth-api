import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

export async function sendVerificationEmail(userEmail, token, userName) {
  try {
    const verificationLink = `http://localhost:3000/usuarios/verificar-email?token=${token}`

    const infoEmail = await transporter.sendMail({
      from: `"Code Nexus" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Confirmação de cadastro.",
      html: `
        <h2>Olá, ${userName}! Recebemos seu cadastro em nossa plataforma.</h2>
        <p>Por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
        <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Verificar meu E-mail</a>
        <p>Este link de verificação expira em 1 hora.</p>
        <p>Se você não se cadastrou em nossa plataforma, por favor ignore este e-mail.</p>
      `,
    })
    return infoEmail;
  } catch (error) {
    console.error("Erro ao enviar e-mail de verificação: ", error);
    throw new Error("Não foi possível enviar o e-mail de verificação.");
  };
};
