const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para permitir requisições de outros domínios
app.use(cors());
app.use(express.json()); // Permite JSON no corpo da requisição

// Rota para envio de e-mail
app.post('/enviar-email', async (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!nome || !email || !mensagem) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Email remetente (do .env)
        pass: process.env.EMAIL_PASS   // Senha do e-mail (do .env)
      }
    });

    const mailOptions = {
      from: email,
      to: 'contatoajudeagegel@gmail.com',
      subject: 'Nova mensagem do formulário de contato',
      text: `Nome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    res.status(500).json({ error: 'Erro ao enviar o e-mail. Tente novamente mais tarde.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
