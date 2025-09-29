/**
 * Este arquivo contém todo o código JavaScript do lado do cliente (frontend).
 * Ele gerencia tanto os formulários de login/registro quanto o formulário de nova solicitação.
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA PARA FORMULÁRIOS DE LOGIN E REGISTRO ---
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
      loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                const data = await response.json();
                alert('Login realizado com sucesso!');
                // Redirecionar para a página principal
                window.location.href = './pages/home.html'; // Caminho ajustado
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message}`);
            }
        } catch (err) {
            console.error('Erro ao fazer login:', err);
            alert('Erro ao conectar com o servidor.');
        }
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                window.location.href = '../../index.html'; // Caminho ajustado
            } else {
                const error = await response.json();
                alert(`Erro: ${error.message}`);
            }
        } catch (err) {
            console.error('Erro ao cadastrar:', err);
            alert('Erro ao conectar com o servidor.');
        }
      });
    }

    // --- LÓGICA PARA O FORMULÁRIO DE NOVA SOLICITAÇÃO ---
    const solicitacaoForm = document.getElementById('solicitacao-form');

    // Só executa o código do formulário se ele existir na página atual
    if (solicitacaoForm) {
        const tipoSolicitanteRadios = document.querySelectorAll('input[name="tipo-solicitante"]');
        const camposEmpresa = document.getElementById('campos-empresa');
        const camposCorretor = document.getElementById('campos-corretor');
        const nomeEmpresaInput = document.getElementById('nome-empresa');
        const cnpjEmpresaInput = document.getElementById('cnpj-empresa');
        const nomeSolicitanteInput = document.getElementById('nome-solicitante');
        const nomeCorretorInput = document.getElementById('nome-corretor');
        const empresaCorretorInput = document.getElementById('empresa-corretor');
        const operadoraSelect = document.getElementById('operadora');
        const tipoSolicitacaoSelect = document.getElementById('tipo-solicitacao');
        const outrosOperadoraContainer = document.getElementById('outros-operadora-container');
        const outrosSolicitacaoContainer = document.getElementById('outros-solicitacao-container');
        const outrosOperadoraInput = document.getElementById('outros-operadora');
        const outrosSolicitacaoTextarea = document.getElementById('outros-solicitacao');
        const documentosContainer = document.getElementById('documentos-container');
        
        const documentosNecessarios = {
            'Bradesco-Inclusão': [
                { label: 'Nome Completo do Titular', type: 'text', name: 'nome-titular', required: true },
                { label: 'CPF do Titular', type: 'text', name: 'cpf-titular', required: true },
                { label: 'RG/CNH com CPF (frente e verso)', type: 'file', name: 'rg-cnh', required: true },
                { label: 'Comprovante de Residência', type: 'file', name: 'comprovante-residencia', required: true },
                { label: 'Ficha de Inclusão preenchida', type: 'file', name: 'ficha-inclusao', required: false }
            ],
            'Bradesco-Exclusão': [
                { label: 'Nome do Titular a ser excluído', type: 'text', name: 'nome-excluir', required: true },
                { label: 'CPF do Titular a ser excluído', type: 'text', name: 'cpf-excluir', required: true },
                { label: 'Carta de Exclusão assinada', type: 'file', name: 'carta-exclusao', required: true }
            ],
             'Sulamérica-Inclusão': [
                { label: 'Nome Completo do Titular', type: 'text', name: 'nome-titular', required: true },
                { label: 'CPF do Titular', type: 'text', name: 'cpf-titular', required: true },
                { label: 'Proposta de Adesão', type: 'file', name: 'proposta', required: true },
                { label: 'Declaração de Saúde', type: 'file', name: 'declaracao-saude', required: true }
            ],
        };

        function atualizarCamposSolicitante() {
            const selecionado = document.querySelector('input[name="tipo-solicitante"]:checked').value;
            if (selecionado === 'empresa') {
                camposEmpresa.classList.remove('hidden');
                camposCorretor.classList.add('hidden');
                nomeEmpresaInput.required = true;
                cnpjEmpresaInput.required = true;
                nomeSolicitanteInput.required = true;
                nomeCorretorInput.required = false;
                empresaCorretorInput.required = false;
            } else {
                camposEmpresa.classList.add('hidden');
                camposCorretor.classList.remove('hidden');
                nomeEmpresaInput.required = false;
                cnpjEmpresaInput.required = false;
                nomeSolicitanteInput.required = false;
                nomeCorretorInput.required = true;
                empresaCorretorInput.required = true;
            }
        }

        function updateDocumentos() {
            const operadora = operadoraSelect.value;
            const solicitacao = tipoSolicitacaoSelect.value;
            const key = `${operadora}-${solicitacao}`;
            documentosContainer.innerHTML = '';

            if (operadora === 'outros' || solicitacao === 'outros') {
                documentosContainer.innerHTML = `
                    <div class="document-item">
                        <p>Por favor, descreva sua solicitação nos campos acima e anexe os documentos que julgar necessários.</p>
                        <label for="arquivos-outros">Anexar Documentos *</label>
                        <input type="file" id="arquivos-outros" name="arquivos-outros[]" multiple required>
                    </div>
                `;
                return;
            }

            const documentos = documentosNecessarios[key];
            if (documentos) {
                documentos.forEach(doc => {
                    const requiredAsterisk = doc.required ? ' *' : ' (Opcional)';
                    const requiredTag = doc.required ? 'required' : '';
                    let fieldHtml = `<div class="document-item"><label for="${doc.name}">${doc.label}${requiredAsterisk}</label>`;
                    if (doc.type === 'text') {
                        fieldHtml += `<input type="text" id="${doc.name}" name="${doc.name}" ${requiredTag}>`;
                    } else if (doc.type === 'file') {
                        fieldHtml += `<input type="file" id="${doc.name}" name="${doc.name}" ${requiredTag}>`;
                    }
                    fieldHtml += `</div>`;
                    documentosContainer.innerHTML += fieldHtml;
                });
            } else if (operadora && solicitacao) {
                documentosContainer.innerHTML = '<p>Nenhum documento específico é necessário para esta seleção.</p>';
            } else {
                documentosContainer.innerHTML = '<p>Selecione a operadora e o tipo de solicitação para ver os documentos necessários.</p>';
            }
        }
        
        function checkOutrosOperadora() {
            if (operadoraSelect.value === 'outros') {
                outrosOperadoraContainer.classList.remove('hidden');
                outrosOperadoraInput.required = true;
            } else {
                outrosOperadoraContainer.classList.add('hidden');
                outrosOperadoraInput.required = false;
            }
        }

        function checkOutrosSolicitacao() {
            if (tipoSolicitacaoSelect.value === 'outros') {
                outrosSolicitacaoContainer.classList.remove('hidden');
                outrosSolicitacaoTextarea.required = true;
            } else {
                outrosSolicitacaoContainer.classList.add('hidden');
                outrosSolicitacaoTextarea.required = false;
            }
        }

        tipoSolicitanteRadios.forEach(radio => radio.addEventListener('change', atualizarCamposSolicitante));
        operadoraSelect.addEventListener('change', () => {
            checkOutrosOperadora();
            updateDocumentos();
        });
        tipoSolicitacaoSelect.addEventListener('change', () => {
            checkOutrosSolicitacao();
            updateDocumentos();
        });
        solicitacaoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Formulário enviado com sucesso! (verifique o console para os dados)');
            // Aqui virá o código para enviar os dados para o seu servidor no Render
            const formData = new FormData(solicitacaoForm);
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
        });

        // Inicialização - Executa as funções uma vez para garantir o estado inicial correto
        atualizarCamposSolicitante();
        checkOutrosOperadora();
        checkOutrosSolicitacao();
        updateDocumentos();
    }
});

