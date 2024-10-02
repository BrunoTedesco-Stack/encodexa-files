import { database } from './firebase-config.js';

// Função para enviar os dados do formulário ao Firebase
export function enviarDadosFormulario(formData) {
    const newFormEntry = database.ref('formularios-exames').push();
    newFormEntry.set(formData)
        .then(() => {
            exibirModalErro('Formulário enviado com sucesso!');
        })
        .catch((error) => {
            exibirModalErro('Erro ao enviar os dados: ' + error.message);
        });
}
