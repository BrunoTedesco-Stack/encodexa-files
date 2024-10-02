// Funções de validação

export function verificarTodosCampos() {
    let isValid = true;
    isValid = verificarCampo('activation-code', 'Por favor, insira o código de ativação.') && isValid;
    isValid = verificarNomeCompleto() && isValid;
    isValid = verificarCPF() && isValid;
    isValid = verificarEmail() && isValid;
    isValid = verificarTelefone() && isValid;
    isValid = verificarCEP() && isValid;
    isValid = verificarCampo('rua', 'Por favor, insira o nome da rua.') && isValid;
    isValid = verificarCampo('numero', 'Por favor, insira o número da residência.') && isValid;
    isValid = verificarCampo('bairro', 'Por favor, insira o bairro.') && isValid;
    isValid = verificarCampo('cidade', 'Por favor, insira a cidade.') && isValid;
    isValid = verificarCampo('medico-search', 'Por favor, selecione o médico responsável.') && isValid;
    isValid = verificarAceiteTermos() && isValid;

    return isValid;
}

// Verifica se o campo não está vazio
export function verificarCampo(id, mensagemErro) {
    const campo = document.getElementById(id);
    if (campo.value.trim().length === 0) {
        exibirModalErro(mensagemErro, campo);
        return false;
    } else {
        removerErro(campo);
        return true;
    }
}

// Verifica o nome completo
export function verificarNomeCompleto() {
    const nomeInput = document.getElementById('nome');
    const nome = nomeInput.value.trim();

    if (nome.split(" ").length < 2 || nome.length < 5) {
        exibirModalErro("Por favor, insira seu nome completo.", nomeInput);
        return false;
    } else {
        removerErro(nomeInput);
        return true;
    }
}

// Verifica CPF
export function verificarCPF() {
    const cpfInput = document.getElementById('cpf');
    const cpf = cpfInput.value.trim();

    if (cpf.length !== 11 || !/^\d+$/.test(cpf)) {
        exibirModalErro('Por favor, insira um CPF válido com 11 dígitos.', cpfInput);
        return false;
    } else {
        removerErro(cpfInput);
        return true;
    }
}

// Verifica email
export function verificarEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
        exibirModalErro('Por favor, insira um e-mail válido.', emailInput);
        return false;
    } else {
        removerErro(emailInput);
        return true;
    }
}

// Verifica telefone
export function verificarTelefone() {
    const telefoneInput = document.getElementById('telefone');
    const telefone = formatarTelefone(telefoneInput.value.trim());

    telefoneInput.value = telefone;

    const regexTelefone = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!regexTelefone.test(telefone)) {
        exibirModalErro('Por favor, insira um telefone válido.', telefoneInput);
        return false;
    } else {
        removerErro(telefoneInput);
        return true;
    }
}

// Verifica CEP
export function verificarCEP() {
    const cepInput = document.getElementById('cep');
    const cep = formatarCep(cepInput.value.trim());

    cepInput.value = cep;

    const regexCep = /^\d{5}-\d{3}$/;
    if (!regexCep.test(cep)) {
        exibirModalErro('Por favor, insira um CEP válido.', cepInput);
        return false;
    } else {
        removerErro(cepInput);
        return true;
    }
}

// Verifica se os termos foram aceitos
export function verificarAceiteTermos() {
    const termsInput = document.getElementById('terms');
    if (!termsInput.checked) {
        exibirModalErro('Você precisa aceitar os termos para continuar.', termsInput);
        return false;
    } else {
        removerErro(termsInput);
        return true;
    }
}
