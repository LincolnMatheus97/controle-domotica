import { createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { attDispositivo, criarDispositivo, excluirDispositivo, listarDispositivosPorComodo } from "../api/dispositivos.js";

export async function renderizarDispositivos(comodoId, container) {
    container.innerHTML = '<p>Carregando Dispositivos...</p>';

    const dispositivos = await listarDispositivosPorComodo(comodoId);

    container.innerHTML = '';

    if (dispositivos.length === 0) {
        container.innerHTML = '<p>Nenhum dispositivo cadastrado neste cômodo.</p>';
    } else {
        dispositivos.forEach(dispositivo => {
            const dispositivoEl = createByElem('div');
            dispositivoEl.className = 'dispositivo-item';
            dispositivoEl.dataset.dispositivoId = dispositivo.id;
            dispositivoEl.innerHTML = `
                <span>${dispositivo.nome}</span>
                <div class="dispositivo-actions"> 
                    <button class="btn btn-sm btn-warning">Editar</button>
                    <button class="btn btn-sm btn-danger">Excluir</button>
                </div>
            `;
            container.appendChild(dispositivoEl);
        });
    }

    const formAdicionar = createByElem('div');
    formAdicionar.className = 'form-container';
    formAdicionar.style.marginTop = '15px';
    formAdicionar.innerHTML = `
        <input type="text" class="novo-dispositivo-nome" placeholder="Novo dispositivo">
        <button class="btn btn-primary btn-sm btn-add-dispositivo">Adicionar</button>
    `;
    container.appendChild(formAdicionar);
}

export async function lidarAcoesDosDispositivos(event) {
    const target = event.target;
    const dispositivoItem = target.closest('.dispositivo-item');
    if (!dispositivoItem) return;

    const dispositivoId = dispositivoItem.dataset.dispositivoId;

    if (target.classList.contains('btn-danger')) {
        const confirmado = await abrirModalConfirmacao("Tem certeza que deseja excluir esse dispositivo? Ele será removido permanentemente.");
        if (confirmado) {
            lidarExcluirDispositivo(dispositivoId, dispositivoItem);
        }
    }

    if (target.classList.contains('btn-warning')) {
        ativarModoEdicao(dispositivoItem);
    }

    if (target.classList.contains('btn-success')) {
        lidarSalvarEdicao(dispositivoItem, dispositivoId);
    }

    if (target.classList.contains('btn-secondary')) {
        const comodoItem = dispositivoItem.closest('.comodo-item');
        const comodoId = comodoItem.dataset.comodoId;
        const container = comodoItem.querySelector('.dispositivos-container');
        renderizarDispositivos(comodoId, container);
    }
    return;
}

function atualizarContadorDispositivos(comodoItem) {
    if (!comodoItem) return;
    const countBadge = comodoItem.querySelector('.device-count-badge');
    const deviceItems = comodoItem.querySelectorAll('.dispositivo-item');
    if (countBadge) {
        countBadge.textContent = `${deviceItems.length} disp.`;
    }
}

async function lidarExcluirDispositivo(id, dispositivoItem) {
    const comodoItem = dispositivoItem.closest('.comodo-item');
    const sucesso = await excluirDispositivo(id);
    if (sucesso) {
        mostrarNotificacao('Dispositivo excluído com sucesso!', 'sucesso');
        dispositivoItem.remove();
        atualizarContadorDispositivos(comodoItem);
    } else {
        mostrarNotificacao('Falha ao excluir o dispositivo.', 'erro');
    }
}

function ativarModoEdicao(dispositivoItem) {
    const nomeSpan = dispositivoItem.querySelector('span');
    const actionsDiv = dispositivoItem.querySelector('.dispositivo-actions');
    const nomeAtual = nomeSpan.textContent;

    nomeSpan.style.display = 'none';
    actionsDiv.style.display = 'none';

    const inputEdicao = createByElem('input');
    inputEdicao.type = 'text';
    inputEdicao.value = nomeAtual;
    inputEdicao.style.flexGrow = '1';
    inputEdicao.style.padding = '5px';
    inputEdicao.style.border = '1px solid #ddd';
    inputEdicao.style.borderRadius = '5px';

    const novaActionsDiv = createByElem('div');
    novaActionsDiv.className = 'dispositivo-actions-edicao'; 
    novaActionsDiv.innerHTML = `
        <button class="btn btn-sm btn-success">Salvar</button>
        <button class="btn btn-sm btn-secondary">Cancelar</button>
    `;

    dispositivoItem.prepend(inputEdicao);
    dispositivoItem.appendChild(novaActionsDiv);

    inputEdicao.focus();
}

async function lidarSalvarEdicao(dispositivoItem, id) {
    const input = dispositivoItem.querySelector('input');
    const novoNome = input.value.trim();

    if (!novoNome) {
        mostrarNotificacao('O nome do dispositivo não pode ser vazio.', 'erro');
        return;
    }

    const dispositivoAtualizado = await attDispositivo(id, novoNome);
    if (dispositivoAtualizado) {
        mostrarNotificacao('Dispositivo atualizado com sucesso!', 'sucesso');
        const comodoItem = dispositivoItem.closest('.comodo-item');
        const comodoId = comodoItem.dataset.comodoId;
        const container = comodoItem.querySelector('.dispositivos-container');
        renderizarDispositivos(comodoId, container);
    } else {
        mostrarNotificacao('Falha ao atualizar o Dispositivo.', 'erro');
    }
}

export async function lidarAdicionarDispositivo(event) {
    const target = event.target;
    const comodoItem = target.closest('.comodo-item');
    const comodoId = comodoItem.dataset.comodoId;
    const container = comodoItem.querySelector('.dispositivos-container');
    
    const inputNome = container.querySelector('.novo-dispositivo-nome');
    const nomeDispositivo = inputNome.value.trim();

    if (!nomeDispositivo) {
        mostrarNotificacao('Por favor, digite o nome do dispositivo.', 'erro');
        return;
    }

    const novoDispositivo = await criarDispositivo(comodoId, nomeDispositivo);
    
    if (novoDispositivo) {
        mostrarNotificacao('Dispositivo adicionado com sucesso!', 'sucesso');
        await renderizarDispositivos(comodoId, container);
        atualizarContadorDispositivos(comodoItem);
    } else {
        mostrarNotificacao('Falha ao adicionar o dispositivo.', 'erro');
    }
}