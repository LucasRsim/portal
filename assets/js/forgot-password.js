document.getElementById('forgot-password-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    try {
        const response = await fetch('https://portal-x09e.onrender.com/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            alert('E-mail de redefinição enviado com sucesso!');
        } else {
            const error = await response.json();
            alert(`Erro: ${error.message}`);
        }
    } catch (err) {
        console.error('Erro ao conectar ao servidor:', err);
        alert('Erro ao conectar ao servidor. Por favor, tente novamente mais tarde.');
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Gerar token de redefinição de senha
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
        await user.save();

        // Enviar e-mail com o link de redefinição
        const resetLink = `https://portal-x09e.onrender.com/reset-password.html?token=${resetToken}`;
        const msg = {
            to: user.email,
            from: process.env.EMAIL_FROM, // E-mail configurado no SendGrid
            subject: 'Redefinição de Senha',
            text: `Você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:\n\n${resetLink}`,
            html: `<p>Você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
                   <a href="${resetLink}">${resetLink}</a>`,
        };

        await sgMail.send(msg);

        res.status(200).json({ message: 'E-mail de redefinição de senha enviado com sucesso' });
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
});