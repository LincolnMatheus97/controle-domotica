/**
* Arquivo de Funções utilitárias para manipulação do DOM
*/


/**
 * @description Exporta a URL da API a ser consumida
*/
export const API_URL = 'http://127.0.0.1:8000/api';

/**
 * @description Função para obter um elemento pelo ID
 * @param {string} id - ID do elemento a ser obtido
 * @returns {HTMLElement|null} - O elemento encontrado ou null
*/
export function getById(id) {
    return document.getElementById(id);
}

/**
 * @description Função para criar um elemento HTML
 * @param {string} tag - Nome da tag do elemento a ser criado
 * @returns {HTMLElement} - O elemento criado
*/
export function createByElem(tag) {
    return document.createElement(tag);
}

/**
 * @description Função para mostrar uma notificação na tela
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo da notificação (sucesso, erro, etc.)
 * @param {number} duracao - Duração em milissegundos antes da notificação desaparecer
*/
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

/**
 * @description Função para abrir um modal de confirmação
 * @param {string} message - Mensagem a ser exibida no modal
 * @returns {Promise<boolean>} - Retorna uma promessa que resolve para true se confirmado, ou false se cancelado
*/
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

/**
 * @description Função para travar ou destravar a interface do usuário
 * @param {boolean} travado - Indica se a UI deve ser travada ou destravada
*/
export function travarUI(travado) {
    document.body.classList.toggle('executando-cena', travado);
}