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
                window.location.href = './pages/home.html';
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
                window.location.href = '../../index.html';
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

    if (solicitacaoForm) {
        // Seletores de elementos do formulário
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
        
        // Base de dados simulada com os campos necessários para cada solicitação
        const documentosNecessarios = {
            'Bradesco-Inclusão': [
                { label: 'Nome Completo do Titular', type: 'text', name: 'nome-titular', required: true },
                { label: 'CPF do Titular', type: 'text', name: 'cpf-titular', required: true, mask: 'cpf' },
                { label: 'Altura (cm)', type: 'number', name: 'altura', required: true, placeholder: 'Ex: 175' },
                { label: 'Peso (kg)', type: 'text', name: 'peso', required: true, placeholder: 'Ex: 70,50', mask: 'decimal' },
                { label: 'Telefone', type: 'tel', name: 'telefone', required: true, placeholder: '(11) 98765-4321', mask: 'phone' },
                { label: 'E-mail', type: 'email', name: 'email', required: true, placeholder: 'seuemail@dominio.com' },
                { label: 'Plano', type: 'text', name: 'plano', required: true },
                { label: 'Data de Início', type: 'date', name: 'data-inicio', required: true },
                { label: 'Comprovante de Residência', type: 'file', name: 'comprovante-residencia', required: true, accept: '.pdf' },
                { label: 'CTPS Digital Completa', type: 'file', name: 'ctps-digital', required: true, accept: '.pdf' },
                { label: 'Carta da Empresa (Autorização)', type: 'file', name: 'carta-empresa', required: true, accept: '.pdf' },
                { label: 'RG/CNH com CPF frente e verso', type: 'file', name: 'RG-CNH-CPF', required: true, accept: '.pdf' }
            ],
            'Bradesco-Exclusão': [
                { label: 'Nome do Titular a ser excluído', type: 'text', name: 'nome-excluir', required: true },
                { label: 'CPF do Titular a ser excluído', type: 'text', name: 'cpf-excluir', required: true, mask: 'cpf' },
                { label: 'Carta de Exclusão assinada', type: 'file', name: 'carta-exclusao', required: true, accept: '.pdf,.doc,.docx,image/*' }
            ],
            'Sulamérica-Inclusão': [
                { label: 'Nome Completo do Titular', type: 'text', name: 'nome-titular', required: true },
                { label: 'CPF do Titular', type: 'text', name: 'cpf-titular', required: true, mask: 'cpf' },
                { label: 'Proposta de Adesão', type: 'file', name: 'proposta', required: true, accept: '.pdf' },
                { label: 'Declaração de Saúde', type: 'file', name: 'declaracao-saude', required: true, accept: '.pdf' }
            ],
        };

        /**
         * NOVO: Função para aplicar máscaras de formatação em campos de input.
         * @param {HTMLInputElement} inputElement - O campo de input.
         * @param {string} maskType - O tipo de máscara ('cpf', 'phone', 'decimal').
         */
        function applyInputMask(inputElement, maskType) {
            inputElement.addEventListener('input', (e) => {
                let value = e.target.value;
                switch (maskType) {
                    case 'cpf':
                        e.target.value = value.replace(/\D/g, '')
                                             .replace(/(\d{3})(\d)/, '$1.$2')
                                             .replace(/(\d{3})(\d)/, '$1.$2')
                                             .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                                             .substring(0, 14);
                        break;
                    case 'phone':
                        e.target.value = value.replace(/\D/g, '')
                                             .replace(/^(\d{2})(\d)/, '($1) $2')
                                             .replace(/(\d{5})(\d)/, '$1-$2')
                                             .substring(0, 15);
                        break;
                    case 'decimal':
                        // Permite apenas números e uma única vírgula.
                        e.target.value = value.replace(/[^0-9,]/g, '').replace(/(,.*?),/g, '$1');
                        break;
                }
            });
        }

        /**
         * CORRIGIDO: Esta função agora cria os elementos DOM de forma robusta.
         */
        function updateDocumentos() {
            const operadora = operadoraSelect.value;
            const solicitacao = tipoSolicitacaoSelect.value;
            const key = `${operadora}-${solicitacao}`;
            documentosContainer.innerHTML = ''; // Limpa o container

            if (operadora === 'outros' || solicitacao === 'outros') {
                // ... (código para "outros" continua o mesmo)
                return;
            }

            const documentos = documentosNecessarios[key];
            if (documentos) {
                documentos.forEach(doc => {
                    const docItemDiv = document.createElement('div');
                    docItemDiv.className = 'document-item';

                    const label = document.createElement('label');
                    label.htmlFor = doc.name;
                    label.textContent = doc.label + (doc.required ? ' *' : ' (Opcional)');
                    
                    const input = document.createElement('input');
                    input.type = doc.type;
                    input.id = doc.name;
                    input.name = doc.name;
                    if (doc.required) input.required = true;
                    if (doc.placeholder) input.placeholder = doc.placeholder;
                    if (doc.accept) input.accept = doc.accept;

                    // Aplica a máscara se especificada
                    if (doc.mask) {
                        applyInputMask(input, doc.mask);
                    }

                    docItemDiv.appendChild(label);
                    docItemDiv.appendChild(input);
                    documentosContainer.appendChild(docItemDiv);
                });
            } else if (operadora && solicitacao) {
                documentosContainer.innerHTML = '<p>Nenhum documento específico é necessário para esta seleção.</p>';
            } else {
                documentosContainer.innerHTML = '<p>Selecione a operadora e o tipo de solicitação para ver os documentos necessários.</p>';
            }
        }

        // Funções para gerenciar a visibilidade dos campos (sem alterações)
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

        // Event Listeners (sem alterações)
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
            const formData = new FormData(solicitacaoForm);
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
        });

        // Inicialização do formulário (sem alterações)
        atualizarCamposSolicitante();
        checkOutrosOperadora();
        checkOutrosSolicitacao();
        updateDocumentos();
    }
});

