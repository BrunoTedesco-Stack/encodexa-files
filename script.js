// ============================
// Variáveis Globais e Referências ao DOM
// ============================

// #region Variáveis Globais e Referências
let cpfValidado = false;
let descontoPercentual = 0;
let codigoDescontoUsado = false;
// Referências ao DOM
const form = document.getElementById('formulario-exame');
const cpfInput = document.getElementById('cpf');
const nomeInput = document.getElementById('nome');
const dataInput = document.getElementById('data');
const emailInput = document.getElementById('email');
const telefoneInput = document.getElementById('telefone');
const cepInput = document.getElementById('cep');
const medicoInput = document.getElementById('medico-search');
const medicoIdInput = document.getElementById('medico-id'); // Campo oculto para o ID do médico
const activationCodeField = document.getElementById('activation-code'); // Campo oculto para o código de ativação

// Lista de campos que serão bloqueados até a validação do CPF
const camposParaBloquear = ['nome', 'data', 'telefone', 'email', 'cep', 'rua', 'bairro', 'cidade', 'uf'];

// URLs e chaves de API (use placeholders para informações sensíveis)
const apiCpfUrl = 'https://gateway.apibrasil.io/api/v2/dados/cpf/credits';
const apiCpfKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcC5hcGlicmFzaWwuaW8vYXV0aC9yZWdpc3RlciIsImlhdCI6MTcyNzQ3MDQ2OSwiZXhwIjoxNzU5MDA2NDY5LCJuYmYiOjE3Mjc0NzA0NjksImp0aSI6IkN2b2tzNGNFeWFxWm5QS0kiLCJzdWIiOiIxMTUyMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.OwrUsq32pOuJjIeOFf_CawQsXJm00bD4dNRoHg64W7o'; // Substitua pela sua chave de API real


// #endregion

// ============================
// Eventos ao Carregar a Página
// ============================

// #region Eventos DOMContentLoaded

document.addEventListener('DOMContentLoaded', function () {
    exibirModalAtivacao(); // Exibe o modal de ativação
    atualizarValorFinal(); // Inicializa o valor final do exame
});

// #endregion

// ============================
// Validação e Formatação de CPF
// ============================

// #region Validação de CPF

// Evento de input para formatar o CPF em tempo real
cpfInput.addEventListener('input', function() {
    formatarCPF(this);
});

// Evento de clique para validar o CPF
document.getElementById('validar-cpf-btn').addEventListener('click', function() {
    const cpf = cpfInput.value.trim();

    if (cpf.length === 14) { // Formato 000.000.000-00
        consultarCreditoCPF(cpf);
    } else {
        exibirModalErro('CPF inválido. Por favor, insira no formato 000.000.000-00.');
    }
});

// Função para formatar o CPF
function formatarCPF(cpfInput) {
    let cpf = cpfInput.value.replace(/\D/g, ''); // Remove não dígitos

    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3}).*/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    cpfInput.value = cpf;
}

// Função para consultar o CPF na API
async function consultarCreditoCPF(cpf) {
    try {
        exibirLoaderModal();

        const response = await fetch(apiCpfUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiCpfKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf: cpf, lite: true })
        });

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const data = await response.json();

        if (data && data.response && data.response.content && data.response.content.nome) {
            cpfValidado = true;

            nomeInput.value = data.response.content.nome.conteudo.nome || '';
            dataInput.value = data.response.content.nome.conteudo.data_nascimento || '';

            nomeInput.setAttribute('disabled', 'true');
            dataInput.setAttribute('disabled', 'true');

            exibirModal("CPF validado com sucesso!");
            setTimeout(() => {
                closeModal();
            }, 2000);
        } else {
            exibirModal("Erro na validação do CPF.");
        }
    } catch (error) {
        console.error('Erro na consulta:', error.message);
        exibirModal("Erro na consulta de crédito do CPF.");
    } finally {
        esconderLoaderModal();
    }
}

// #endregion

// ============================
// Bloqueio de Campos até Validação do CPF
// ============================

// #region Bloqueio de Campos

// Função para bloquear campos até o CPF ser validado
function bloquearCamposSeCpfNaoValidado(event, campo, mensagem) {
    if (!cpfValidado) {
        event.preventDefault();
        exibirModal(mensagem);
        campo.blur();
    }
}

// Adiciona eventos de foco aos campos para bloquear
camposParaBloquear.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (campo) {
        campo.addEventListener('focus', function(e) {
            bloquearCamposSeCpfNaoValidado(e, this, `Por favor, valide o CPF antes de preencher o campo ${campoId}.`);
        });
    }
});

// #endregion

// ============================
// Validação de E-mail e Telefone
// ============================

// #region Validação de E-mail

// Validação do E-mail
emailInput.addEventListener('blur', function() {
    validarEmail();
});

function validarEmail() {
    const email = emailInput.value.trim();

    if (!cpfValidado) {
        exibirModalGeral('Por favor, valide o CPF antes de preencher o e-mail.');
        emailInput.blur();
        cpfInput.focus();
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        exibirModalGeral('Por favor, insira um e-mail válido.');
        emailInput.focus();
        return false;
    }

    return true;
}

// #endregion

// #region Validação de Telefone

// Validação e Formatação do Telefone
telefoneInput.addEventListener('input', function(e) {
    e.target.value = formatarTelefone(e.target.value);
});

telefoneInput.addEventListener('blur', function() {
    validarTelefone();
});

function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');

    if (telefone.length <= 10) {
        telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (telefone.length <= 11) {
        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    return telefone;
}

function validarTelefone() {
    const telefone = telefoneInput.value.trim();

    if (!cpfValidado) {
        exibirModalGeral('Por favor, valide o CPF antes de preencher o telefone.');
        telefoneInput.blur();
        cpfInput.focus();
        return false;
    }

    const telefoneRegex = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/;

    if (!telefoneRegex.test(telefone)) {
        exibirModalGeral('Por favor, insira um telefone válido.');
        telefoneInput.focus();
        return false;
    }

    return true;
}

// #endregion

// ============================
// Validação de CEP e Preenchimento Automático
// ============================

// #region Validação de CEP

// Eventos para o CEP
cepInput.addEventListener('blur', function() {
    validarCep();
});

cepInput.addEventListener('input', function() {
    formatarCepEmTempoReal();
});

function formatarCepEmTempoReal() {
    let cep = cepInput.value.replace(/\D/g, '');

    if (cep.length <= 5) {
        cepInput.value = cep;
    } else {
        cepInput.value = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }

    cepInput.classList.remove('valid', 'input-error');
}

function validarCep() {
    let cep = cepInput.value.trim().replace(/\D/g, '');

    if (!cpfValidado) {
        exibirModalGeral('Por favor, valide o CPF antes de preencher o CEP.');
        cepInput.blur();
        cpfInput.focus();
        return false;
    }

    if (cep.length !== 8) {
        exibirModalGeral('Por favor, insira um CEP válido com 8 dígitos.');
        cepInput.focus();
        cepInput.classList.add('input-error');
        return false;
    }

    cepInput.classList.remove('input-error');
    cepInput.classList.add('valid');

    buscarCep(cep);
    return true;
}

// Função para buscar o CEP na API ViaCEP
async function buscarCep(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            exibirModalGeral('CEP não encontrado.');
            return;
        }

        document.getElementById('rua').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('uf').value = data.uf || '';
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        exibirModalGeral('Erro ao buscar o CEP.');
    }
}

// #endregion

// ============================
// Exibição e Fechamento de Modais
// ============================

// #region Modais

// Funções para exibir e fechar modais
function exibirModal(mensagem) {
    const modal = document.getElementById("modal-validation");
    const modalMessages = document.getElementById("modal-messages");
    const loader = document.getElementById("loader");

    if (modalMessages) {
        modalMessages.innerText = mensagem;
        loader.style.display = 'none';
        modal.style.display = "block";
    }
}

function exibirModalErro(mensagem) {
    exibirModal(mensagem);
}

function closeModal() {
    document.getElementById('modal-validation').style.display = 'none';
}

function exibirLoaderModal() {
    document.getElementById('modal-messages').innerText = '';
    document.getElementById('loader').style.display = 'block';
    document.getElementById('modal-validation').style.display = 'block';
}

function esconderLoaderModal() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('modal-validation').style.display = 'none';
}

function exibirModalGeral(mensagem) {
    const modal = document.getElementById("modal-geral");
    const modalMessages = document.getElementById("modal-geral-messages");

    if (modalMessages) {
        modalMessages.innerText = mensagem;
        modal.style.display = "block";
    } else {
        console.error("Elemento 'modal-geral-messages' não encontrado.");
    }
}

function closeModalGeral(callback) {
    const modal = document.getElementById("modal-geral");
    modal.style.display = "none";

    if (callback) {
        callback();
    }
}

// #endregion

// ============================
// Verificação do Código de Ativação
// ============================

// #region Código de Ativação

//função que deixa ó codigo de ativação indisponivel
function utilizarCodigoAtivacao(codigoAtivacao, exameId) {
    return new Promise((resolve, reject) => {
        const codigoRef = database.ref('codigos_ativacao/disponiveis/' + codigoAtivacao);

        // Verifica se o código está em "disponíveis"
        codigoRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                const medicoId = snapshot.val().medico_id;

                // Move o código para "indisponiveis" e adiciona o ID do exame
                const codigoIndisponivelRef = database.ref('codigos_ativacao/indisponiveis/' + codigoAtivacao);
                codigoIndisponivelRef.set({
                    medico_id: medicoId,
                    exame_id: exameId
                }).then(() => {
                    // Remove o código de "disponíveis"
                    codigoRef.remove();
                    resolve();
                }).catch(reject);
            } else {
                reject('Código de ativação não encontrado em "disponíveis".');
            }
        }).catch(reject);
    });
}


// Exibir modal de ativação ao carregar a página
function exibirModalAtivacao() {
    document.getElementById('modal-activation').style.display = 'block';
    document.getElementById('formulario-container').style.display = 'none';
}

// Evento ao clicar no botão de verificação
document.getElementById('check-activation-btn').addEventListener('click', function () {
    const codigoAtivacao = document.getElementById('activation-code-input').value.trim();

    if (codigoAtivacao === '') {
        document.getElementById('activation-error').style.display = 'block';
        document.getElementById('activation-error').textContent = 'Por favor, insira o código de ativação.';
        return;
    }

    exibirLoaderVerificacao();

    verificarCodigoAtivacao(codigoAtivacao).then((resultado) => {
        if (resultado.status === 'disponivel') {
            database.ref('medicos/' + resultado.medico_id).once('value').then(medicoSnapshot => {
                const medicoData = medicoSnapshot.val();
                const nomeMedico = medicoData.nome;
                const sexoMedico = medicoData.sexo; // Supondo que o campo 'sexo' exista no BD ('masculino' ou 'feminino')
                const crmMedico = medicoData.crm;

                // Formata o nome do médico conforme o sexo
                let prefixo = '';
                if (sexoMedico && sexoMedico.toLowerCase() === 'masculino') {
                    prefixo = 'Dr.';
                } else if (sexoMedico && sexoMedico.toLowerCase() === 'feminino') {
                    prefixo = 'Dra.';
                } else {
                    prefixo = 'Dr./Dra.';
                }

                const nomeCompletoMedico = `${prefixo} ${nomeMedico} - (CRM: ${crmMedico})`;

                selecionarMedico(nomeCompletoMedico, resultado.medico_id);

                document.getElementById('activation-error').textContent = 'Código de ativação verificado com sucesso!';
                
                setTimeout(() => {
                    document.getElementById('modal-activation').style.display = 'none';
                    document.getElementById('formulario-container').style.display = 'block';

                    if (activationCodeField) {
                        activationCodeField.value = codigoAtivacao;
                        activationCodeField.setAttribute('disabled', 'true');
                    }
                }, 2000);
            });
        } else {
            // Tratamento para códigos indisponíveis, inutilizados ou inválidos
            tratarCodigoAtivacaoInvalido(resultado);
        }
    }).catch((error) => {
        console.error('Erro durante a verificação do código de ativação:', error);
        document.getElementById('activation-error').style.display = 'block';
        document.getElementById('activation-error').style.color = 'red';
        document.getElementById('activation-error').textContent = 'Erro ao verificar o código de ativação.';
        reexibirCamposAtivacao();
    });
});

// Função para verificar o código de ativação
function verificarCodigoAtivacao(codigoAtivacao) {
    return new Promise((resolve, reject) => {
        const paths = ['disponiveis', 'indisponiveis', 'inutilizados'];
        const promises = paths.map(path => database.ref(`codigos_ativacao/${path}/${codigoAtivacao}`).once('value'));

        Promise.all(promises).then(results => {
            const [disponivelSnapshot, indisponivelSnapshot, inutilizadoSnapshot] = results;

            if (disponivelSnapshot.exists()) {
                resolve({ status: 'disponivel', medico_id: disponivelSnapshot.val().medico_id });
            } else if (indisponivelSnapshot.exists()) {
                const exameId = indisponivelSnapshot.val().exame_id;
                resolve({ status: 'indisponivel', exame_id: exameId });
            } else if (inutilizadoSnapshot.exists()) {
                resolve({ status: 'inutilizado' });
            } else {
                resolve({ status: 'invalido' });
            }
        }).catch(error => {
            console.error('Erro ao verificar o código de ativação:', error);
            reject(error);
        });
    });
}

// Função para tratar códigos de ativação inválidos
function tratarCodigoAtivacaoInvalido(resultado) {
    let mensagem = '';
    if (resultado.status === 'indisponivel') {
        mensagem = `Este código já foi utilizado no exame de ID ${resultado.exame_id}.`;
    } else if (resultado.status === 'inutilizado') {
        mensagem = 'Este código de ativação foi inutilizado e não pode ser utilizado.';
    } else {
        mensagem = 'Código de ativação inválido ou inexistente.';
    }

    document.getElementById('activation-error').textContent = mensagem;
    document.getElementById('activation-error').style.color = 'red';
    reexibirCamposAtivacao();
}

// Função para reexibir os campos de ativação após falha
function reexibirCamposAtivacao() {
    document.querySelector('p').style.display = 'block';
    document.querySelector('label[for="activation-code-input"]').style.display = 'block';
    document.getElementById('activation-code-input').style.display = 'block';
    document.getElementById('check-activation-btn').style.display = 'block';
    document.getElementById('loader').style.display = 'none';
}

// Função para exibir o loader durante a verificação
function exibirLoaderVerificacao() {
    document.querySelector('p').style.display = 'none';
    document.querySelector('label[for="activation-code-input"]').style.display = 'none';
    document.getElementById('activation-code-input').style.display = 'none';
    document.getElementById('check-activation-btn').style.display = 'none';

    document.getElementById('loader').style.display = 'block';
    document.getElementById('activation-error').style.display = 'block';
    document.getElementById('activation-error').style.color = 'black';
    document.getElementById('activation-error').textContent = 'Verificando código de ativação...';
}

// Função para selecionar o médico (atualizada para refletir as mudanças)
function selecionarMedico(nomeMedico, idMedico) {
    medicoInput.value = nomeMedico;
    medicoIdInput.value = idMedico;
    medicoInput.setAttribute('disabled', 'true');
}

// #endregion

// ============================
// Validação de Cupons de Desconto e Atualização de Preços
// ============================

// #region Cupons de Desconto

// Evento ao alterar o tipo de exame
document.querySelectorAll('input[name="tipo-exame"]').forEach((radio) => {
    radio.addEventListener('change', atualizarValorFinal);
});

// Evento ao clicar no botão de validar cupom
document.getElementById('validar-cupom-btn').addEventListener('click', async () => {
    const codigoDesconto = document.getElementById('codigo-desconto').value.trim();

    if (codigoDesconto) {
        const percentual = await validarCupom(codigoDesconto);
        if (percentual !== null) {
            aplicarDesconto(percentual);
            alert(`Cupom de ${percentual}% aplicado com sucesso!`);
        } else {
            alert('Cupom inválido.');
        }
    } else {
        alert('Por favor, insira um código de desconto.');
    }
});

// Função para validar o cupom
async function validarCupom(codigoDesconto) {
    try {
        const medicosRef = database.ref('medicos');
        const snapshot = await medicosRef.once('value');

        if (snapshot.exists()) {
            const medicosData = snapshot.val();
            for (let medicoId in medicosData) {
                const medico = medicosData[medicoId];
                const descontos = medico.codigo_desconto;

                if (descontos) {
                    for (let chave in descontos) {
                        if (descontos[chave].codigo === codigoDesconto) {
                            return parseFloat(descontos[chave].percentual.replace('%', ''));
                        }
                    }
                }
            }
        }
        throw new Error("Cupom não encontrado");
    } catch (error) {
        console.error('Erro ao validar o cupom:', error);
        return null;
    }
}

// Função para aplicar o desconto
function aplicarDesconto(percentual) {
    const valorExame = parseFloat(document.querySelector('input[name="tipo-exame"]:checked').value);
    const precoComDesconto = valorExame - (valorExame * (percentual / 100));

    document.getElementById('valor-final').textContent = `R$${precoComDesconto.toFixed(2)}`;

    // Armazena o desconto aplicado
    descontoPercentual = percentual;
    codigoDescontoUsado = true;
}

// Função para atualizar o valor final do exame
function atualizarValorFinal() {
    const valorExame = parseFloat(document.querySelector('input[name="tipo-exame"]:checked').value);
    document.getElementById('valor-final').textContent = `R$${valorExame.toFixed(2)}`;

    // Reseta o desconto
    descontoPercentual = 0;
    codigoDescontoUsado = false;
}


// #endregion

// ============================
// Submissão do Formulário
// ============================

// #region Submissão do Formulário

// Evento de submissão do formulário
// Evento de submissão do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!cpfValidado) {
        exibirModalGeral('Por favor, valide o CPF antes de enviar o formulário.');
        return;
    }

    if (!document.getElementById('terms').checked) {
        exibirModalGeral('Você deve aceitar os termos e condições para prosseguir.');
        return;
    }
    const tipoExameSelecionado = document.querySelector('input[name="tipo-exame"]:checked').value;
let tipoExameGravar = '';

if (tipoExameSelecionado === '800') {
    tipoExameGravar = 'C_TESTE_HPV';
} else if (tipoExameSelecionado === '700') {
    tipoExameGravar = 'S_TESTE_HPV';
}


    // Coleta os dados do formulário
    const formData = {
        nome: nomeInput.value,
        cpf: cpfInput.value,
        data: dataInput.value,
        email: emailInput.value,
        telefone: telefoneInput.value,
        cep: cepInput.value,
        rua: document.getElementById('rua').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        uf: document.getElementById('uf').value,
        medico: medicoInput.value,
        medico_id: medicoIdInput.value,
        tipo_exame: tipoExameGravar,
        valor_final: document.getElementById('valor-final').textContent,
        desconto_percentual: descontoPercentual,
        codigo_desconto_usado: codigoDescontoUsado ? 'Sim' : 'Não',
        codigo_desconto: document.getElementById('codigo-desconto').value.trim(),
        terms: document.getElementById('terms').checked ? 'aceito' : 'não aceito',
        activation_code: activationCodeField.value
    };


    // Envia os dados para o Firebase
    const newFormEntry = database.ref('formularios-exames').push();
    newFormEntry.set(formData)
        .then(() => {
            // Após o envio bem-sucedido, atualizar o código de ativação
            utilizarCodigoAtivacao(formData.activation_code, newFormEntry.key)
                .then(() => {
                    alert('Formulário enviado com sucesso!');
                    form.reset(); // Limpa o formulário após o envio
                    // Outras ações após o envio, se necessário
                })
                .catch((error) => {
                    console.error('Erro ao atualizar o código de ativação:', error);
                });
        })
        .catch((error) => {
            console.error('Erro ao enviar os dados:', error);
        });
});

// #endregion

// Seleciona todos os radio buttons do tipo "tipo-exame"
const tipoExameRadios = document.querySelectorAll('input[name="tipo-exame"]');

// Função para verificar se algum radio button está selecionado
function verificarSelecaoTipoExame() {
    // Seleciona a div price-info
   // const priceInfoDiv = document.querySelector('.price-info');
    const descontoInfoDiv = document.querySelector('.secao-descontos');

    // Verifica se algum radio button está selecionado
    const tipoExameSelecionado = document.querySelector('input[name="tipo-exame"]:checked');

    if (tipoExameSelecionado) {
        // Se algum radio button está selecionado, exibe a div
     //   priceInfoDiv.style.display = 'block';
        descontoInfoDiv.style.display = 'block';
    } else {
        // Se nenhum radio button está selecionado, oculta a div
      //  priceInfoDiv.style.display = 'none';
        descontoInfoDiv.style.display = 'none';

    }
}

// Adiciona um event listener a cada radio button
tipoExameRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        verificarSelecaoTipoExame();
        atualizarValorFinal(); // Atualiza o valor final conforme a seleção
    });
});

// Função para atualizar o valor final do exame
function atualizarValorFinal() {
    const tipoExameSelecionado = document.querySelector('input[name="tipo-exame"]:checked');
    const valorFinalElement = document.getElementById('valor-final');

    if (tipoExameSelecionado) {
        const valorExame = parseFloat(tipoExameSelecionado.value);
        valorFinalElement.textContent = `R$${valorExame.toFixed(2)}`;
    } else {
        valorFinalElement.textContent = 'R$0,00';
    }
}

// Chamar a função para verificar a seleção inicial (caso necessário)
verificarSelecaoTipoExame();

// Função para lidar com a seleção dos radio buttons
document.addEventListener('DOMContentLoaded', () => {
    function handleRadioSelection() {
        // Seleciona os radio buttons e as divs correspondentes
        const radio800 = document.querySelector('input[name="tipo-exame"][value="800"]');
        const radio700 = document.querySelector('input[name="tipo-exame"][value="700"]');
        const divRadio800 = document.querySelector('.div-radio-800');
        const divRadio700 = document.querySelector('.div-radio-700');

        // Seleciona a div da seção de descontos usando a classe
        const secaoDescontosDiv = document.querySelector('.secao-descontos');
        console.log('secaoDescontosDiv:', secaoDescontosDiv);

        // Função para adicionar padding inferior dinamicamente
        function addBottomPadding() {
            console.log('addBottomPadding called');
            const formContainer = document.getElementById('formulario-container');
            const viewportHeight = window.innerHeight;
            const rect = secaoDescontosDiv.getBoundingClientRect();
            const secaoDescontosOffsetTop = rect.top + window.pageYOffset;
            const distanceFromBottom = document.body.scrollHeight - secaoDescontosOffsetTop;

            console.log('Viewport Height:', viewportHeight);
            console.log('Secao Descontos Offset Top:', secaoDescontosOffsetTop);
            console.log('Distance From Bottom:', distanceFromBottom);

            if (distanceFromBottom < viewportHeight) {
                const paddingNeeded = viewportHeight - distanceFromBottom;
                console.log('Padding Needed:', paddingNeeded);
                formContainer.style.paddingBottom = paddingNeeded + 'px';
            } else {
                console.log('No padding needed.');
            }
        }

        // Função para atualizar a seleção
        function updateSelection() {
            console.log('updateSelection called');
            if (radio800.checked) {
                divRadio800.classList.add('selected');
                divRadio700.classList.remove('selected');
            } else if (radio700.checked) {
                divRadio700.classList.add('selected');
                divRadio800.classList.remove('selected');
            } else {
                divRadio800.classList.remove('selected');
                divRadio700.classList.remove('selected');
            }

            // Chama as funções existentes para atualizar a interface
            verificarSelecaoTipoExame();
            atualizarValorFinal();

            // Após atualizar a seleção e exibir as divs ocultas, adiciona padding e rola para a seção de descontos
            setTimeout(() => {
                // Adiciona padding inferior se necessário
                addBottomPadding();

                // Rola para a seção de descontos
                if (secaoDescontosDiv) {
                    secaoDescontosDiv.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.error('Elemento com a classe "secao-descontos" não encontrado.');
                }
            }, 100);
        }

        // Adiciona event listeners aos radio buttons
        radio800.addEventListener('change', updateSelection);
        radio700.addEventListener('change', updateSelection);

        // Adiciona event listeners às divs para permitir clique nelas
        divRadio800.addEventListener('click', () => {
            radio800.checked = true;
            updateSelection();
        });

        divRadio700.addEventListener('click', () => {
            radio700.checked = true;
            updateSelection();
        });
    }

    // Chama a função para configurar os event listeners
    handleRadioSelection();
});


document.addEventListener('DOMContentLoaded', () => {
    // Selecionar os elementos
    //const btnComCupom = document.getElementById('com_cupom');
    //const btnSemCupom = document.getElementById('sem_cupom');
   // const btnsCupom = document.querySelector('.btn_sim_nao_cupom');
    const campoDesconto = document.querySelector('.campo-btn-desconto');
    const labelNaoPossuoCupom = document.getElementById('nao-possuo-cupom');
    const secaoDescontosDiv = document.getElementById('secao-descontos');
    const priceInfoDiv = document.querySelector('.price-info');

    // Função para ocultar um elemento
    function hideElement(element) {
        element.style.display = 'none';
    }

    // Função para exibir um elemento
    function showElement(element) {
        element.style.display = 'block';
    }


    // Evento de clique no label "Não possuo um código de desconto"
    labelNaoPossuoCupom.addEventListener('click', () => {
        console.log('Label "Não possuo um código de desconto" clicado');
      
        // Mostrar a seção de descontos
        showElement(secaoDescontosDiv);
        hideElement(campoDesconto);
        showElement(labelNaoPossuoCupom);
        // Exibir a div "price-info"
        showElement(priceInfoDiv);
    });
});
