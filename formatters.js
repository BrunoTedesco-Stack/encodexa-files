// Função para formatar telefone
export function formatarTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');

    if (telefone.length <= 10) {
        telefone = telefone.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }

    return telefone;
}

// Função para formatar CEP
export function formatarCep(cep) {
    cep = cep.replace(/\D/g, '');

    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
    }

    return cep;
}
