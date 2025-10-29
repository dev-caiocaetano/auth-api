import nodemailer from "nodemailer";

// Configura o transporter para usar o Gmail.
// Por segurançam as credenciais vêm do .env.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Servidor SMTP do Gmail.
  port: 465, // Porta segura para SMTP.
  secure: true, // Usa SSL/TLS.
  auth: {
    user: process.env.EMAIL_USER, // E-mail do Gmail.
    pass: process.env.EMAIL_PASS, // Senha de aplicativo do Gmail.
  }
});

export async function sendVerificationEmail(userEmail, token, userName) {
  try {
    // Monta o link que o usuário clicará para verificar.
    // IMPORTANTE: Este link DEVE apontar para uma rota do FRONTEND no futuro.
    // Por agora, aponta para o backend para teste direto.
    const verificationLink = `http://localhost:3000/usuarios/verificar-email?token=${token}`

    // Envia o e-mail usando o 'carteiro' configurado.
    const infoEmail = await transporter.sendMail({
      from: `"Code Nexus" <${process.env.EMAIL_USER}>`, // Remetente
      to: userEmail, // Destinatário.
      subject: "Confirmação de cadastro.", // Assunto do e-mail.
      // Conteúdo HTML do e-mail.
      html: `
        <h2>Olá, ${userName}! Recebemos seu cadastro em nossa plataforma.</h2>
        <p>Por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
        <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 15px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Verificar meu E-mail</a>
        <p>Este link de verificação expira em 1 hora.</p>
        <p>Se você não se cadastrou em nossa plataforma, por favor ignore este e-mail.</p>
      `,
    })
    return infoEmail; // Retorna informações sobre o envio
  } catch (error) {
    // Captura e loga erros no envio (ex: credenciais erradas, falha de conexão).
    console.error("Erro ao enviar e-mail de verificação: ", error);
    // Lança um erro para o serviço/controller que chamou saber que falhou.
    throw new Error("Não foi possível enviar o e-mail de verificação.");
  };
};
