import { verificarTodosCampos } from './validation.js';
import { enviarDadosFormulario } from './firebase.js';

// Função principal para o envio de dados
document.getElementById('formulario-exame').addEventListener('submit', function (e) {
    e.preventDefault();
    if (verificarTodosCampos()) {
        const formData = {
            activationCode: document.getElementById('activation-code').value,
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cep: document.getElementById('cep').value,
            rua: document.getElementById('rua').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            medico: document.getElementById('medico-search').value,
            terms: document.getElementById('terms').checked
        };
        
        enviarDadosFormulario(formData);
    }
});