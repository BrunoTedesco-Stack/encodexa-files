// Exibe o modal de erro
export function exibirModalErro(mensagem, campo) {
    const modal = document.getElementById("modal-validation");
    const modalMessages = document.getElementById("modal-messages");

    modalMessages.innerText = mensagem;
    modal.style.display = "block";

    if (campo) {
        campo.classList.add('input-error');
    }
}

// Remove o erro visual ao corrigir
export function removerErro(campo) {
    campo.classList.remove('input-error');
}

// Função para fechar o modal
export function closeModal() {
    const modal = document.getElementById("modal-validation");
    modal.style.display = "none";
}
