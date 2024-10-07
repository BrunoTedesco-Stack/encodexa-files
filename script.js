// ============================
// Variáveis Globais e Referências ao DOM
// ============================
// Variável global para definir o tipo de faturamento do médico
let FAT_MED = false;
// Verificar se os termos foram aceitos
let termsChecked = false;

// #region Variáveis Globais e Referências
let cpfValidado = false;
let descontoPercentual = 0;
let codigoDescontoUsado = false;

// Referências aos elementos do DOM
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

// URLs e chaves de API (substitua pela sua chave de API real)
const apiCpfUrl = 'https://gateway.apibrasil.io/api/v2/dados/cpf/credits';
const apiCpfKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcC5hcGlicmFzaWwuaW8vYXV0aC9yZWdpc3RlciIsImlhdCI6MTcyNzQ3MDQ2OSwiZXhwIjoxNzU5MDA2NDY5LCJuYmYiOjE3Mjc0NzA0NjksImp0aSI6IkN2b2tzNGNFeWFxWm5QS0kiLCJzdWIiOiIxMTUyMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.OwrUsq32pOuJjIeOFf_CawQsXJm00bD4dNRoHg64W7o'; // Substitua pela sua chave de API real

// Funções globais para mostrar e ocultar elementos
function showElement(element) {
    element.style.display = 'block';
}

function hideElement(element) {
    element.style.display = 'none';
}

// #endregion

// ============================
// Eventos ao Carregar a Página
// ============================

// #region Eventos DOMContentLoaded

document.addEventListener('DOMContentLoaded', function () {
    exibirModalAtivacao(); // Exibe o modal de ativação
    atualizarValorFinal(); // Inicializa o valor final do exame
    handleRadioSelection(); // Configura os event listeners para os radio buttons
    handleRadioSelectionClinica(); 
    verificarSelecaoTipoExame(); // Verifica a seleção inicial dos tipos de exame
});

// #endregion

// ============================
// Validação e Formatação de CPF
// ============================

// #region Validação de CPF
document.getElementById('alterar-cpf').addEventListener('click', function () {
    // Desbloqueia o campo CPF para edição
    const cpfInput = document.getElementById('cpf');
    cpfInput.removeAttribute('disabled');
    cpfInput.value = ''; // Limpa o valor do CPF

    const titulovalidacaocpf = document.getElementById('titulo-validacao');
    titulovalidacaocpf.style.display = 'block';
   
    const botaovalidarcpf = document.getElementById('validar-cpf-btn');
    botaovalidarcpf.style.display = 'block';

    // Oculta a seção de e-mail e telefone
    const divEmailTelefone = document.getElementById('div-email-telefone');
    divEmailTelefone.style.display = 'none';

     // Oculta a seção endereço
     const divendereco = document.getElementById('secao-endereco');
     divendereco.style.display = 'none';

      // Oculta a seção endereço
      const divexame = document.getElementById('secao-exames');
      divexame.style.display = 'none';

      // Oculta o campo nome e data
      const camponome = document.getElementById('div-nome-data');
      camponome.style.display = 'none';
      

      // Oculta o divider
      const divider = document.getElementById('divider-inicio');
      divider.style.display = 'none';
      

      

      // Oculta o campo data
      const linkalterarcpf = document.getElementById('alterar-cpf');
      linkalterarcpf.style.display = 'none';





    // Limpa qualquer mensagem de resultado anterior
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.textContent = '';

    // Opcional: Se você deseja que o campo CPF seja focado novamente
    cpfInput.focus();
});




function alterarAposValidar() {
    //divs e titulos
    const titulovalidacaocpf = document.getElementById('titulo-validacao'); //Titulo Para iniciar vamos valid....
    const titulodivinfopessoal = document.getElementById('titulo-div-dados')//Título Informacoes pessoais
    const divnomeedata = document.getElementById('div-nome-data')//div do nome e data de nasc
    const divemailtelefone = document.getElementById('div-email-telefone')//div do email e telefone
    const botaovalidarcpf = document.getElementById('validar-cpf-btn')//botão validar cpf
    const divendereços = document.getElementById('secao-endereco')//div dos endereços
    const divexames = document.getElementById('secao-exames')//div dos exames
    //campos para desabilitar depois da validação
    const camponome = document.getElementById('nome')//campo nome
    const campocpf = document.getElementById('data')//campo cpf
    const campodata = document.getElementById('cpf')//campo data
    const linkalterarcpf = document.getElementById('alterar-cpf')//campo data
    const dividerinicio = document.getElementById('divider-inicio')//divisor la de dima

    // oculta
    if (titulovalidacaocpf) {
        titulovalidacaocpf.style.display = 'none';
    }
    if (botaovalidarcpf) {
        botaovalidarcpf.style.display = 'none';
    }
    //exibe
    if (titulodivinfopessoal) {
        titulodivinfopessoal.style.display = 'block';
    }
    if (dividerinicio) {
        dividerinicio.style.display = 'block';
    }
    if (divnomeedata) {
        divnomeedata.style.display = 'block';
    }
    if (divemailtelefone) {
        divemailtelefone.style.display = 'block';
    }
    if (linkalterarcpf) {
        linkalterarcpf.style.display = 'block';
    }
    if (divendereços) {
        divendereços.style.display = 'block';
    }
    if (divexames) {
        divexames.style.display = 'block';
    }

    // Desabilita um campo
    if (camponome) {
        camponome.setAttribute('disabled', 'true');
    }
    if (campocpf) {
        campocpf.setAttribute('disabled', 'true');
    }

    if (campodata) {
        campodata.setAttribute('disabled', 'true');
    }


    
}

function alterarAposFatFalse() {
    //divs e titulos
    const titulovalidacaocpf = document.getElementById('titulo-validacao'); //Titulo Para iniciar vamos valid....
    const titulodivinfopessoal = document.getElementById('titulo-div-dados')//Título Informacoes pessoais
    const divnomeedata = document.getElementById('div-nome-data')//div do nome e data de nasc
    const divemailtelefone = document.getElementById('div-email-telefone')//div do email e telefone
    const botaovalidarcpf = document.getElementById('validar-cpf-btn')//botão validar cpf
    const divendereços = document.getElementById('secao-endereco')//div dos endereços
    const btnprosseguir = document.getElementById('prosseguir-endereco')//div dos exames
    const divexamesfatclinica = document.getElementById('escolha-exame-clinica')//div dos exames
    //campos para desabilitar depois da validação
    const camponome = document.getElementById('nome')//campo nome
    const campocpf = document.getElementById('data')//campo cpf
    const campodata = document.getElementById('cpf')//campo data
    const linkalterarcpf = document.getElementById('alterar-cpf')//campo data
    const dividerinicio = document.getElementById('divider-inicio')//divisor la de dima

    // oculta
    if (titulovalidacaocpf) {
        titulovalidacaocpf.style.display = 'none';
    }
    if (botaovalidarcpf) {
        botaovalidarcpf.style.display = 'none';
    }
    //exibe
    if (titulodivinfopessoal) {
        titulodivinfopessoal.style.display = 'block';
    }
    if (dividerinicio) {
        dividerinicio.style.display = 'block';
    }
    if (divnomeedata) {
        divnomeedata.style.display = 'block';
    }
    if (divemailtelefone) {
        divemailtelefone.style.display = 'block';
    }
    if (linkalterarcpf) {
        linkalterarcpf.style.display = 'block';
    }
    if (divendereços) {
        divendereços.style.display = 'block';
    }

    if (btnprosseguir) {
        btnprosseguir.style.display = 'block';
    }
    

    // Desabilita um campo
    if (camponome) {
        camponome.setAttribute('disabled', 'true');
    }
    if (campocpf) {
        campocpf.setAttribute('disabled', 'true');
    }

    if (campodata) {
        campodata.setAttribute('disabled', 'true');
    }


    
}

function alterarAposFatFalseApiOff() {
    //divs e titulos
    const titulovalidacaocpf = document.getElementById('titulo-validacao'); //Titulo Para iniciar vamos valid....
    const titulodivinfopessoal = document.getElementById('titulo-div-dados')//Título Informacoes pessoais
    const divnomeedata = document.getElementById('div-nome-data')//div do nome e data de nasc
    const divemailtelefone = document.getElementById('div-email-telefone')//div do email e telefone
    const botaovalidarcpf = document.getElementById('validar-cpf-btn')//botão validar cpf
    const divendereços = document.getElementById('secao-endereco')//div dos endereços
    const btnprosseguir = document.getElementById('prosseguir-endereco')//div dos exames
    const divexamesfatclinica = document.getElementById('escolha-exame-clinica')//div dos exames
    //campos para desabilitar depois da validação
    const camponome = document.getElementById('nome')//campo nome
    const campocpf = document.getElementById('data')//campo cpf
    const campodata = document.getElementById('cpf')//campo data
    const linkalterarcpf = document.getElementById('alterar-cpf')//campo data
    const dividerinicio = document.getElementById('divider-inicio')//divisor la de dima

    // oculta
    if (titulovalidacaocpf) {
        titulovalidacaocpf.style.display = 'none';
    }
    if (botaovalidarcpf) {
        botaovalidarcpf.style.display = 'none';
    }
    //exibe
    if (titulodivinfopessoal) {
        titulodivinfopessoal.style.display = 'block';
    }
    if (dividerinicio) {
        dividerinicio.style.display = 'block';
    }
    if (divnomeedata) {
        divnomeedata.style.display = 'block';
    }
    if (divemailtelefone) {
        divemailtelefone.style.display = 'block';
    }
    if (linkalterarcpf) {
        linkalterarcpf.style.display = 'block';
    }
    if (divendereços) {
        divendereços.style.display = 'block';
    }

    if (btnprosseguir) {
        btnprosseguir.style.display = 'block';
    }
    
    
}

function alterarAposValidarApiOff() {
    //divs e titulos
    const titulovalidacaocpf = document.getElementById('titulo-validacao'); //Titulo Para iniciar vamos valid....
    const titulodivinfopessoal = document.getElementById('titulo-div-dados')//Título Informacoes pessoais
    const divnomeedata = document.getElementById('div-nome-data')//div do nome e data de nasc
    const divemailtelefone = document.getElementById('div-email-telefone')//div do email e telefone
    const botaovalidarcpf = document.getElementById('validar-cpf-btn')//botão validar cpf
    const divendereços = document.getElementById('secao-endereco')//div dos endereços
    const divexames = document.getElementById('secao-exames')//div dos exames
    //campos para desabilitar depois da validação
    const camponome = document.getElementById('nome')//campo nome
    const campocpf = document.getElementById('data')//campo cpf
    const campodata = document.getElementById('cpf')//campo data
    const linkalterarcpf = document.getElementById('alterar-cpf')//campo data
    const dividerinicio = document.getElementById('divider-inicio')//divisor la de dima

    // oculta
    if (titulovalidacaocpf) {
        titulovalidacaocpf.style.display = 'none';
    }
    if (botaovalidarcpf) {
        botaovalidarcpf.style.display = 'none';
    }
    //exibe
    if (titulodivinfopessoal) {
        titulodivinfopessoal.style.display = 'block';
    }
    if (dividerinicio) {
        dividerinicio.style.display = 'block';
    }
    if (divnomeedata) {
        divnomeedata.style.display = 'block';
    }
    if (divemailtelefone) {
        divemailtelefone.style.display = 'block';
    }
    if (linkalterarcpf) {
        linkalterarcpf.style.display = 'block';
    }
    if (divendereços) {
        divendereços.style.display = 'block';
    }
    if (divexames) {
        divexames.style.display = 'block';
    }

   

    
}

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
        exibirModalErrorApi();
    }
});

// Função para formatar o CPF em tempo real
function formatarCPF(cpfInput) {
    let cpf = cpfInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2}).*/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3}).*/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    cpfInput.value = cpf;
}

// Função para consultar o CPF na API externa
// Função para consultar o crédito do CPF na API externa
// Função para consultar o crédito do CPF na API externa
async function consultarCreditoCPF(cpf) {
    try {
        exibirLoaderModal();

        const response = await fetch(apiCpfUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcC5hcGlicmFzaWwuaW8vYXV0aC9yZWdpc3RlciIsImlhdCI6MTcyNzQ3MDQ2OSwiZXhwIjoxNzU5MDA2NDY5LCJuYmYiOjE3Mjc0NzA0NjksImp0aSI6IkN2b2tzNGNFeWFxWm5QS0kiLCJzdWIiOiIxMTUyMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.OwrUsq32pOuJjIeOFf_CawQsXJm00bD4dNRoHg64W7o',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf: cpf, lite: true })
        });

        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        const data = await response.json();
        console.log('Resposta da API:', data);

        if (data && data.response && data.response.content && data.response.content.nome) {
            cpfValidado = true;

            nomeInput.value = data.response.content.nome.conteudo.nome || '';
            dataInput.value = data.response.content.nome.conteudo.data_nascimento || '';

            nomeInput.setAttribute('disabled', 'true');
            dataInput.setAttribute('disabled', 'true');

            // Salva o saldo no banco de dados, se disponível
            if (data.balance !== undefined) {
                const saldo = data.balance;
               // Salvando o saldo na chave correta
                await database.ref('API_INFORMATION/API_BRASIL/SALDO_API_BRASIL/').set({
                    saldo: saldo,
                    timestamp: new Date().toISOString()
                });
                console.log('Saldo salvo no banco de dados:', saldo);
            }

            // Garante que a variável FAT_MED é corretamente considerada
            if (FAT_MED === false) {
                console.log('FAT_MED é false. Definir o que fazer aqui.');
                // Direciona para outro fluxo ou executa outra lógica quando FAT_MED for false
                alterarAposFatFalse();
                setTimeout(() => {
                    closeModal();
                }, 2000);
                exibirModalSucesso();
                return; // Interrompe o fluxo normal
            }

            alterarAposValidar();
            setTimeout(() => {
                closeModal();
            }, 2000);
            exibirModalSucesso();
        } else {
            exibirModalError();
            cpfValidado = true;
            if (FAT_MED === false) {
                console.log('FAT_MED é false. Definir o que fazer aqui.');
                // Direciona para outro fluxo ou executa outra lógica quando FAT_MED for false
                alterarAposFatFalseApiOff();
                exibirModalError();
                setTimeout(() => {
                }, 2000);

                return; // Interrompe o fluxo normal
            }
            alterarAposValidarApiOff();
        }
    } catch (error) {
        console.error('Erro na consulta:', error.message);
        exibirModalErrorApi();
    } finally {
        //esconderLoaderModal();
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

// Adiciona eventos de foco aos campos que devem ser bloqueados
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

// Evento para validar o e-mail ao perder o foco
emailInput.addEventListener('blur', function() {
    validarEmail();
});

// Função para validar o e-mail
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

// Evento para formatar o telefone em tempo real
telefoneInput.addEventListener('input', function(e) {
    e.target.value = formatarTelefone(e.target.value);
});

// Evento para validar o telefone ao perder o foco
telefoneInput.addEventListener('blur', function() {
    validarTelefone();
});

// Função para formatar o telefone
function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');

    if (telefone.length <= 10) {
        telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (telefone.length <= 11) {
        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    return telefone;
}

// Função para validar o telefone
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

// Evento para validar o CEP ao perder o foco
cepInput.addEventListener('blur', function() {
    validarCep();
});

// Evento para formatar o CEP em tempo real
cepInput.addEventListener('input', function() {
    formatarCepEmTempoReal();
});

// Função para formatar o CEP em tempo real
function formatarCepEmTempoReal() {
    let cep = cepInput.value.replace(/\D/g, '');

    if (cep.length <= 5) {
        cepInput.value = cep;
    } else {
        cepInput.value = cep.substring(0, 5) + '-' + cep.substring(5, 8);
    }

    cepInput.classList.remove('valid', 'input-error');
}

// Função para validar o CEP
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

// Função para exibir o modal
function exibirModalCep() {
    const modal = document.getElementById('modal-validacao-cep');
    modal.style.display = 'block';  // Mostra o modal
    document.getElementById('loader-valida-cep').style.display = 'block';

}

// Função para fechar o modal
function fecharModalCep() {
    const modal = document.getElementById('modal-validacao-cep');
    modal.style.display = 'none';  // Esconde o modal
}

// Função para buscar o CEP com exibição de modal
async function buscarCep(cep) {
    // Exibe o modal de carregamento
    exibirModalCep('Validando CEP...');

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            setTimeout(() => {
                // Fecha o modal após um tempo simulado de 2 segundos
                fecharModalCep();
                exibirModalGeral('CEP não encontrado.');
            }, 2000); // 2 segundos de espera
            return;
        }

        // Simula o tempo de carregamento
        setTimeout(() => {
            // Preenche os campos após a validação
            document.getElementById('rua').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('cidade').value = data.localidade || '';
            document.getElementById('uf').value = data.uf || '';

            // Fecha o modal após o preenchimento
            fecharModalCep();
        }, 2000); // 2 segundos de espera

    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        setTimeout(() => {
            fecharModalCep();
            exibirModalGeral('Erro ao buscar o CEP.');
        }, 2000); // 2 segundos de espera
    }
}

// Evento para validar o CEP ao sair do campo
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, ''); // Remove não dígitos
    if (cep.length === 8) {
        buscarCep(cep);  // Chama a função de validação do CEP
    } else {
        exibirModalGeral('Por favor, insira um CEP válido com 8 dígitos.');
    }
});

// #endregion

// ============================
// Exibição e Fechamento de Modais
// ============================

// #region Modais

// Função para exibir o modal de validação

function exibirModalSucesso() {
    document.getElementById('modal-messages').innerText = 'Ótimo seu CPF foi validado com sucesso!';
    document.getElementById('loader-valida').style.display = 'none';
    document.getElementById('modal-validation').style.display = 'block';
    document.getElementById('button-validation').style.display = 'none';
}
function exibirModalError() {
    document.getElementById('modal-messages').innerText = 'Estamos enfrentando um problema na validação automática do CPF, por favor insira as informações manualmente.';
    document.getElementById('loader-valida').style.display = 'none';
    document.getElementById('modal-validation').style.display = 'block';
    document.getElementById('button-validation').style.display = 'block';
    
}
function exibirModalErrorApi() {
    document.getElementById('modal-messages').innerText = 'CPF inválido! Tente novamente.';
    document.getElementById('loader-valida').style.display = 'none';
    document.getElementById('modal-validation').style.display = 'block';
    document.getElementById('button-validation').style.display = 'block';
   
}
function exibirModal(mensagem) {
    const modal = document.getElementById("modal-validation");
    const modalMessages = document.getElementById("modal-messages");
    const loader = document.getElementById("loader-valida");
    document.getElementById('button-validation').style.display = 'none';
    // Verifique se todos os elementos existem
    if (!modal || !modalMessages || !loader) {
        console.error("Um ou mais elementos não foram encontrados: modal, modalMessages, loader");
        return;
    }

    // Se os elementos forem encontrados, exiba o modal
    modalMessages.innerText = mensagem;
    loader.style.display = 'block'; // Exibe o loader
    modal.style.display = "block"; // Exibe o modal
}

// Função para exibir mensagens de erro
function exibirModalErro(mensagem) {
    exibirModal(mensagem);
}


function closeModalPedido() {
    document.getElementById('modal-validation-cupom').style.display = 'none';
}

// Função para fechar o modal de validação
function closeModalCupom() {
    document.getElementById('modal-validation-cupom').style.display = 'none';
}
// Função para fechar o modal de validação
function closeModal() {
    document.getElementById('modal-validation').style.display = 'none';
}

// Função para exibir o loader no modal
function exibirLoaderModal() {
    document.getElementById('modal-messages').innerText = 'Aguarde enquanto validamos o seu CPF';
    document.getElementById('loader-valida').style.display = 'block';
    document.getElementById('modal-validation').style.display = 'block';
    document.getElementById('button-validation').style.display = 'none';
}

// Função para esconder o loader no modal
function esconderLoaderModal() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('modal-validation').style.display = 'none';
}

// Função para exibir o modal geral
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

// Função para fechar o modal geral
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

// Função para tornar o código de ativação indisponível após o uso
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

// Exibe o modal de ativação ao carregar a página
function exibirModalAtivacao() {
    document.getElementById('modal-activation').style.display = 'block';
    document.getElementById('formulario-container').style.display = 'none';
}

// Evento ao clicar no botão de verificação do código de ativação


// Evento ao clicar no botão de verificação do código de ativação
document.getElementById('check-activation-btn').addEventListener('click', async function () {
    const codigoAtivacao = document.getElementById('activation-code-input').value.trim();

    if (codigoAtivacao === '') {
        document.getElementById('activation-error').style.display = 'block';
        document.getElementById('activation-error').textContent = 'Por favor, insira o código de ativação.';
        return;
    }

    exibirLoaderVerificacao();

    try {
        const resultado = await verificarCodigoAtivacao(codigoAtivacao);

        if (resultado.status === 'disponivel') {
            const medicoSnapshot = await database.ref('medicos/' + resultado.medico_id).once('value');
            const medicoData = medicoSnapshot.val();
            const nomeMedico = medicoData.nome;
            const sexoMedico = medicoData.sexo; // 'masculino' ou 'feminino'
            const crmMedico = medicoData.crm;
            const tipoFaturamento = medicoData.tipo_faturamento; // Verifica o tipo de faturamento

            // Define a variável global FAT_MED com base no tipo de faturamento
            if (tipoFaturamento === 'Genoa') {
                FAT_MED = true;
            } else if (tipoFaturamento === 'Clinica') {
                FAT_MED = false;
            }

            // Verificação no console se conseguiu pegar o valor do faturamento
            if (tipoFaturamento) {
                console.log(`Tipo de faturamento obtido: ${tipoFaturamento}`);
            } else {
                console.warn('Tipo de faturamento não encontrado no banco de dados.');
            }

            // Exibir no console o valor de FAT_MED
            console.log(`Valor de FAT_MED: ${FAT_MED}`);

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
        } else {
            // Tratamento para códigos indisponíveis, inutilizados ou inválidos
            tratarCodigoAtivacaoInvalido(resultado);
        }
    } catch (error) {
        console.error('Erro durante a verificação do código de ativação:', error);
        document.getElementById('activation-error').style.display = 'block';
        document.getElementById('activation-error').style.color = 'red';
        document.getElementById('activation-error').textContent = 'Erro ao verificar o código de ativação.';
        reexibirCamposAtivacao();
    }
});
// Função para verificar o código de ativação no banco de dados
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

// Função para exibir o loader durante a verificação do código de ativação
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

// Função para selecionar o médico após verificação do código
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
// Evento ao clicar no botão de validar cupom
document.getElementById('validar-cupom-btn').addEventListener('click', async () => {
    const codigoDesconto = document.getElementById('codigo-desconto').value.trim();
    const priceInfoDiv = document.querySelector('.price-info');
    const produtoEscolhido = document.getElementById('produto-escolhido');
    const valorOriginal = document.getElementById('valor-original');
    const valorAtualizado = document.getElementById('valor-atualizado');
    const valorDesconto = document.getElementById('valor-desconto');
    const percentualDesconto = document.getElementById('percentual-desconto');
    
    // Referência ao modal e ao loader
    const modal = document.getElementById('modal-validation-cupom');
    const modalMessages = document.getElementById('modal-messages-cupom');
    const loader = document.getElementById('loader-valida-cupom');
    const modalHeader = document.querySelector('.modal-header');
    const button = document.getElementById('button-cupom');
    // Função para exibir o modal
    function showModal() {
        modal.style.display = 'block';
        modalMessages.innerText = 'Validando seu cupom...'; // Define a mensagem de validação
        modalHeader.innerText = 'Validação de Cupom'; // Muda o título do modal
        loader.style.display = 'block'; // Exibe o loader
        button.style.display = 'none';
    }

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
        loader.style.display = 'none'; // Oculta o loader
        modalMessages.innerText = ''; // Limpa a mensagem
    }

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function verificarCamposObrigatorios() {
        const camposObrigatorios = ['nome', 'cpf', 'email', 'telefone', 'cep', 'rua','numero', 'bairro', 'cidade', 'uf'];
        let todosPreenchidos = true;

        camposObrigatorios.forEach((campoId) => {
            const campo = document.getElementById(campoId);
            if (!campo || campo.value.trim() === '') {
                todosPreenchidos = false;
                campo.classList.add('input-error'); // Adiciona borda vermelha nos campos vazios
            } else {
                campo.classList.remove('input-error'); // Remove borda vermelha
            }
        });

        return todosPreenchidos;
    }
    
    // Exibe o modal de carregamento
    showModal();

    // Verifica se o CPF foi validado e se todos os campos obrigatórios estão preenchidos
    if (!cpfValidado || !verificarCamposObrigatorios()) {
        loader.style.display = 'none'; // Oculta o loader
        modalMessages.innerText = 'Por favor, preencha todos os campos obrigatórios e valide o CPF antes de aplicar o cupom.';
        button.style.display = 'block';
        return;
    }

    if (codigoDesconto) {
        try {
            const percentual = await validarCupom(codigoDesconto);

            // Simula 2 segundos de validação
            setTimeout(() => {
                loader.style.display = 'none'; // Oculta o loader após a validação

                if (percentual !== null) {
                    // Atualiza a price-info com os detalhes
                    const tipoExameSelecionado = document.querySelector('input[name="tipo-exame"]:checked').value;
                    const valorOriginalExame = parseFloat(tipoExameSelecionado);
                    const valorComDesconto = valorOriginalExame - (valorOriginalExame * (percentual / 100));

                    // Atualiza a price-info
                    produtoEscolhido.textContent = tipoExameSelecionado === '800' ? 'Exame com pesquisa de HPV inclusa.' : 'Exame sem pesquisa de HPV inclusa.';
                    valorOriginal.textContent = `R$${valorOriginalExame.toFixed(2)}`;
                    percentualDesconto.textContent = `${percentual}%`;
                    valorDesconto.textContent = `R$${(valorOriginalExame * (percentual / 100)).toFixed(2)}`;
                    valorAtualizado.textContent = `R$${valorComDesconto.toFixed(2)}`;
                    preencherResumoPedido();
                    // Exibe a div price-info
                    priceInfoDiv.style.display = 'block';

                    // Mensagem de sucesso no modal
                    modalMessages.innerText = `Cupom de ${percentual}% aplicado com sucesso!`;
                    button.style.display = 'block';
                    // Ancorar para a div de price-info
                    priceInfoDiv.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // Se o cupom não for válido, exibe uma mensagem de erro no modal
                    modalMessages.innerText = 'Cupom inválido.';
                }
            }, 2000); // Simula o tempo de validação de 2 segundos

        } catch (error) {
            console.error('Erro ao validar o cupom:', error);
            modalMessages.innerText = 'Ocorreu um erro ao validar o cupom. Tente novamente.';
        }
    } else {
        loader.style.display = 'none'; // Oculta o loader caso o campo de cupom esteja vazio
        modalMessages.innerText = 'Por favor, insira um código de desconto.';
        button.style.display = 'block';
    }
});

document.getElementById('botao-finalizar-clinica').addEventListener('click', async () => {

    const priceInfoDiv = document.getElementById('finalizacao-clinica');
    const produtoEscolhido = document.getElementById('produto-escolhido-clinica');
    const valorOriginal = document.getElementById('valor-original');
    const valorAtualizado = document.getElementById('valor-atualizado');
    const valorDesconto = document.getElementById('valor-desconto');
    const percentualDesconto = document.getElementById('percentual-desconto');
    
    // Referência ao modal e ao loader
    const modal = document.getElementById('modal-validation-cliente');
    const modalMessages = document.getElementById('modal-messages-cliente');
    const loader = document.getElementById('loader-valida-cliente');
    const modalHeader = document.querySelector('.modal-header');
    const button = document.getElementById('button-cliente');

    // Função para exibir o modal
    function showModal() {
        modal.style.display = 'block';
        modalMessages.innerText = 'Aguarde estamos finalizando o sua solicitação.'; // Define a mensagem de validação
        modalHeader.innerText = 'Finalização de pedido'; // Muda o título do modal
        loader.style.display = 'block'; // Exibe o loader
        button.style.display = 'none';
    }

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
        loader.style.display = 'none'; // Oculta o loader
        modalMessages.innerText = ''; // Limpa a mensagem
    }

    // Função para verificar se todos os campos obrigatórios estão preenchidos
    function verificarCamposObrigatorios() {
        const camposObrigatorios = ['nome', 'data', 'cpf', 'email', 'telefone', 'cep', 'rua','numero', 'bairro', 'cidade', 'uf'];
        let todosPreenchidos = true;

        camposObrigatorios.forEach((campoId) => {
            const campo = document.getElementById(campoId);
            if (!campo || campo.value.trim() === '') {
                todosPreenchidos = false;
                campo.classList.add('input-error'); // Adiciona borda vermelha nos campos vazios
            } else {
                campo.classList.remove('input-error'); // Remove borda vermelha
            }
        });

        return todosPreenchidos;
    }
    
    // Exibe o modal de carregamento
    showModal();

    // Verifica se o CPF foi validado e se todos os campos obrigatórios estão preenchidos
    if (!cpfValidado || !verificarCamposObrigatorios()) {
        loader.style.display = 'none'; // Oculta o loader
        modalMessages.innerText = 'Por favor, preencha todos os campos obrigatórios e valide o CPF antes de aplicar o cupom.';
        button.style.display = 'block';
        return;
    }

    setTimeout(() => {
        loader.style.display = 'none'; // Oculta o loader após a validação

        // Atualiza a price-info com os detalhes
        const tipoExameSelecionado = document.querySelector('input[name="tipo-exame-clinica"]:checked').value;
        const valorOriginalExame = parseFloat(tipoExameSelecionado);
        const percentual = 10; // Supondo que você tenha um percentual de desconto fixo para exemplo
        const valorComDesconto = valorOriginalExame - (valorOriginalExame * (percentual / 100));

        // Atualiza a price-info
        produtoEscolhido.textContent = tipoExameSelecionado === '800' ? 'Exame com pesquisa de HPV inclusa.' : 'Exame sem pesquisa de HPV inclusa.';
        valorOriginal.textContent = `R$${valorOriginalExame.toFixed(2)}`;
        percentualDesconto.textContent = `${percentual}%`;
        valorDesconto.textContent = `R$${(valorOriginalExame * (percentual / 100)).toFixed(2)}`;
        valorAtualizado.textContent = `R$${valorComDesconto.toFixed(2)}`;
        preencherResumoPedidoClinica();

        // Exibe a div price-info
        priceInfoDiv.style.display = 'block';

        // Mensagem de sucesso no modal
        modalMessages.innerText = `Cupom de ${percentual}% aplicado com sucesso!`;

        // Ancorar para a div de price-info
        priceInfoDiv.scrollIntoView({ behavior: 'smooth' });
        closeModal();
    }, 2000); // Simula o tempo de validação de 2 segundos
});



// Função para validar o cupom no banco de dados
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

// Função para aplicar o desconto ao valor final
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
    const tipoExameSelecionado = document.querySelector('input[name="tipo-exame"]:checked');
    const valorFinalElement = document.getElementById('valor-final');

    if (tipoExameSelecionado) {
        const valorExame = parseFloat(tipoExameSelecionado.value);
        valorFinalElement.textContent = `R$${valorExame.toFixed(2)}`;

        // Reseta o desconto
        descontoPercentual = 0;
        codigoDescontoUsado = false;
    } else {
        valorFinalElement.textContent = 'R$0,00';
    }
}

// #endregion

// ============================
// Submissão do Formulário
// ============================

// #region Submissão do Formulário

// Evento de submissão do formulário

form.addEventListener('submit', async (e) => {
    e.preventDefault();

      // Referência ao modal e ao loader
      const modal = document.getElementById('modal-validation-envio');
      const modalMessages = document.getElementById('modal-messages-envio');
      const loader = document.getElementById('loader-valida-envio');
      const modalHeader = document.querySelector('.modal-header');
      const button = document.getElementById('button-envio');
      // Função para exibir o modal
      function showModal() {
          modal.style.display = 'block';
          modalMessages.innerText = 'Por favor não feche a janela do navegador'; // Define a mensagem de validação
          modalHeader.innerText = 'Enviando o formulário'; // Muda o título do modal
          loader.style.display = 'block'; // Exibe o loader
          button.style.display = 'none';
      }

    // Verificar se o CPF foi validado
    if (!cpfValidado) {
        exibirModalGeral('Por favor, valide o CPF antes de enviar o formulário.');
        return;
    }
    let termsChecked;

    if (FAT_MED) {
        termsChecked = document.getElementById('terms_genoa').checked;
        console.log(FAT_MED, 'genoa');
    } else {
        termsChecked = document.getElementById('terms_clinica').checked;
        console.log(FAT_MED, 'cliente');
    }

    // Verificar se os termos foram aceitos
    if (!termsChecked) {
        exibirModalGeral('Você deve aceitar os termos e condições para prosseguir.');
        return;
    }

    let exameselecionado;

    if (FAT_MED) {
        exameselecionado = document.querySelector('input[name="tipo-exame"]:checked').value;
        console.log(FAT_MED, 'genoa');
    } else {
        exameselecionado = document.querySelector('input[name="tipo-exame-clinica"]:checked').value;
        console.log(FAT_MED, 'cliente');
    }

    const tipoExameSelecionado = exameselecionado;
    let tipoExameGravar = '';

    if (tipoExameSelecionado === '800') {
        console.log(tipoExameSelecionado);
        tipoExameGravar = 'C_TESTE_HPV';
    } else if (tipoExameSelecionado === '700') {
        tipoExameGravar = 'S_TESTE_HPV';
        console.log(tipoExameSelecionado);
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
        terms: termsChecked ? 'aceito' : 'não aceito',  // Atribui 'aceito' se termsChecked for true, ou 'não aceito' se for false
        activation_code: activationCodeField.value,
        data_solicitacao: new Date().toLocaleString()  // Adiciona data e hora da solicitação
    };

    try {
        
    //aqui exibe o modal
    showModal();
        // Obter o último ID de registro
        const snapshot = await database.ref('formularios-exames').orderByKey().limitToLast(1).once('value');
        let ultimoId = 1000000; // Valor inicial padrão

        snapshot.forEach((childSnapshot) => {
            const chave = childSnapshot.key;
            const numero = parseInt(chave.replace('EX_ID_', ''), 10);
            if (!isNaN(numero)) {
                ultimoId = numero;
            }
        });

        // Incrementar o ID para o próximo registro
        const novoId = ultimoId + 1;
        const novaChave = `EX_ID_${novoId}`;

        // Salvar os dados no Firebase com a nova chave
        await database.ref(`formularios-exames/${novaChave}`).set(formData);

        // Após o envio bem-sucedido, atualizar o código de ativação
        await utilizarCodigoAtivacao(formData.activation_code, novaChave);

        
        form.reset(); // Limpa o formulário após o envio
        if (FAT_MED) {
            window.location.href = 'finalizado-genoa.html';

        } else {
            window.location.href = 'finalizado-clinica.html';

        }
      

    } catch (error) {
        console.error('Erro ao enviar os dados:', error);
    }
});

// #endregion

// ============================
// Seleção dos Tipos de Exame e Atualização da Interface
// ============================

// #region Seleção de Tipos de Exame

// Preenchendo as informações no resumo
function preencherResumoPedido() {
    document.getElementById('nome-cliente').textContent = document.getElementById('nome').value;
    document.getElementById('cpf-cliente').textContent = document.getElementById('cpf').value;
    document.getElementById('email-cliente').textContent = document.getElementById('email').value;
    document.getElementById('telefone-cliente').textContent = document.getElementById('telefone').value;
    
    // Construindo o endereço completo
    const endereco = `${document.getElementById('rua').value}, 
                      ${document.getElementById('numero').value}, 
                      ${document.getElementById('complemento').value},
                      ${document.getElementById('bairro').value}, 
                      ${document.getElementById('cidade').value} - 
                      ${document.getElementById('uf').value}`;
    document.getElementById('endereco-cliente').textContent = endereco;
    document.getElementById('cep-cliente').textContent = document.getElementById('cep').value;
}

function preencherResumoPedidoClinica() {
    document.getElementById('nome-cliente-clinica').textContent = document.getElementById('nome').value;
    document.getElementById('cpf-cliente-clinica').textContent = document.getElementById('cpf').value;
    document.getElementById('email-cliente-clinica').textContent = document.getElementById('email').value;
    document.getElementById('telefone-cliente-clinica').textContent = document.getElementById('telefone').value;
    
    // Construindo o endereço completo
    const endereco = `${document.getElementById('rua').value}, 
                      ${document.getElementById('numero').value}, 
                      ${document.getElementById('complemento').value},
                      ${document.getElementById('bairro').value}, 
                      ${document.getElementById('cidade').value} - 
                      ${document.getElementById('uf').value}`;
    document.getElementById('endereco-cliente-clinica').textContent = endereco;
    document.getElementById('cep-cliente-clinica').textContent = document.getElementById('cep').value;
}



// Seleciona todos os radio buttons do tipo "tipo-exame"
const tipoExameRadios = document.querySelectorAll('input[name="tipo-exame"]');
const tipoExameRadiosClinica = document.querySelectorAll('input[name="tipo-exame-clinica"]');


// Função para verificar se algum radio button está selecionado
function verificarSelecaoTipoExame() {
    const descontoInfoDiv = document.querySelector('.secao-descontos');

    // Verifica se algum radio button está selecionado
    const tipoExameSelecionado = document.querySelector('input[name="tipo-exame"]:checked');

    if (tipoExameSelecionado) {
        // Se algum radio button está selecionado, exibe a seção de descontos
        showElement(descontoInfoDiv);
    } else {
        // Se nenhum radio button está selecionado, oculta a seção de descontos
        hideElement(descontoInfoDiv);
    }
}

// Adiciona um event listener a cada radio button
tipoExameRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        verificarSelecaoTipoExame();
        atualizarValorFinal(); // Atualiza o valor final conforme a seleção
    });
});

// Adiciona um event listener a cada radio button
tipoExameRadiosClinica.forEach((radio) => {
    radio.addEventListener('change', () => {
        verificarSelecaoTipoExame();
        atualizarValorFinal(); // Atualiza o valor final conforme a seleção
    });
});

// Função para lidar com a seleção dos radio buttons e atualizar a interface
function handleRadioSelection() {
    // Seleciona os radio buttons e as divs correspondentes
    const radio800 = document.querySelector('input[name="tipo-exame"][value="800"]');
    const radio700 = document.querySelector('input[name="tipo-exame"][value="700"]');
    const divRadio800 = document.querySelector('.div-radio-800');
    const divRadio700 = document.querySelector('.div-radio-700');

    // Seleciona a div da seção de descontos
    const secaoDescontosDiv = document.querySelector('.secao-descontos');

    // Função para adicionar padding inferior dinamicamente (se necessário)
    function addBottomPadding() {
        const formContainer = document.getElementById('formulario-container');
        const viewportHeight = window.innerHeight;
        const rect = secaoDescontosDiv.getBoundingClientRect();
        const secaoDescontosOffsetTop = rect.top + window.pageYOffset;
        const distanceFromBottom = document.body.scrollHeight - secaoDescontosOffsetTop;

        if (distanceFromBottom < viewportHeight) {
            const paddingNeeded = viewportHeight - distanceFromBottom;
            formContainer.style.paddingBottom = paddingNeeded + 'px';
        } else {
            formContainer.style.paddingBottom = '0px';
        }
    }

    // Função para atualizar a seleção visual e lógica
    function updateSelection() {
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

        // Atualiza a interface
        verificarSelecaoTipoExame();
        atualizarValorFinal();

        // Após atualizar a seleção, adiciona padding e rola para a seção de descontos
        setTimeout(() => {
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

function handleRadioSelectionClinica() {
    // Seleciona os radio buttons e as divs correspondentes
    const radio800 = document.querySelector('input[name="tipo-exame-clinica"][value="800"]');
    const radio700 = document.querySelector('input[name="tipo-exame-clinica"][value="700"]');
    
    const divRadio800 = document.querySelector('.div-radio-800-clinica');
    const divRadio700 = document.querySelector('.div-radio-700-clinica');

    // Seleciona a div da seção de descontos
    const secaofinalizacaoclinica = document.getElementById('finalizacao-clinica');

    // Função para adicionar padding inferior dinamicamente (se necessário)
    function addBottomPadding() {
        const formContainer = document.getElementById('formulario-container');
        const viewportHeight = window.innerHeight;
        const rect = secaoDescontosDiv.getBoundingClientRect();
        const secaoDescontosOffsetTop = rect.top + window.pageYOffset;
        const distanceFromBottom = document.body.scrollHeight - secaoDescontosOffsetTop;

        if (distanceFromBottom < viewportHeight) {
            const paddingNeeded = viewportHeight - distanceFromBottom;
            formContainer.style.paddingBottom = paddingNeeded + 'px';
        } else {
            formContainer.style.paddingBottom = '0px';
        }
    }

    // Função para atualizar a seleção visual e lógica
    function updateSelection() {
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

        // Atualiza a interface
        verificarSelecaoTipoExame();
        atualizarValorFinal();

        // Após atualizar a seleção, adiciona padding e rola para a seção de descontos
        setTimeout(() => {
            addBottomPadding();

            // Rola para a seção de descontos
            if (secaofinalizacaoclinica) {
                secaofinalizacaoclinica.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.error('Elemento com a classe "finalizacao-clinica" não encontrado.');
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

// #endregion

// ============================
// Exibição da Seção de Descontos e Termos
// ============================

// #region Exibição da Seção de Descontos

// Evento de clique no label "Não possuo um código de desconto"
// Evento ao clicar no link "Não possuo um cupom de desconto"
document.getElementById('nao-possuo-cupom').addEventListener('click', () => {
    const priceInfoDiv = document.querySelector('.price-info');
    const produtoEscolhido = document.getElementById('produto-escolhido');
    const valorOriginal = document.getElementById('valor-original');
    const valorAtualizado = document.getElementById('valor-atualizado');
    const valorDesconto = document.getElementById('valor-desconto');
    const percentualDesconto = document.getElementById('percentual-desconto');
    const secaoDescontosDiv = document.querySelector('.secao-descontos');
    const btnVoltarCupom = document.getElementById('btn-voltar-cupom');

    // Referência ao modal e ao loader
    const modal = document.getElementById('modal-validation-pedido');
    const modalMessages = document.getElementById('modal-messages-pedido');
    const loader = document.getElementById('loader-valida-pedido');
    const modalHeader = document.querySelector('.modal-header');

    // Função para exibir o modal
    function showModal() {
        modal.style.display = 'block';
        modalMessages.innerText = 'Processando pedido...'; // Define a mensagem de validação
        modalHeader.innerText = 'Processamento'; // Muda o título do modal
        loader.style.display = 'block'; // Exibe o loader
    }

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = 'none';
        loader.style.display = 'none'; // Oculta o loader
        modalMessages.innerText = ''; // Limpa a mensagem
    }
// Função para verificar se todos os campos obrigatórios estão preenchidos
//'nome', 'cpf', 'email', 'telefone', 'cep', 'rua', 'bairro', 'cidade', 'uf'
function verificarCamposObrigatorios() {
    const camposObrigatorios = ['nome'];
    let todosPreenchidos = true;

    camposObrigatorios.forEach((campoId) => {
        const campo = document.getElementById(campoId);
        if (!campo || campo.value.trim() === '') {
            todosPreenchidos = false;
            campo.classList.add('input-error'); // Adiciona borda vermelha nos campos vazios
        } else {
            campo.classList.remove('input-error'); // Remove borda vermelha
        }
    });

    return todosPreenchidos;
}
    // Exibe o modal de carregamento
    showModal();
    // Verifica se o CPF foi validado e se todos os campos obrigatórios estão preenchidos
    if (!cpfValidado || !verificarCamposObrigatorios()) {
        loader.style.display = 'none'; // Oculta o loader
        modalMessages.innerText = 'Por favor, preencha todos os campos obrigatórios e valide o CPF antes de prosseguir para a finalização.';
        return;
    }

    // Simula 2 segundos de "validação"
    setTimeout(() => {
        loader.style.display = 'block'; // Oculta o loader após "validação"

        // Atualiza a price-info com os detalhes
        const tipoExameSelecionado = document.querySelector('input[name="tipo-exame"]:checked').value;
        const valorOriginalExame = parseFloat(tipoExameSelecionado);
        const valorComDesconto = valorOriginalExame; // Sem desconto, o valor é o original

        // Atualiza a price-info com campos zerados para desconto
        produtoEscolhido.textContent = tipoExameSelecionado === '800' ? 'Exame com pesquisa de HPV inclusa.' : 'Exame sem pesquisa de HPV inclusa.';
        valorOriginal.textContent = `R$${valorOriginalExame.toFixed(2)}`;
        percentualDesconto.textContent = '0%';
        valorDesconto.textContent = 'R$0.00';
        valorAtualizado.textContent = `R$${valorComDesconto.toFixed(2)}`;
        preencherResumoPedido(); 
        // Exibe a div price-info e oculta a seção de descontos
        priceInfoDiv.style.display = 'block';
        priceInfoDiv.scrollIntoView({ behavior: 'smooth' });
        secaoDescontosDiv.style.display = 'none';

        // Exibe o botão "Voltar Cupom"
        btnVoltarCupom.style.display = 'block';

        // Fecha o modal e exibe mensagem de sucesso
        modalMessages.innerText = 'Nenhum cupom aplicado. Finalizando o pedido...';
        setTimeout(closeModal, 3000); // Fecha o modal após 1 segundo

        // Ancorar para a div de price-info
        priceInfoDiv.scrollIntoView({ behavior: 'smooth' });
    }, 2000); // Simula o tempo de 2 segundos
});

// #endregion





// Seleciona os elementos necessários
const btnVoltarCupom = document.getElementById('btn-voltar-cupom');
const secaoDescontosDiv = document.querySelector('.secao-descontos');
const priceInfoDiv = document.querySelector('.price-info');
const produtoEscolhido = document.getElementById('produto-escolhido');
const valorOriginal = document.getElementById('valor-original');
const valorAtualizado = document.getElementById('valor-atualizado');
const valorDesconto = document.getElementById('valor-desconto');
const percentualDesconto = document.getElementById('percentual-desconto');

// Verifica se o botão existe antes de adicionar o event listener
if (btnVoltarCupom) {
    btnVoltarCupom.addEventListener('click', () => {
        // Exibe a seção de descontos
        secaoDescontosDiv.style.display = 'block';

        // Oculta a div de preços
        priceInfoDiv.style.display = 'none';

        // Limpa os campos da div de preços
        produtoEscolhido.textContent = '';
        valorOriginal.textContent = '';
        valorAtualizado.textContent = '';
        valorDesconto.textContent = '';
        percentualDesconto.textContent = '';

        // Oculta o próprio botão
        btnVoltarCupom.style.display = 'none';
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona as divs principais
    const div800 = document.getElementById('div-800');
    const div700 = document.getElementById('div-700');
    const divRadio800 = document.querySelector('.div-radio-800');
    const divRadio700 = document.querySelector('.div-radio-700');

    // Verifica se os elementos existem
    if (div800 && div700 && divRadio800 && divRadio700) {
        // Função para adicionar padding inferior se necessário
        function addBottomPadding(targetElement) {
            const formContainer = document.getElementById('formulario-container');
            const viewportHeight = window.innerHeight;
            const rect = targetElement.getBoundingClientRect();
            const elementOffsetTop = rect.top + window.pageYOffset;
            const distanceFromBottom = document.body.scrollHeight - elementOffsetTop;

            // Adiciona o padding apenas se não houver espaço suficiente para o scroll até o elemento
            if (distanceFromBottom < viewportHeight) {
                const paddingNeeded = viewportHeight - distanceFromBottom;
                formContainer.style.paddingBottom = `${paddingNeeded + 20}px`; // Inclui um padding extra para garantir a rolagem
            }
        }

        // Função para rolar até o elemento
        function scrollToElement(element) {
            addBottomPadding(element);  // Adiciona padding se necessário
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Evento de clique na div-800
        div800.addEventListener('click', () => {
            scrollToElement(divRadio800);
        });

        // Evento de clique na div-700
        div700.addEventListener('click', () => {
            scrollToElement(divRadio700);
        });
    } else {
        console.error('Divs não encontradas no DOM');
    }
});

document.getElementById('prosseguir-endereco').addEventListener('click', function () {
    // Verifica se todos os campos obrigatórios estão preenchidos
    const camposObrigatorios = document.querySelectorAll(['#nome', '#cpf', '#data', '#email', '#telefone', '#cep', '#rua', '#numero', '#bairro', '#uf', '#cidade']);

    let todosPreenchidos = true;

    camposObrigatorios.forEach(campo => {
        if (!campo.value.trim()) {
            todosPreenchidos = false;
            campo.classList.add('input-error'); // Adiciona uma classe de erro para destacar o campo vazio
        } else {
            campo.classList.remove('input-error');
        }
    });

    if (todosPreenchidos) {
        // Exibe a div escolha-exame-clinica
        const escolhaExameClinicaDiv = document.getElementById('escolha-exame-clinica');
        if (escolhaExameClinicaDiv) {
            escolhaExameClinicaDiv.style.display = 'block';
        }

        // Oculta o botão prosseguir-endereco
        const btnProsseguirEndereco = document.getElementById('prosseguir-endereco');
        if (btnProsseguirEndereco) {
            btnProsseguirEndereco.style.display = 'none';
        }
    } else {
        console.warn('Preencha todos os campos obrigatórios antes de prosseguir.');
        exibirModalGeral('Antes de prosseguir preencha corretamente as informações solicitadas acima.');

    }
});

