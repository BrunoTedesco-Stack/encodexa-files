
//#region Configuração do Firebase

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD5RpiWnBRLplw7IxoSTYJh9AMidFHXpVM",
    authDomain: "encodexa.firebaseapp.com",
    databaseURL: "https://encodexa-default-rtdb.firebaseio.com",
    projectId: "encodexa",
    storageBucket: "encodexa.appspot.com",
    messagingSenderId: "575353833546",
    appId: "1:575353833546:web:00e0f11b788ab801eebeb3"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
//#endregion



// Função para gerar o ID do médico no formato MED_ID_0000000
function gerarMedicoId() {
    var idNumerico = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    return 'MED_ID_' + idNumerico;
}

// Função para adicionar um novo campo de código de desconto e porcentagem
function adicionarCampoDesconto() {
    const descontosContainer = document.getElementById('descontos-container');
    const newField = document.createElement('div');
    newField.classList.add('desconto-field');
    newField.innerHTML = `
        <label for="codigo-desconto">Código de Desconto:</label>
        <input type="text" class="codigo-desconto" placeholder="Digite o código de desconto">
        <label for="porcentagem-desconto">Porcentagem:</label>
        <input type="number" class="porcentagem-desconto" placeholder="Digite a porcentagem" min="0" max="100">
        <button type="button" onclick="adicionarCampoDesconto()">+</button>
    `;
    descontosContainer.appendChild(newField);
}

// Função para gerar cupons de desconto automaticamente
function gerarCuponsDesconto() {
    const prefixos = [
        { percent: '5%', prefix: 'PROMO5%OFF' },
        { percent: '10%', prefix: 'PROMO10%OFF' },
        { percent: '15%', prefix: 'PROMO15%OFF' },
        { percent: '20%', prefix: 'PROMO20%OFF' },
        { percent: '25%', prefix: 'PROMO25%OFF' },
        { percent: '30%', prefix: 'PROMO30%OFF' },
        { percent: '100%', prefix: 'PROMO100%OFF' }
    ];

    return prefixos.map(item => {
        const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
        return {
            codigo: `${item.prefix}${numeroAleatorio}`,
            percentual: item.percent
        };
    });
}

// Função para preencher dropdowns com os médicos do banco de dados
function preencherDropdowns() {
    database.ref('medicos').once('value').then(snapshot => {
        const dropdownSetor = document.getElementById('consulta-dropdown-setor');
        const dropdownFaturamento = document.getElementById('consulta-dropdown-faturamento');
        const dropdownGeral = document.getElementById('consulta-dropdown-geral');

        snapshot.forEach(childSnapshot => {
            const medico = childSnapshot.val();
            const option = document.createElement('option');
            option.value = medico.crm;
            option.text = `${medico.nome} (CRM: ${medico.crm})`;
            dropdownSetor.appendChild(option.cloneNode(true));
            dropdownFaturamento.appendChild(option.cloneNode(true));
            dropdownGeral.appendChild(option);
        });
    });
}

// Chama a função para preencher os dropdowns ao carregar a página
window.onload = preencherDropdowns;

// Função para exibir o resultado da consulta em uma tabela
function exibirResultadoTabela(dados) {
    const tbody = document.getElementById('tabela-resultado').querySelector('tbody');
    tbody.innerHTML = '';
    for (const [campo, valor] of Object.entries(dados)) {
        const row = document.createElement('tr');
        const campoCell = document.createElement('td');
        const valorCell = document.createElement('td');
        campoCell.textContent = campo;
        valorCell.textContent = valor;
        row.appendChild(campoCell);
        row.appendChild(valorCell);
        tbody.appendChild(row);
    }
}

// Função genérica para consultar o médico por CRM e exibir a informação solicitada
function consultarMedicoPorCrm(crm, campo, descricaoCampo) {
    if (!crm) {
        alert('Por favor, insira ou selecione o CRM para consulta.');
        return;
    }

    database.ref('medicos').orderByChild('crm').equalTo(crm).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    const medico = childSnapshot.val();
                    if (campo === 'geral') {
                        exibirResultadoTabela({
                            "Nome": medico.nome,
                            "CRM": medico.crm,
                            "Sexo": medico.sexo,
                            "CPF": medico.cpf,
                            "Email": medico.email,
                            "Telefone": medico.telefone,
                            "CEP": medico.cep,
                            "Rua": medico.rua,
                            "Número": medico.numero,
                            "Complemento": medico.complemento,
                            "Bairro": medico.bairro,
                            "Cidade": medico.cidade,
                            "Estado": medico.estado,
                            "Setor": medico.setor,
                            "Tipo de Faturamento": medico.tipo_faturamento
                        });
                    } else {
                        exibirResultadoTabela({ [descricaoCampo]: medico[campo] });
                    }
                });
            } else {
                alert('Nenhum médico encontrado com o CRM informado.');
            }
        })
        .catch(error => {
            alert(`Erro ao consultar ${descricaoCampo.toLowerCase()}: ${error.message}`);
        });
}

// Função para consultar setor do médico
function consultarSetor() {
    const crm = document.getElementById('consulta-setor').value.trim();
    consultarMedicoPorCrm(crm, 'setor', 'Setor');
}

function consultarSetorDropdown() {
    const crm = document.getElementById('consulta-dropdown-setor').value;
    if (crm) consultarMedicoPorCrm(crm, 'setor', 'Setor');
}

// Função para consultar tipo de faturamento do médico
function consultarFaturamento() {
    const crm = document.getElementById('consulta-faturamento').value.trim();
    consultarMedicoPorCrm(crm, 'tipo_faturamento', 'Tipo de Faturamento');
}

function consultarFaturamentoDropdown() {
    const crm = document.getElementById('consulta-dropdown-faturamento').value;
    if (crm) consultarMedicoPorCrm(crm, 'tipo_faturamento', 'Tipo de Faturamento');
}

// Função para consultar informações gerais do médico
function consultarInformacoesGerais() {
    const crm = document.getElementById('consulta-geral').value.trim();
    consultarMedicoPorCrm(crm, 'geral', 'Informações Gerais');
}

function consultarInformacoesGeraisDropdown() {
    const crm = document.getElementById('consulta-dropdown-geral').value;
    if (crm) consultarMedicoPorCrm(crm, 'geral', 'Informações Gerais');
}

// Função para capturar o envio do formulário e cadastrar o médico no Firebase
document.getElementById('form-medico').addEventListener('submit', function(event) {
    event.preventDefault();  // Impede o comportamento padrão do formulário

    // Gerar um ID sequencial para o médico
    gerarMedicoIdSequencial().then(medicoId => {
        // Coletar os dados do formulário
        const medicoData = {
            crm: document.getElementById('crm-medico').value.trim(),
            nome: document.getElementById('nome-medico').value.trim(),
            sexo: document.getElementById('sexo-medico').value.trim(),
            cpf: document.getElementById('cpf-medico').value.trim(),
            email: document.getElementById('email-medico').value.trim(),
            telefone: document.getElementById('telefone-medico').value.trim(),
            cep: document.getElementById('cep-medico').value.trim(),
            rua: document.getElementById('rua-medico').value.trim(),
            numero: document.getElementById('numero-medico').value.trim(),
            complemento: document.getElementById('complemento-medico').value.trim(),
            bairro: document.getElementById('bairro-medico').value.trim(),
            cidade: document.getElementById('cidade-medico').value.trim(),
            estado: document.getElementById('estado-medico').value.trim(),
            setor: document.getElementById('setor-medico').value.trim(),
            tipo_faturamento: document.getElementById('tipo-faturamento').value.trim(),
            codigos_desconto: [],  // Lista para armazenar os códigos de desconto
            codigos_ativacao: []   // Lista para armazenar os códigos de ativação
        };

        // Gerar cupons de desconto automaticamente se a checkbox estiver marcada
        if (document.getElementById('codigo-desconto-automatico').checked) {
            medicoData.codigos_desconto = gerarCuponsDesconto();
        }

        // Gerar códigos de ativação automaticamente se a checkbox estiver marcada
        if (document.getElementById('codigo-ativacao-automatico').checked) {
            for (let i = 0; i < 10; i++) {
                const codigoAtivacao = 'EXACT' + Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
                medicoData.codigos_ativacao.push(codigoAtivacao);
            }
        } else {
            // Se a checkbox não estiver marcada, coletar os códigos de ativação fornecidos
            medicoData.codigos_ativacao = document.getElementById('codigos-ativacao').value.trim().split(',').map(codigo => codigo.trim());
        }

        // Gravar os dados no Firebase
        database.ref('medicos/' + medicoId).set(medicoData)
            .then(() => {
                alert('Médico cadastrado com sucesso!');
                // Limpar o formulário após o cadastro
                document.getElementById('form-medico').reset();
            })
            .catch(error => {
                alert('Erro ao cadastrar médico: ' + error.message);
            });
    }).catch(error => {
        console.error('Erro ao gerar o ID sequencial: ', error);
    });
});

// Função para gerar o próximo ID sequencial no formato MED_ID_0000000
function gerarMedicoIdSequencial() {
    return database.ref('medicos').orderByKey().limitToLast(1).once('value').then(snapshot => {
        let ultimoId = 0;

        snapshot.forEach(childSnapshot => {
            const idMedico = childSnapshot.key;
            const numeroId = parseInt(idMedico.replace('MED_ID_', ''), 10);  // Extrai o número do ID
            if (!isNaN(numeroId)) {
                ultimoId = numeroId;  // Armazena o maior número encontrado
            }
        });

        // Incrementa o último ID e gera o próximo
        const proximoId = ultimoId + 1;
        const novoMedicoId = 'MED_ID_' + proximoId.toString().padStart(7, '0');
        return novoMedicoId;
    });
}

// Função para gerar cupons de desconto automaticamente
function gerarCuponsDesconto() {
    const prefixos = [
        { percent: '5%', prefix: 'PROMO5%OFF' },
        { percent: '10%', prefix: 'PROMO10%OFF' },
        { percent: '15%', prefix: 'PROMO15%OFF' },
        { percent: '20%', prefix: 'PROMO20%OFF' },
        { percent: '25%', prefix: 'PROMO25%OFF' },
        { percent: '30%', prefix: 'PROMO30%OFF' },
        { percent: '100%', prefix: 'PROMO100%OFF' }
    ];

    return prefixos.map(item => {
        const numeroAleatorio = Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
        return {
            codigo: `${item.prefix}${numeroAleatorio}`,
            percentual: item.percent
        };
    });
}

document.getElementById('form-upload-massa').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('arquivo-massa');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            processarArquivoMassa(content);
        };
        reader.readAsText(file);
    } else {
        alert('Por favor, selecione um arquivo .txt.');
    }
});

// Função para processar o arquivo e gravar médicos no Firebase
function processarArquivoMassa(content) {
    const linhas = content.split('\n');  // Dividir por linha

    gerarUltimoIdSequencial().then(ultimoId => {
        let proximoId = ultimoId + 1;  // Próximo ID a ser gerado
        const promises = [];  // Array para armazenar as promessas de gravação

        linhas.forEach((linha, index) => {
            const campos = linha.split(';').map(campo => campo.trim());  // Dividir os campos por ';' e remover espaços extras

            // Verificar se há exatamente 18 campos
            if (campos.length === 18) {
                const medicoData = {
                    crm: campos[0],
                    nome: campos[1],
                    cpf: campos[2],
                    sexo: campos[3],
                    email: campos[4],
                    telefone: campos[5],
                    cep: campos[6],
                    rua: campos[7],
                    numero: campos[8],
                    complemento: campos[9] || '',
                    bairro: campos[10],
                    cidade: campos[11],
                    estado: campos[12],
                    setor: campos[13],
                    tipo_faturamento: campos[14],
                    codigos_desconto: gerarCuponsDesconto(),
                    codigos_ativacao: []
                };

                // Verificar se os códigos de ativação devem ser gerados automaticamente ou foram fornecidos manualmente
                const codigosAtivacao = campos[16];
                if (codigosAtivacao.toUpperCase() === 'AUTO') {
                    // Gerar 10 códigos de ativação automaticamente
                    for (let i = 0; i < 10; i++) {
                        const codigoAtivacao = 'EXACT' + Math.floor(Math.random() * 1000000).toString().padStart(7, '0');
                        medicoData.codigos_ativacao.push(codigoAtivacao);
                    }
                } else {
                    // Usar os códigos de ativação fornecidos no arquivo
                    medicoData.codigos_ativacao = codigosAtivacao.split(',').map(codigo => codigo.trim());
                }

                // Verificar se os códigos já existem
                const promise = verificarCodigosExistentes(medicoData.codigos_ativacao).then(existem => {
                    if (existem.length > 0) {
                        console.error(`Erro na linha ${index + 1}: Os códigos ${existem.join(', ')} já existem no sistema.`);
                        return;  // Impede a gravação se os códigos já existem
                    } else {
                        // Cadastrar o médico primeiro para obter o ID
                        return cadastrarMedico(medicoData, proximoId++).then(medicoId => {
                            // Gravar os códigos na chave 'codigos_ativacao/disponiveis' com o medico_id
                            return database.ref('codigos_ativacao/disponiveis').update({
                                ...medicoData.codigos_ativacao.reduce((acc, codigo) => {
                                    acc[codigo] = { medico_id: medicoId };  // Salvar o medico_id com o código
                                    return acc;
                                }, {})
                            });
                        });
                    }
                });

                promises.push(promise);

            } else {
                console.error(`Linha ${index + 1} com formato inválido: `, linha);
                console.error(`Esperado 18 campos, mas encontrado ${campos.length} campos.`);
            }
        });

        Promise.all(promises).then(() => {
            console.log('Todos os médicos foram cadastrados com sucesso!');
        }).catch(error => {
            console.error('Erro ao cadastrar médicos em massa: ', error);
        });

    }).catch(error => {
        console.error('Erro ao obter o último ID sequencial: ', error);
    });
}

// Função para cadastrar o médico com ID sequencial
function cadastrarMedico(medicoData, id) {
    const medicoId = 'MED_ID_' + id.toString().padStart(7, '0');
    return database.ref('medicos/' + medicoId).set(medicoData)
        .then(() => {
            console.log(`Médico ${medicoData.nome} cadastrado com sucesso com ID ${medicoId}!`);
            return medicoId;  // Retorna o ID do médico após a gravação
        })
        .catch(error => {
            console.error(`Erro ao cadastrar médico ${medicoData.nome}: `, error);
            throw error;
        });
}

// Função para verificar se os códigos de ativação já existem no sistema
function verificarCodigosExistentes(codigos) {
    return database.ref('codigos_ativacao/disponiveis').once('value').then(snapshot => {
        const existentes = [];
        codigos.forEach(codigo => {
            if (snapshot.hasChild(codigo)) {
                existentes.push(codigo);
            }
        });
        return existentes;  // Retorna os códigos que já existem
    });
}

// Função para gerar o próximo ID sequencial no formato MED_ID_0000000
function gerarUltimoIdSequencial() {
    return database.ref('medicos').orderByKey().limitToLast(1).once('value').then(snapshot => {
        let ultimoId = 0;

        snapshot.forEach(childSnapshot => {
            const idMedico = childSnapshot.key;
            const numeroId = parseInt(idMedico.replace('MED_ID_', ''), 10);  // Extrai o número do ID
            if (!isNaN(numeroId)) {
                ultimoId = numeroId;  // Armazena o maior número encontrado
            }
        });

        return ultimoId;  // Retorna o último ID numérico encontrado
    });
}

// Função para carregar médicos e preencher a tabela
function carregarMedicos() {
    const tabelaMedicosBody = document.getElementById('tabela-medicos').querySelector('tbody');
    tabelaMedicosBody.innerHTML = ''; // Limpa a tabela antes de preencher

    database.ref('medicos').once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
            const medico = childSnapshot.val();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medico.crm}</td>
                <td>${medico.nome}</td>
                <td>${medico.sexo}</td>
                <td>${medico.cpf}</td>
                <td>${medico.email}</td>
                <td>${medico.telefone}</td>
                <td>${medico.cidade}</td>
                <td>${medico.setor}</td>
            `;
            tabelaMedicosBody.appendChild(row);
        });
    }).catch(error => {
        console.error('Erro ao carregar médicos: ', error);
    });
}

// Chama a função ao carregar a página
window.onload = function() {
    preencherDropdowns();
    carregarMedicos(); // Carrega médicos quando a página é carregada
};
// Função para filtrar médicos na tabela
function filtrarMedicos() {
    const filtroCRM = document.getElementById('filtro-crm').value.toLowerCase();
    const filtroNome = document.getElementById('filtro-nome').value.toLowerCase();
    const filtroTelefone = document.getElementById('filtro-telefone').value.toLowerCase();
    const filtroSetor = document.getElementById('filtro-setor').value.toLowerCase();

    const tabelaMedicosBody = document.getElementById('tabela-medicos').querySelector('tbody');
    const linhas = tabelaMedicosBody.getElementsByTagName('tr');

    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        const medicoCRM = linha.cells[0].textContent.toLowerCase();
        const medicoNome = linha.cells[1].textContent.toLowerCase().replace(/^(dr\.|dra\.)\s*/, ''); // Remove "Dr." ou "Dra." do nome
        const medicoTelefone = linha.cells[5].textContent.toLowerCase();
        const medicoSetor = linha.cells[7].textContent.toLowerCase();

        // Verificar se a linha deve ser exibida com base nos filtros
        if (
            (medicoCRM.startsWith(filtroCRM) || filtroCRM === '') &&
            (medicoNome.startsWith(filtroNome) || filtroNome === '') &&
            (medicoTelefone.startsWith(filtroTelefone) || filtroTelefone === '') &&
            (medicoSetor.startsWith(filtroSetor) || filtroSetor === '')
        ) {
            linha.style.display = ''; // Exibir linha
        } else {
            linha.style.display = 'none'; // Ocultar linha
        }
    }
}
// Função para formatar o telefone para o campo de filtro
function formatarTelefone(input) {
    // Remove todos os caracteres que não sejam dígitos
    let valor = input.value.replace(/\D/g, '');

    // Aplica a formatação
    if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3'); // Formato: (XX) XXXXX-XXXX
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3'); // Formato: (XX) XXXX-XXXX
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,2})$/, '($1) $2'); // Formato: (XX) XX
    } else if (valor.length === 2) {
        valor = valor.replace(/^(\d{2})$/, '($1) '); // Formato: (XX)
    }

    // Atualiza o valor do input
    input.value = valor;

    // Atualiza a lista de médicos enquanto o usuário digita
    filtrarMedicos();
}







// Função para abrir o modal de cadastro
function abrirModalCadastro() {
    document.getElementById('modalCadastro').style.display = 'block';
}

// Função para fechar o modal de cadastro
function fecharModalCadastro() {
    document.getElementById('modalCadastro').style.display = 'none';
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modalCadastro');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const crmInput = document.getElementById('crm-medico');
    const ufSelect = document.getElementById('uf-crm');

    crmInput.addEventListener('blur', function() {
        const crmValue = crmInput.value.trim();
        const isValid = crmValue.length >= 6 && crmValue.length <= 8; // Ajuste conforme necessário

        if (isValid) {
            crmInput.classList.add('valid');
        } else {
            crmInput.classList.remove('valid');
        }
    });

    crmInput.addEventListener('input', function() {
        const crmValue = this.value.trim();
        if (crmValue.length === 8) {
            const uf = crmValue.substring(0, 2).toUpperCase();
            const options = ufSelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === uf) {
                    ufSelect.selectedIndex = i;
                    ufSelect.classList.add('valid');
                    break;
                }
            }
        } else {
            ufSelect.classList.remove('valid');
            if (crmValue === '') {
                ufSelect.selectedIndex = 0; // Volta para a opção padrão
            }
        }
    });
});
const especialidadeSelect = document.getElementById('especialidade-medico');
especialidadeSelect.addEventListener('change', function() {
    if (especialidadeSelect.selectedIndex !== 0) { // Verifica se não está no estado padrão
        especialidadeSelect.classList.add('valid');
    } else {
        especialidadeSelect.classList.remove('valid');
    }
});

document.getElementById('crm-medico').addEventListener('input', function() {
    const crmInput = this.value;
    if (crmInput.length === 8) {
        const uf = crmInput.substring(0, 2).toUpperCase();
        const ufSelect = document.getElementById('uf-crm');
        const options = ufSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === uf) {
                ufSelect.selectedIndex = i;
                break;
            }
        }
    }
});

const apiCpfUrl = 'https://gateway.apibrasil.io/api/v2/dados/cpf/credits';
const apiCpfKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwcC5hcGlicmFzaWwuaW8vYXV0aC9yZWdpc3RlciIsImlhdCI6MTcyNzQ3MDQ2OSwiZXhwIjoxNzU5MDA2NDY5LCJuYmYiOjE3Mjc0NzA0NjksImp0aSI6IkN2b2tzNGNFeWFxWm5QS0kiLCJzdWIiOiIxMTUyMiIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.OwrUsq32pOuJjIeOFf_CawQsXJm00bD4dNRoHg64W7o';


// Referências aos elementos do DOM
const form = document.getElementById('form-medico');
//informações profissionais
const crmmedico = document.getElementById('crm-medico');
const ufmedico = document.getElementById('uf-crm');
const especialidade = document.getElementById('especialidade-medico');
//informações pessoais
const cpfInput = document.getElementById('cpf-medico');
const nomeInput = document.getElementById('nome-medico');
const dataInput = document.getElementById('data-nascimento-medico');
const sexoInput = document.getElementById('sexo-medico');

const telefonemovelInput = document.getElementById('telefone-celular-medico');
const telefonefixoInput = document.getElementById('telefone-fixo-medico');
//endereço
const cepInput = document.getElementById('cep');
const medicoInput = document.getElementById('medico-search');
const medicoIdInput = document.getElementById('medico-id'); // Campo oculto para o ID do médico
const activationCodeField = document.getElementById('activation-code'); // Campo oculto para o código de ativação


async function consultarCreditoCPF(cpf) {
    const cpfModal = document.getElementById('modal-validation'); // Modal CPF
    const cpfModalcontent = document.getElementById('modal-content-cpf'); // Modal CPF
    const loader = document.getElementById('loader-valida');
    const modalMessages = document.getElementById('modal-header');
    try {
        cpfModal.style.display = 'block'
        loader.style.display = 'block';
        modalMessages.innerHTML = 'Validando o CPF'; // Limpar mensagens anteriores
       

        const response = await fetch(apiCpfUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiCpfKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cpf: cpf, lite: true })
        });

        if (!response.ok) {
            cpfInput.classList.remove('valid');
            cpfInput.classList.add('invalid');
            cpfModalcontent.classList.remove('validando');
            cpfModalcontent.classList.add('invalid');
            cpfModal.style.display = 'block';
            loader.style.display = 'block';
            modalMessages.innerHTML = 'Erro na requisição'; 
            setTimeout(function() {
                // Ocultar o modal e o loader após 1,5 segundos
                cpfModal.style.display = 'none';
                loader.style.display = 'none';
            }, 1500); // 1,5 segundos (1500 milissegundos)
            throw new Error('Erro na requisição');
            
        }

        const data = await response.json();
        console.log('Resposta da API:', data);

        if (data && data.response && data.response.content && data.response.content.nome) {
            //modifica o input do cpf para validado
            cpfInput.classList.remove('invalid');
            cpfInput.classList.remove('valid');
            cpfInput.classList.add('validado');
            //modifica o input do nome para validado
            nomeInput.classList.remove('invalid');
            nomeInput.classList.remove('valid');
            nomeInput.classList.add('validado');
            //modifica o input da data para validado
            dataInput.classList.remove('invalid');
            dataInput.classList.remove('valid');
            dataInput.classList.add('validado');
            //modifica o input do sexo para validado
            sexoInput.classList.remove('invalid');
            sexoInput.classList.remove('valid');
            sexoInput.classList.add('validado');
            //modifica o modal para validado
            cpfModalcontent.classList.remove('validando');
            cpfModalcontent.classList.add('valid');
            //mostra o modal
            cpfModal.style.display = 'block';
            loader.style.display = 'block';
            modalMessages.innerHTML = 'Sucesso!'; 
             

            document.getElementById('nome-medico').value = data.response.content.nome.conteudo.nome || '';
            
            // Formatar a data para o formato yyyy-MM-dd
            const dataFormatada = formatarData(data.response.content.nome.conteudo.data_nascimento || '');
            document.getElementById('data-nascimento-medico').value = dataFormatada;

             // Alimentar o select sexo-medico
             const sexoMedicoSelect = document.getElementById('sexo-medico');
             const sexo = data.response.content.nome.conteudo.sexo;
             if (sexo === 'F') {
                 sexoMedicoSelect.value = 'Feminino';
             } else if (sexo === 'M') {
                 sexoMedicoSelect.value = 'Masculino';
             }
            //document.getElementById('nome-medico').setAttribute('disabled', 'true');
            //document.getElementById('data-nascimento-medico').setAttribute('disabled', 'true');

            // Salva o saldo no banco de dados, se disponível
            if (data.balance !== undefined) {
                const saldo = data.balance;
                await database.ref('API_INFORMATION/API_BRASIL/SALDO_API_BRASIL/').set({
                    saldo: saldo,
                    timestamp: new Date().toISOString()
                });
                console.log('Saldo salvo no banco de dados:', saldo);
            }
        }
    } catch (error) {
        //modifica o input do cpf para invalido
        cpfInput.classList.remove('valid');
        cpfInput.classList.add('invalid');
        //modifica o modal para invalido
        cpfModalcontent.classList.remove('validando');
        cpfModalcontent.classList.add('invalid');
        //mostra o modal
        cpfModal.style.display = 'block';
        loader.style.display = 'block';
        modalMessages.innerHTML = 'CPF inválido!'; 
        //esconde o modal e o loader após 1,5 segundos
        setTimeout(function() {
            // Ocultar o modal e o loader após 1,5 segundos
            cpfModal.style.display = 'none';
            loader.style.display = 'none';
        }, 1500); // 1,5 segundos (1500 milissegundos)
    } finally { 
        setTimeout(function() {
            // Ocultar o modal e o loader após 1,5 segundos
            cpfModal.style.display = 'none';
            loader.style.display = 'none';
           }, 1500); // 1,5 segundos (1500 milissegundos)
    }
}

function formatarData(data) {
    const partes = data.split('/');
    const dia = partes[0];
    const mes = partes[1];
    const ano = partes[2];
    return `${ano}-${mes}-${dia}`;
}
  // Adicionar evento input ao campo CPF para formatação
  cpfInput.addEventListener('input', function() {
    const cursorPosition = cpfInput.selectionStart;
    const formattedValue = formatarCPF(cpfInput.value);

    // Atualizar o valor formatado
    cpfInput.value = formattedValue;

    // Usar setTimeout para garantir que o navegador processe o foco e o cursor corretamente
    setTimeout(() => {
        const newCursorPosition = calculateNewCursorPosition(cursorPosition, cpfInput.value, formattedValue);
        cpfInput.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);  // Pequeno atraso de 0ms para deixar o navegador processar a mudança
});


function formatarCPF(valor) {
    valor = valor.replace(/\D/g, ''); // Remove caracteres não numéricos
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após os primeiros 3 dígitos
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após os próximos 3 dígitos
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen antes dos últimos 2 dígitos
    return valor;
}

function validarCPF(cpf) {
    // Remove caracteres especiais
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    // Verifica se todos os números são iguais
    if (/^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    // Calcula o primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }

    if (resto != parseInt(cpf.substring(9, 10))) {
        return false;
    }

    soma = 0;

    // Calcula o segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;

    if ((resto == 10) || (resto == 11)) {
        resto = 0;
    }

    if (resto != parseInt(cpf.substring(10, 11))) {
        return false;
    }

    return true;
}
document.getElementById('cpf-medico').addEventListener('blur', function () {
    const cpfModal = document.getElementById('modal-validation'); // Modal CPF
    const cpfModalcontent = document.getElementById('modal-content-cpf'); // Modal CPF
    const loader = document.getElementById('loader-valida');
    const modalMessages = document.getElementById('modal-header');
    const cpf = this.value;

    if (cpf === '') {
    
        return;
    }

    if (validarCPF(cpf)) {
        console.log('CPF válido');
        cpfInput.classList.add('valid');
        cpfInput.classList.remove('invalid');
        cpfModalcontent.classList.remove('invalid');
        cpfModalcontent.classList.remove('valid');
        cpfModalcontent.classList.add('validando');
        cpfModal.style.display = 'block';
        loader.style.display = 'block';
        modalMessages.innerHTML = 'Validando CPF..'; // Limpar mensagens anteriores
        consultarCreditoCPF(cpf);  // Chama a função com o CPF formatado

    } else {
        console.log('CPF inválido');
        cpfInput.classList.remove('valid');
        cpfInput.classList.remove('validado');
        cpfInput.classList.add('invalid');
        cpfModalcontent.classList.remove('validando');
        cpfModalcontent.classList.add('invalid');
        cpfModal.style.display = 'block';
        loader.style.display = 'block';
        modalMessages.innerHTML = 'CPF Inválido!'; // Limpar mensagens anteriores
        setTimeout(function() {
            // Ocultar o modal e o loader após 1,5 segundos
            cpfModal.style.display = 'none';
            loader.style.display = 'none';
        }, 1500); // 1,5 segundos (1500 milissegundos)
    }
    


});

// Captura o evento de entrada no campo nome-medico
document.getElementById('nome-medico').addEventListener('input', function() {
    const originalClass = 'nome-medico'; // Defina aqui qual é a classe original do campo nome
    const nomeInput = document.getElementById('nome-medico'); // Seleciona o input

    // Verifica se o valor do campo está vazio
    if (nomeInput.value === '') {
        nomeInput.className = originalClass; // Se estiver vazio, aplica a classe original
    } else {
        //nomeInput.classList.add('valid'); // Se não estiver vazio, aplica a classe de validação
    }
});

// Captura o evento de entrada no campo nome-medico
document.getElementById('data-nascimento-medico').addEventListener('input', function() {
    const originalClass = 'data-nascimento-medico'; // Defina aqui qual é a classe original do campo nome
    const nomeInput = document.getElementById('data-nascimento-medico'); // Seleciona o input

    // Verifica se o valor do campo está vazio
    if (nomeInput.value === '') {
        nomeInput.className = originalClass; // Se estiver vazio, aplica a classe original
    } else {
        //nomeInput.classList.add('valid'); // Se não estiver vazio, aplica a classe de validação
    }
});

// Captura o evento de entrada no campo nome-medico
document.getElementById('sexo-medico').addEventListener('input', function() {
    const originalClass = 'sexo-medico'; // Defina aqui qual é a classe original do campo nome
    const nomeInput = document.getElementById('sexo-medico'); // Seleciona o input

    // Verifica se o valor do campo está vazio
    if (nomeInput.value === '0') {
        nomeInput.className = originalClass; // Se estiver vazio, aplica a classe original
    } else {
        //nomeInput.classList.add('valid'); // Se não estiver vazio, aplica a classe de validação
    }
});


document.getElementById('cpf-medico').addEventListener('input', function() {
    const originalClasscpf = 'cpf-medico'; // Classe original do campo CPF
    const originalClassnome = 'nome-medico'; // Classe original do campo nome-medico    
    const originalClassdata = 'data-nascimento-medico'; // Classe original do campo data-nascimento-medico  
    const cpfInput = document.getElementById('cpf-medico'); // Seleciona o input CPF
    const nomeInput = document.getElementById('nome-medico'); // Seleciona o input nome-medico
    const dataNascimentoInput = document.getElementById('data-nascimento-medico'); // Seleciona o input data-nascimento-medico
    const sexoSelect = document.getElementById('sexo-medico'); // Seleciona o select sexo-medico
    

    // Verifica se o valor do campo CPF está vazio
    if (cpfInput.value === '') {
        cpfInput.className = originalClasscpf; // Se estiver vazio, aplica a classe original no CPF
        nomeInput.className = originalClassnome; // Se estiver vazio, aplica a classe original no nome
        dataNascimentoInput.className = originalClassdata; // Se estiver vazio, aplica a classe original na data de nascimento  
        sexoSelect.className = originalClassdata; // Se estiver vazio, aplica a classe original no sexo

        // Apaga os dados dos campos nome-medico e data-nascimento-medico
        nomeInput.value = ''; 
        dataNascimentoInput.value = ''; 

        // Seta o valor do select sexo-medico para 0 (ou o valor padrão desejado)
        sexoSelect.value = '0'; 
    }
});

// Obter o elemento de entrada do email
const emailInput = document.getElementById('email-medico');

// Expressão regular para validar o formato do email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Adicionar ouvinte de eventos para o evento input no campo de email
emailInput.addEventListener('input', function() {
    if (emailRegex.test(emailInput.value)) {
        // Email é válido
        emailInput.classList.remove('invalid');
        emailInput.classList.add('valid');
    } else {
        // Email é inválido
        emailInput.classList.remove('valid');
        emailInput.classList.add('invalid');
    }
});

// #region funções do campo de telefone móvel


// Obter o elemento de entrada do telefone móvel
const telefoneInput = document.getElementById('telefone-celular-medico');

// Expressão regular para validar o formato do telefone móvel
const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

// Adicionar ouvinte de eventos para o evento input no campo de telefone móvel
telefoneInput.addEventListener('input', function() {
    // Remover todos os caracteres que não sejam dígitos
    let valor = telefoneInput.value.replace(/\D/g, '');

    // Limita o valor a 11 dígitos (DDD + número)
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }

    // Aplica a formatação progressivamente
    if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{1})(\d{4})(\d{0,4})$/, '($1) $2$3-$4');
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{1})(\d{0,4})$/, '($1) $2$3');
    } else if (valor.length > 0) {
        valor = valor.replace(/^(\d{0,2})$/, '($1');
    }

    // Atualiza o valor do input
    telefoneInput.value = valor;

    // Validação do formato: 15 caracteres (incluindo os espaços e hifens) e número começando com 9 após o DDD
    if (valor.length === 15 && valor[5] === '9') {
        telefoneInput.classList.add('valid');
        telefoneInput.classList.remove('invalid');
    } else {
        telefoneInput.classList.remove('valid');
        telefoneInput.classList.add('invalid');
    }
});



// Adiciona o evento de input no campo telefone-celular-medico
document.getElementById('telefone-celular-medico').addEventListener('input', function () {
    formatarTelefoneCelular(this);
});

function exibirAlertaCampo(campo, mensagem) {
    // Define a mensagem de erro personalizada
    campo.setCustomValidity(mensagem);
    
    // Força o campo a exibir a mensagem
    campo.reportValidity();
    
    // Remove a mensagem personalizada após a exibição
    setTimeout(() => {
        campo.setCustomValidity(''); // Limpa a mensagem personalizada
    }, 3000); // A mensagem de erro desaparece após 3 segundos
}

// Exemplo de uso ao sair do campo (blur)
document.getElementById('telefone-celular-medico').addEventListener('blur', function () {
    if (this.value === '') {
        exibirAlertaCampo(this, 'Por favor, insira o número de telefone.');
    } else if (this.value.length < 15) { // Assumindo o formato correto tem 15 caracteres
        exibirAlertaCampo(this, 'O telefone está incompleto.');
    }
});

// #endregion



// #region funções do campo de telefone móvel


// Obter o elemento de entrada do telefone fixo
const telfixoinput = document.getElementById('telefone-fixo-medico');

// Expressão regular para validar o formato do telefone fixo
const telfixoRegex = /^\(\d{2}\) [2-9]\d{3}-\d{4}$/;

// Adicionar ouvinte de eventos para o evento input no campo de telefone fixo
telfixoinput.addEventListener('input', function() {
    // Remover todos os caracteres que não sejam dígitos
    let valor = telfixoinput.value.replace(/\D/g, '');

    // Limita o valor a 10 dígitos (DDD + número)
    if (valor.length > 10) {
        valor = valor.substring(0, 10);
    }

    // Aplica a formatação progressivamente
    if (valor.length > 6) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d{0,4})$/, '($1) $2');
    } else if (valor.length > 0) {
        valor = valor.replace(/^(\d{0,2})$/, '($1');
    }

    // Atualiza o valor do input
    telfixoinput.value = valor;

    // Validação do formato: 14 caracteres (incluindo os espaços e hifens) e número começando com 2-9 após o DDD
    if (telfixoRegex.test(telfixoinput.value)) {
        telfixoinput.classList.add('valid');
        telfixoinput.classList.remove('invalid');
    } else {
        telfixoinput.classList.remove('valid');
        telfixoinput.classList.add('invalid');
    }
});



// Adiciona o evento de input no campo telefone-celular-medico
document.getElementById('telefone-fixo-medico').addEventListener('input', function () {
    formatarTelefoneCelular(this);
});

function exibirAlertaCampo(campo, mensagem) {
    // Define a mensagem de erro personalizada
    campo.setCustomValidity(mensagem);
    
    // Força o campo a exibir a mensagem
    campo.reportValidity();
    
    // Remove a mensagem personalizada após a exibição
    setTimeout(() => {
        campo.setCustomValidity(''); // Limpa a mensagem personalizada
    }, 3000); // A mensagem de erro desaparece após 3 segundos
}





document.getElementById('chk-obs-pessoal').addEventListener('change', function() {
    const obsPessoalDiv = document.getElementById('obs-pessoal');
    if (this.checked) {
        obsPessoalDiv.style.display = 'block';
    } else {
        obsPessoalDiv.style.display = 'none';
    }
});
// #endregion

//#region Funções de validação do endereço
// Função para formatar o CEP
function formatarCEP(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres que não sejam dígitos

    // Limita o valor a 8 dígitos (CEP)
    if (valor.length > 8) {
        valor = valor.substring(0, 8);
    }

    // Aplica a formatação progressivamente
    if (valor.length > 5) {
        valor = valor.replace(/^(\d{5})(\d{0,3})$/, '$1-$2');
    }

    // Atualiza o valor do input
    input.value = valor;
}

//#region Função para buscar o endereço pelo CEP
// Função para buscar o endereço pelo CEP
async function buscarEndereco(cep) {
    const cpfModal = document.getElementById('modal-validation'); // Modal CPF
    const cpfModalcontent = document.getElementById('modal-content-cpf'); // Conteúdo do Modal
    const loader = document.getElementById('loader-valida');
    const modalheadermsg = document.getElementById('modal-header'); 
    const modalMessages = document.getElementById('modal-messages');
    try {
        // Exibir o modal e o loader
        cpfModalcontent.classList.remove('valid');
        cpfModalcontent.classList.remove('invalid');
        cpfModalcontent.classList.add('validando');
        cpfModal.style.display = 'block';
        loader.style.display = 'block';
        modalheadermsg.innerHTML = 'Validando CEP';

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        // Atualiza a mensagem do modal para "CEP Válido" após 2 segundos
        setTimeout(function() {
            cpfModalcontent.classList.remove('validando');
            cpfModalcontent.classList.add('valid');
            cpfModal.style.display = 'block';
            modalheadermsg.innerHTML = 'CEP Válido';
        
            loader.style.display = 'block';

            // Preenche os campos de endereço e adiciona classe 'valid' somente nos campos preenchidos
            const ruaInput = document.getElementById('rua-medico');
            const bairroInput = document.getElementById('bairro-medico');
            const cidadeInput = document.getElementById('cidade-medico');
            const estadoInput = document.getElementById('estado-medico');
            const cepInput = document.getElementById('cep-medico');

            // Rua
            if (data.logradouro && data.logradouro.trim() !== '') {
                ruaInput.value = data.logradouro;
                ruaInput.classList.add('valid');
            } else {
                ruaInput.value = ''; // Opcional: limpe o campo se desejar
                ruaInput.classList.remove('valid');
            }

            // Bairro
            if (data.bairro && data.bairro.trim() !== '') {
                bairroInput.value = data.bairro;
                bairroInput.classList.add('valid');
            } else {
                bairroInput.value = '';
                bairroInput.classList.remove('valid');
            }

            // Cidade
            if (data.localidade && data.localidade.trim() !== '') {
                cidadeInput.value = data.localidade;
                cidadeInput.classList.add('valid');
            } else {
                cidadeInput.value = '';
                cidadeInput.classList.remove('valid');
            }

            // Estado
            if (data.uf && data.uf.trim() !== '') {
                estadoInput.value = data.uf;
                estadoInput.classList.add('valid');
            } else {
                estadoInput.value = '';
                estadoInput.classList.remove('valid');
            }
            cepInput.classList.remove('invalid');
            cepInput.classList.add('valid');
            // Ocultar o modal após mais 2 segundos
            setTimeout(function() {
                cpfModal.style.display = 'none';
            }, 2000); // 2 segundos
        }, 2000); // 2 segundos

    } catch (error) {
        const ruaInput = document.getElementById('rua-medico');
            const bairroInput = document.getElementById('bairro-medico');
            const cidadeInput = document.getElementById('cidade-medico');
            const estadoInput = document.getElementById('estado-medico');
            const cepInputmsg = document.getElementById('cep-medico');
        // Atualiza a mensagem do modal para erro
        cpfModalcontent.classList.remove('valid');
        cpfModalcontent.classList.remove('validando');
        cpfModalcontent.classList.add('invalid');
        loader.style.display = 'block';
        modalheadermsg.innerHTML = 'CEP Inválido';
        cepInputmsg.classList.remove('valid');
        cepInputmsg.classList.add('invalid');
        ruaInput.value = '';
        ruaInput.classList.remove('valid');
        bairroInput.value = '';
        bairroInput.classList.remove('valid');
        cidadeInput.value = '';
        cidadeInput.classList.remove('valid');
        estadoInput.value = '';
        estadoInput.classList.remove('valid');

        // Ocultar o modal e o loader após 1,5 segundos
        setTimeout(function() {
            cpfModal.style.display = 'none';
            loader.style.display = 'none';
        }, 1500); // 1,5 segundos
    }
}

// Adiciona o evento de input no campo CEP para formatação
document.getElementById('cep-medico').addEventListener('input', function () {
    formatarCEP(this);
});

// Adiciona o evento de blur no campo CEP para buscar o endereço
document.getElementById('cep-medico').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, ''); // Remove todos os caracteres que não sejam dígitos
    if (cep.length === 8) {
        buscarEndereco(cep);
    }
});
            const ruaInput = document.getElementById('rua-medico');
            const bairroInput = document.getElementById('bairro-medico');
            const cidadeInput = document.getElementById('cidade-medico');
            const estadoInput = document.getElementById('estado-medico'); 
            const cepcampo = document.getElementById('cep-medico');
            const numeroInput = document.getElementById('numero-medico');
const enderecoInputs = [ruaInput, bairroInput, cidadeInput, estadoInput, cepcampo];
enderecoInputs.forEach(function(input) {
    input.addEventListener('input', function() {
        if (this.value === '') {
            // Remove as classes 'valid' e 'invalid'
            this.classList.remove('valid', 'invalid');
        }
    });
});



// Adiciona estilo preenchido ou vazio nos campos de endereço
enderecoInputs.forEach(function(input) {
    input.addEventListener('input', function() {
        if (this.value !== '') {
            this.classList.remove('invalid');
            this.classList.add('valid');
            } else {
            this.classList.remove('valid', 'invalid');
        }    
    });
});

// Permite apenas numero no campo numero endereço
    numeroInput.addEventListener('input', function() {
        // Remove caracteres não numéricos
        this.value = this.value.replace(/\D/g, '');

        // Verifica se o campo contém um valor numérico
        if (this.value !== '') {
            this.classList.remove('invalid'); // Remove a classe 'invalid'
            this.classList.add('valid');       // Adiciona a classe 'valid'
        } else {
            // Campo vazio
            this.classList.remove('valid', 'invalid'); // Remove ambas as classes
        }
    });








//#endregion

//#region Campos informações adicionais 

// Seleciona o elemento select e os componentes
const selectfatauramento = document.getElementById('tipo-faturamento');
const titulodadosbancarios = document.getElementById('componente1');
const divdadosbancarios = document.getElementById('componente2');

// Adiciona um ouvinte de eventos para o evento 'change'
selectfatauramento.addEventListener('change', function() {
    if (this.value === 'Clinica') {
        // Exibe os componentes
        componente1.classList.remove('hidden');
        componente2.classList.remove('hidden');
    } else {
        // Oculta os componentes
        componente1.classList.add('hidden');
        componente2.classList.add('hidden');
    }
});

//#endregion