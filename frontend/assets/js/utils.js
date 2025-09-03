export const API_URL = 'http://127.0.0.1:8000/api';

export function getById(id) {
    return document.getElementById(id);
}

export function createByElem(tag) {
    return document.createElement(tag);
}

export function mostrarNotificacao(mensagem, tipo = 'sucesso', duracao = 3000) {
    const container = getById('notificacao-container');
    
    if (!container) {
        return;
    }

    const notificacaoDiv = createByElem('div');
    notificacaoDiv.className = `notificacao ${tipo}`;
    notificacaoDiv.textContent = mensagem;

    container.appendChild(notificacaoDiv);

    setTimeout(() => {
        notificacaoDiv.classList.add('show');
    }, 10);

    setTimeout(() => {
        notificacaoDiv.classList.remove('show');

        notificacaoDiv.addEventListener('transitionend', () => {
            notificacaoDiv.remove();
        });
    }, duracao);
}

export function abrirModalConfirmacao(message) {
    const overlay = getById('confirm-modal-overlay');
    const messageP = getById('modal-message');
    const btnCancel = getById('btn-modal-cancel');
    const btnConfirm = getById('btn-modal-confirm');

    messageP.textContent = message;
    overlay.classList.remove('hidden');

    return new Promise(resolve => {
        const close = (confirmation) => {
            overlay.classList.add('hidden');
            btnConfirm.removeEventListener('click', onConfirm);
            btnCancel.removeEventListener('click', onCancel);
            overlay.removeEventListener('click', onOverlayClick);
            resolve(confirmation);
        };

        const onConfirm = () => close(true);
        const onCancel = () => close(false);
        const onOverlayClick = (event) => {
            if (event.target === overlay) {
                close(false);
            }
        };

        btnConfirm.addEventListener('click', onConfirm);
        btnCancel.addEventListener('click', onCancel);
        overlay.addEventListener('click', onOverlayClick);
    });
}

export function travarUI(travado) {
    document.body.classList.toggle('executando-cena', travado);
}