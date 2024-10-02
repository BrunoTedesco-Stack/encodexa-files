// Definição global no início do arquivo
let cpfValidado = false; 
// #region Referências ao formulário e eventos
// Referência ao formulário
const form = document.getElementById('formulario-exame');

// Evento de submissão do formulário
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário

    // Coletando os dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        data: document.getElementById('data').value,
        medico: document.getElementById('medico-search').value,
        terms: document.getElementById('terms').checked
    };

    // Enviar os dados para o Firebase
    const newFormEntry = database.ref('formularios-exames').push();
    newFormEntry.set(formData)
        .then(() => {
            alert('Formulário enviado com sucesso!');
        })
        .catch((error) => {
            console.error('Erro ao enviar os dados:', error);
        });
});


// Função para validar a lógica do CPF (dígitos verificadores)
function validarCPFFormato(cpf) {
    let soma = 0;
    let resto;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Função para consultar CPF na API com formatação

// Função de consulta do CPF via API
async function consultarCreditoCPF(cpf) {
    try {
        exibirLoaderModal(); // Exibe o loader no modal

        // Montando a URL e o corpo da requisição
        const apiUrl = 'https://gateway.apibrasil.io/api/v2/dados/cpf/credits';
        const apiKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcC5hcGlicmFzaWwuaW8vYXV0aC9yZWdpc3RlciIsImlhdCI6MTcyNzQ3MDQ2OSwiZXhwIjoxNzU5MDA2NDY5LCJuYmYiOjE3Mjc0NzA0NjksImp0aSI6IkN2b2tzNGNFeWFxWm5QS0kiLCJzdWIiOiIxMTUyMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.OwrUsq32pOuJjIeOFf_CawQsXJm00bD4dNRoHg64W7o'; // Substitua pelo seu token real
        const body = {
            cpf: cpf,
            lite: true
        };

        // Fazendo a requisição à API com os headers corretos
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // Verificando se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }

        // Convertendo a resposta em JSON
        const data = await response.json();
        console.log('Dados retornados:', data);  // Debug para verificar a resposta

        // Se a resposta contém os dados esperados
        if (data && data.response && data.response.content && data.response.content.nome) {
            cpfValidado = true;  // Atualiza a variável para indicar que o CPF foi validado com sucesso
            
            // Preenche os campos com os dados retornados
            document.getElementById('nome').value = data.response.content.nome.conteudo.nome || '';
            document.getElementById('data').value = data.response.content.nome.conteudo.data_nascimento || '';

            // Desabilita os campos para evitar edição
            document.getElementById('nome').setAttribute('disabled', 'true');
            document.getElementById('data').setAttribute('disabled', 'true');

            // Exibe o modal de sucesso e fecha-o automaticamente
            exibirModal("CPF validado com sucesso!");
            setTimeout(() => {
                closeModal();
            }, 2000);
        } else {
            // Exibe erro se os dados não foram retornados como esperado
            exibirModal("Erro na validação do CPF.");
        }
    } catch (error) {
        // Captura e exibe qualquer erro que ocorrer na requisição
        console.error('Erro na consulta:', error.message);
        exibirModal("Erro na consulta de crédito do CPF.");
    } finally {
        esconderLoaderModal(); // Oculta o loader após a requisição
    }
}




// Função para exibir o resultado
function mostrarResultado(content) {
    if (content && content.nome && content.nome.conteudo) {
        const dados = content.nome.conteudo;
        document.getElementById('nome').value = dados.nome || '';
        
        // Preenche a data diretamente, já que está no formato correto
        document.getElementById('data').value = dados.data_nascimento || '';
    } else {
        document.getElementById('resultado').innerText = 'Dados não disponíveis para o CPF fornecido.';
    }
}


// Função auxiliar para formatar a data de nascimento no formato dd/mm/aaaa
function formatarData(dataAPI) {
    const partesData = dataAPI.split('T')[0].split('-');
    if (partesData.length === 3) {
        const [ano, mes, dia] = partesData;
        return `${dia}/${mes}/${ano}`;
    }
    return '';
}

// Evento de clique no botão para validar o CPF
document.getElementById('validar-cpf-btn').addEventListener('click', function() {
    const cpf = document.getElementById('cpf').value.trim();

    if (cpf.length === 14) { // Valida CPF com 14 caracteres
        consultarCreditoCPF(cpf);  // Chama a função de consulta de CPF
    } else {
        exibirModalErro('CPF inválido. Por favor, insira no formato 000.000.000-00.');
    }
});

// Função para exibir o modal de erro
function exibirModalErro(mensagem) {
    const modalMessages = document.getElementById("modal-messages");
    modalMessages.innerText = mensagem;
    document.getElementById('modal-validation').style.display = 'block';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal-validation').style.display = 'none';
}


function formatarCPF(cpfInput) {
    let cpf = cpfInput.value;

    // Remove qualquer caractere que não seja número
    cpf = cpf.replace(/\D/g, '');

    // Formata o CPF adicionando pontos e hífen conforme o cliente digita
    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    // Atualiza o valor do input
    cpfInput.value = cpf;
}

// Adiciona o evento de input ao campo CPF
document.getElementById('cpf').addEventListener('input', function() {
    formatarCPF(this);
});

// Lista de IDs dos campos que você deseja bloquear até a validação do CPF
const camposParaBloquear = ['nome', 'data', 'telefone'];

// Função para verificar e bloquear os campos até que o CPF seja validado
function bloquearCamposSeCpfNaoValidado(event, campo, mensagem) {
    if (!cpfValidado) { // Apenas exibe o modal se o CPF não foi validado pela API
        event.preventDefault(); // Previne que o campo seja editado
        exibirModal(mensagem);
        campo.blur(); // Remove o foco do campo
    }
}

// Loop para adicionar o evento de foco a todos os campos na lista
camposParaBloquear.forEach(campoId => {
    const campo = document.getElementById(campoId);
    if (campo) { // Verifica se o campo existe no DOM
        campo.addEventListener('focus', function(e) {
            bloquearCamposSeCpfNaoValidado(e, this, `Por favor, valide o CPF antes de preencher o campo ${campoId}.`);
        });
    }
});




document.getElementById('data').addEventListener('focus', function(e) {
    if (!cpfValidado) { // Apenas exibe o modal se o CPF não foi validado pela API
        e.preventDefault(); // Previne que o campo seja editado
        exibirModal("Por favor, valide o CPF antes de preencher a data de nascimento.");
        this.blur(); // Remove o foco do campo
    }
});


document.getElementById('data').addEventListener('focus', function(e) {
    if (!cpfValidado) { // Apenas exibe o modal se o CPF não foi validado pela API
        e.preventDefault(); // Previne que o campo seja editado
        exibirModal("Por favor, valide o CPF antes de preencher o nome.");
        this.blur(); // Remove o foco do campo
    }
});


function exibirModal(mensagem) {
    const modal = document.getElementById("modal-validation");
    const modalMessages = document.getElementById("modal-messages");
    const loader = document.getElementById("loader");

    if (modalMessages) {
        modalMessages.innerText = mensagem;
        loader.style.display = 'none'; // Oculta o loader
        modal.style.display = "block";
    }
}

function exibirModal(mensagem) {
    const modalMessages = document.getElementById('modal-messages');
    modalMessages.innerHTML = mensagem;
    document.getElementById('modal-validation').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal-validation').style.display = 'none';
}

// Função para exibir o modal de validação com o loader
function exibirLoaderModal() {
    document.getElementById('modal-messages').innerText = ''; // Limpa as mensagens anteriores
    document.getElementById('loader').style.display = 'block'; // Exibe o loader
    document.getElementById('modal-validation').style.display = 'block'; // Exibe o modal
}

// Função para ocultar o modal de validação com o loader
function esconderLoaderModal() {
    document.getElementById('loader').style.display = 'none'; // Oculta o loader
    document.getElementById('modal-validation').style.display = 'none'; // Oculta o modal
}

// Função para exibir o modal de verificação geral com uma mensagem personalizada
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

// Função para fechar o modal de verificação geral
function closeModalGeral(callback) {
    const modal = document.getElementById("modal-geral");
    modal.style.display = "none";

    // Se existir um callback, executa após o modal ser fechado
    if (callback) {
        callback();
    }
}


//CAMPO EMAIL
// Função para validar o e-mail
function validarEmail() {
    const emailInput = document.getElementById('email');
    const cpfInput = document.getElementById('cpf');
    const email = emailInput.value.trim();

    // Verifica se o CPF foi validado antes de validar o e-mail
    if (!cpfValidado) {
        exibirModalGeral('Por favor, valide o CPF antes de preencher o e-mail.');
        
        // Remove o foco do campo de e-mail e foca no campo CPF
        setTimeout(() => {
            closeModalGeral(() => { // Função de fechamento do modal com callback para focar no CPF
                cpfInput.focus(); // Define o foco no campo CPF após o modal ser fechado
            });
        }, 2000);
        return false;
    }

    // Expressão regular para verificar o formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        exibirModalGeral('Por favor, insira um e-mail válido.');
        emailInput.focus(); // Mantém o foco no campo de e-mail se o formato for inválido
        return false;
    }

    return true;
}


// Verificação do e-mail ao perder o foco do campo
document.getElementById('email').addEventListener('blur', function() {
    validarEmail();
});



//CAMPO TELEFONE
// Função para autoformatar o telefone conforme o usuário digita
function formatarTelefone(telefone) {
    // Remove tudo que não for número
    telefone = telefone.replace(/\D/g, '');

    // Se for telefone fixo (8 dígitos) ou móvel (9 dígitos)
    if (telefone.length <= 10) {
        // Formato para fixo: (XX) XXXX-XXXX
        telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (telefone.length <= 11) {
        // Formato para móvel: (XX) XXXXX-XXXX
        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    return telefone;
}

// Evento de input para aplicar a formatação automaticamente
document.getElementById('telefone').addEventListener('input', function(e) {
    const telefone = e.target.value;
    e.target.value = formatarTelefone(telefone);
});

// Função para validar o número de telefone
function validarTelefone() {
    const telefoneInput = document.getElementById('telefone');
    const cpfInput = document.getElementById('cpf');
    const telefone = telefoneInput.value.trim();

    // Verifica se o CPF foi validado antes de validar o telefone
    if (!cpfValidado) {
        exibirModalGeral('Por favor, valide o CPF antes de preencher o telefone.');

        // Remove o foco do campo de telefone e foca no campo CPF após o fechamento do modal
        setTimeout(() => {
            closeModalGeral(() => { // Função de fechamento do modal com callback para focar no CPF
                cpfInput.focus(); // Define o foco no campo CPF após o modal ser fechado
            });
        }, 2000);
        return false;
    }

    // Expressão regular para verificar o formato do telefone (aceitando fixo ou móvel)
    const telefoneRegex = /^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$/;

    if (!telefoneRegex.test(telefone)) {
        exibirModalGeral('Por favor, insira um telefone válido.');
        telefoneInput.focus(); // Mantém o foco no campo de telefone se o formato for inválido
        return false;
    }

    return true;
}

// Verificação do telefone ao perder o foco do campo
document.getElementById('telefone').addEventListener('blur', function() {
    validarTelefone();
});

// Função para validar o CEP
// Função para buscar o CEP via API ViaCEP
async function buscarCep(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            exibirModalGeral('CEP não encontrado.');
            return;
        }

        // Preencher os campos com os dados retornados
        document.getElementById('rua').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';

        // Selecionar o estado no campo UF (select)
        const ufSelect = document.getElementById('uf');
        ufSelect.value = data.uf || ''; // Define o valor do UF baseado na resposta da API
    } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        exibirModalGeral('Erro ao buscar o CEP.');
    }
}

// Função para validar o CEP e buscar o endereço automaticamente
function validarCep() {
    const cepInput = document.getElementById('cep');
    let cep = cepInput.value.trim();

    // Verifica se o CPF foi validado antes de validar o CEP
    if (!cpfValidado) {
        exibirModalGeral('Por favor, valide o CPF antes de preencher o CEP.');
        document.getElementById('cpf').focus();
        return false;
    }

    // Remove qualquer caractere que não seja número
    cep = cep.replace(/\D/g, '');

    // Formatação automática do CEP no formato XXXXX-XXX
    if (cep.length > 5) {
        cep = cep.slice(0, 5) + '-' + cep.slice(5, 8);
    }
    cepInput.value = cep; // Atualiza o campo de entrada com a formatação

    // Expressão regular para validar o formato do CEP (XXXXX-XXX)
    const cepRegex = /^[0-9]{5}-[0-9]{3}$/;

    if (!cepRegex.test(cep)) {
        exibirModalGeral('Por favor, insira um CEP válido no formato XXXXX-XXX.');
        cepInput.focus();
        cepInput.classList.remove('valid');
        cepInput.classList.add('input-error'); // Aplica a classe de erro visual
        return false;
    }

    // Caso o CEP esteja correto, removemos a classe de erro e adicionamos a classe de válido
    cepInput.classList.remove('input-error');
    cepInput.classList.add('valid'); // Aplica a classe de sucesso visual

    // Chama a função para buscar o endereço com base no CEP
    buscarCep(cep);

    return true;
}

// Formatação em tempo real do CEP durante a digitação
function formatarCepEmTempoReal() {
    const cepInput = document.getElementById('cep');
    let cep = cepInput.value.trim();

    // Remove todos os caracteres não numéricos
    cep = cep.replace(/\D/g, '');

    // Formata o CEP no padrão XXXXX-XXX
    if (cep.length <= 5) {
        cepInput.value = cep; // Se tem até 5 dígitos, apenas exibe
    } else {
        cepInput.value = cep.substring(0, 5) + '-' + cep.substring(5, 8); // Aplica o formato com o hífen
    }

    // Remove as classes de validação durante a formatação em tempo real
    cepInput.classList.remove('valid');
    cepInput.classList.remove('input-error');
}

// Evento para validar o CEP ao perder o foco (no blur)
document.getElementById('cep').addEventListener('blur', function() {
    validarCep(); // Valida o CEP quando o campo perde o foco
});

// Evento para formatar o CEP em tempo real conforme o usuário digita
document.getElementById('cep').addEventListener('input', function() {
    formatarCepEmTempoReal(); // Formata o CEP enquanto o usuário digita
});

// Exibir o modal ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('modal-activation').style.display = 'block';
    document.getElementById('formulario-container').style.display = 'none';
});

// Função simulada para verificar o código de ativação (com o código "123456" para testes)
// Função para verificar o código de ativação no Firebase
function verificarCodigoAtivacao(codigoAtivacao) {
    return new Promise((resolve, reject) => {
        const codigoDisponivelRef = database.ref('codigos_ativacao/disponiveis/' + codigoAtivacao);

        // Verifica se o código está em "disponíveis"
        codigoDisponivelRef.once('value').then(snapshot => {
            if (snapshot.exists()) {
                resolve(true);  // Código é válido e está disponível
            } else {
                resolve(false); // Código não é válido ou não está disponível
            }
        }).catch(error => {
            console.error('Erro ao verificar o código de ativação:', error);
            reject(error);  // Tratamento de erro
        });
    });
}

// Função para exibir o loader durante a verificação
function exibirLoaderVerificacao() {
    const activationDescription = document.querySelector('p'); // Seleciona o primeiro parágrafo
    const activationLabel = document.querySelector('label[for="activation-code-input"]');
    const activationInput = document.getElementById('activation-code-input');
    const activationButton = document.getElementById('check-activation-btn');
    const loaderElement = document.getElementById('loader');
    const activationMessage = document.getElementById('activation-error');

    // Ocultar parágrafo, label, input e botão
    activationDescription.style.display = 'none'; // Oculta o parágrafo
    activationLabel.style.display = 'none';       // Oculta o label
    activationInput.style.display = 'none';       // Oculta o input
    activationButton.style.display = 'none';      // Oculta o botão

    // Exibir loader e mensagem de verificação
    loaderElement.style.display = 'block';        // Exibe o loader
    activationMessage.style.display = 'block';    // Exibe a mensagem de status
    activationMessage.style.color = 'black';      // Altera a cor da mensagem
    activationMessage.textContent = 'Verificando código de ativação...';
}


// Função para carregar a lista de médicos no dropdown
function carregarMedicos() {
    const medicoList = document.getElementById('medico-list'); // Onde os médicos aparecerão
    medicoList.innerHTML = ''; // Limpa a lista antes de carregar os médicos

    // Busca os médicos no Firebase
    database.ref('medicos').once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const medicoData = childSnapshot.val();
            const medicoId = childSnapshot.key; // Pega o ID único do médico

            // Cria um item da lista para cada médico
            const li = document.createElement('li');
            li.textContent = medicoData.nome + " (CRM: " + medicoData.crm + ")";
            li.setAttribute('data-id', medicoId); // Armazena o ID do médico como um atributo
            li.addEventListener('click', function() {
                selecionarMedico(medicoData.nome, medicoId); // Quando o médico for clicado
            });

            medicoList.appendChild(li); // Adiciona o item à lista
        });
    });
}

// Função para selecionar o médico e preencher o campo no formulário
function selecionarMedico(nomeMedico, idMedico) {
    const medicoInput = document.getElementById('medico-search');
    const medicoIdInput = document.getElementById('medico-id'); // Campo oculto para armazenar o ID do médico

    medicoInput.value = nomeMedico; // Preenche o campo de médico no formulário
    medicoIdInput.value = idMedico; // Preenche o campo oculto com o ID do médico

    // Desabilita o campo para evitar que o usuário altere o médico
    medicoInput.setAttribute('disabled', 'true');
}

// Evento que carrega a lista de médicos quando a página é carregada
document.addEventListener('DOMContentLoaded', function () {
    carregarMedicos(); // Carrega os médicos ao abrir a página
});

// Evento ao clicar no botão de verificação
document.getElementById('check-activation-btn').addEventListener('click', function () {
    const codigoAtivacao = document.getElementById('activation-code-input').value.trim();

    if (codigoAtivacao === '') {
        document.getElementById('activation-error').style.display = 'block';
        document.getElementById('activation-error').textContent = 'Por favor, insira o código de ativação.';
        return;
    }

    exibirLoaderVerificacao(); // Exibe o loader e oculta o input, label, parágrafo e o botão



// Função para verificar o código de ativação em todas as chaves (disponíveis, indisponíveis, inutilizados)
function verificarCodigoAtivacao(codigoAtivacao) {
    return new Promise((resolve, reject) => {
        const promises = [];

        // Verifica nas chaves "disponíveis", "indisponíveis" e "inutilizados"
        promises.push(database.ref('codigos_ativacao/disponiveis/' + codigoAtivacao).once('value'));
        promises.push(database.ref('codigos_ativacao/indisponiveis/' + codigoAtivacao).once('value'));
        promises.push(database.ref('codigos_ativacao/inutilizados/' + codigoAtivacao).once('value'));

        // Resolve todas as promessas
        Promise.all(promises).then(results => {
            const disponivelSnapshot = results[0];
            const indisponivelSnapshot = results[1];
            const inutilizadoSnapshot = results[2];

            // Verifica se o código está disponível
            if (disponivelSnapshot.exists()) {
                resolve({ status: 'disponivel', medico_id: disponivelSnapshot.val().medico_id });
            }
            // Verifica se o código está indisponível (já foi utilizado)
            else if (indisponivelSnapshot.exists()) {
                const exameId = indisponivelSnapshot.val().exame_id;
                resolve({ status: 'indisponivel', exame_id: exameId });
            }
            // Verifica se o código está inutilizado
            else if (inutilizadoSnapshot.exists()) {
                resolve({ status: 'inutilizado' });
            }
            // Caso não esteja em nenhuma das chaves
            else {
                resolve({ status: 'invalido' });
            }
        }).catch(error => {
            console.error('Erro ao verificar o código de ativação:', error);
            reject(error);  // Tratamento de erro
        });
    });
}

    verificarCodigoAtivacao(codigoAtivacao).then((resultado) => {
        if (resultado.status === 'disponivel') {
            // Busca o nome do médico relacionado ao código
            database.ref('medicos/' + resultado.medico_id).once('value').then(medicoSnapshot => {
                const nomeMedico = medicoSnapshot.val().nome;

                // Preenche o campo de médico no formulário e desabilita a alteração
                selecionarMedico(nomeMedico, resultado.medico_id);

                // Mensagem de sucesso e exibe o formulário após um delay
                document.getElementById('activation-error').textContent = 'Código de ativação verificado com sucesso!';
                
                setTimeout(() => {
                    document.getElementById('modal-activation').style.display = 'none';
                    document.getElementById('formulario-container').style.display = 'block';

                    // Preencher o campo de ativação no formulário e desabilitar a edição
                    const activationCodeField = document.getElementById('activation-code');
                    if (activationCodeField) {
                        activationCodeField.value = codigoAtivacao;
                        activationCodeField.setAttribute('disabled', 'true');
                    }
                }, 2000); // Exibe a mensagem de sucesso por 2 segundos antes de fechar o modal
            });
        } else if (resultado.status === 'indisponivel') {
            // Exibe uma mensagem informando que o código já foi utilizado em um exame específico
            document.getElementById('activation-error').textContent = `Este código já foi utilizado no exame de ID ${resultado.exame_id}.`;
            document.getElementById('activation-error').style.color = 'red';
            // Reexibe o input e botão após falha
            document.querySelector('p').style.display = 'block';
            document.querySelector('label[for="activation-code-input"]').style.display = 'block';
            document.getElementById('activation-code-input').style.display = 'block';
            document.getElementById('check-activation-btn').style.display = 'block';
            document.getElementById('loader').style.display = 'none';
        } else if (resultado.status === 'inutilizado') {
            // Exibe uma mensagem informando que o código foi inutilizado
            document.getElementById('activation-error').textContent = 'Este código de ativação foi inutilizado e não pode ser utilizado.';
            document.getElementById('activation-error').style.color = 'red';
            // Reexibe o input e botão após falha
            document.querySelector('p').style.display = 'block';
            document.querySelector('label[for="activation-code-input"]').style.display = 'block';
            document.getElementById('activation-code-input').style.display = 'block';
            document.getElementById('check-activation-btn').style.display = 'block';
            document.getElementById('loader').style.display = 'none';
        } else {
            // Exibe uma mensagem informando que o código é inválido ou inexistente
            document.getElementById('activation-error').textContent = 'Código de ativação inválido ou inexistente.';
            document.getElementById('activation-error').style.color = 'red';
            // Reexibe o input e botão após falha
            document.querySelector('p').style.display = 'block';
            document.querySelector('label[for="activation-code-input"]').style.display = 'block';
            document.getElementById('activation-code-input').style.display = 'block';
            document.getElementById('check-activation-btn').style.display = 'block';
            document.getElementById('loader').style.display = 'none';
        }
    }).catch((error) => {
        console.error('Erro durante a verificação do código de ativação:', error);
        document.getElementById('activation-error').style.display = 'block';
        document.getElementById('activation-error').style.color = 'red';
        document.getElementById('activation-error').textContent = 'Erro ao verificar o código de ativação.';
    });
});


async function validarCupom(codigoDesconto) {
    try {
        // Referência ao caminho de 'medicos'
        const medicosRef = database.ref('medicos');

        const snapshot = await medicosRef.once('value');
        if (snapshot.exists()) {
            const medicosData = snapshot.val();

            // Itera sobre todos os médicos
            for (let medicoId in medicosData) {
                const medico = medicosData[medicoId];
                const descontos = medico.codigo_desconto;

                // Verifica se o médico tem descontos
                if (descontos) {
                    // Itera sobre todos os cupons de desconto desse médico
                    for (let chave in descontos) {
                        if (descontos[chave].codigo === codigoDesconto) {
                            return descontos[chave].percentual; // Retorna a porcentagem do desconto
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

// Função para atualizar o texto dos radio buttons com os valores de desconto aplicados
function atualizarValoresRadioButtons(precoComHPV, precoSemHPV) {
    document.getElementById('preco-exame-com-hpv').textContent = `Exame de Microbioma Vaginal (c/ teste de HPV incluso) - R$${precoComHPV.toFixed(2)}`;
    document.getElementById('preco-exame-sem-hpv').textContent = `Exame de Microbioma Vaginal (s/ teste de HPV incluso) - R$${precoSemHPV.toFixed(2)}`;
    
    // Também atualiza o atributo value dos radio buttons
    document.querySelector('input[name="tipo-exame"][value="800"]').value = precoComHPV;
    document.querySelector('input[name="tipo-exame"][value="700"]').value = precoSemHPV;
}

// Função para calcular e atualizar o valor final
function atualizarValorFinal() {
    // Obtém o valor do exame selecionado
    const valorExame = parseFloat(document.querySelector('input[name="tipo-exame"]:checked').value);
    document.getElementById('valor-final').textContent = `R$${valorExame.toFixed(2)}`;
}

// Função para validar o cupom de desconto
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

// Função para aplicar o desconto no valor do exame selecionado
function aplicarDesconto(percentual) {
    const valorExame = parseFloat(document.querySelector('input[name="tipo-exame"]:checked').value);
    const precoComDesconto = valorExame - (valorExame * (percentual / 100));

    document.getElementById('valor-final').textContent = `R$${precoComDesconto.toFixed(2)}`;
}

// Evento ao alterar o radio button
document.querySelectorAll('input[name="tipo-exame"]').forEach((radio) => {
    radio.addEventListener('change', atualizarValorFinal);
});

// Evento ao clicar no botão de validação de cupom
document.getElementById('validar-cupom-btn').addEventListener('click', async () => {
    const codigoDesconto = document.getElementById('codigo-desconto').value.trim();

    if (codigoDesconto) {
        const percentual = await validarCupom(codigoDesconto);
        if (percentual !== null) {
            aplicarDesconto(percentual); // Aplica o desconto ao exame selecionado
            alert(`Cupom de ${percentual}% aplicado com sucesso!`);
        } else {
            alert('Cupom inválido.');
        }
    } else {
        alert('Por favor, insira um código de desconto.');
    }
});

// Inicializa o valor final na carga da página
atualizarValorFinal();
