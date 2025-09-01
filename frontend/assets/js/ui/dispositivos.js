import { createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { attDispositivo, attEstadoDispositivo, criarDispositivo, excluirDispositivo, listarDispositivosPorComodo } from "../api/dispositivos.js";
import { redesenharListaDeCenas } from "./cenas.js";

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

            const estadoClasse = dispositivo.estado ? 'ligado' : 'desligado';
            const textoBotaoToggle = dispositivo.estado ? 'Desativar' : 'Ativar';
            const classeBotaoToggle = dispositivo.estado ? 'btn-secondary' : 'btn-success';
            
            dispositivoEl.innerHTML = `
                <div class="dispositivo-estado ${estadoClasse}">
                    <span>${dispositivo.nome}</span>
                    <div class="dispositivo-actions"> 
                        <button class="btn btn-sm ${classeBotaoToggle} btn-toggle-state">${textoBotaoToggle}</button>
                        <button class="btn btn-sm btn-warning">Editar</button>
                        <button class="btn btn-sm btn-danger">Excluir</button>
                    </div>
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

function desativarModoEdicao(dispositivoItem) {
    const formEdicao = dispositivoItem.querySelector('.form-container.dispositivo-estado-edicao');
    if (formEdicao) {
        formEdicao.remove();
    }

    const estadoDiv = dispositivoItem.querySelector('.dispositivo-estado');
    if (estadoDiv) {
        estadoDiv.style.display = 'flex';
    }
}

export async function lidarAcoesDosDispositivos(event) {
    const target = event.target;
    const dispositivoItem = target.closest('.dispositivo-item');
    if (!dispositivoItem) return;

    const dispositivoId = dispositivoItem.dataset.dispositivoId;

    if (target.classList.contains('toggle-estado')) {
        const novoEstado = target.checked;
        const sucesso = await attEstadoDispositivo(dispositivoId, novoEstado);
        if (!sucesso) {
            mostrarNotificacao('Falha ao alterar o estado do dispositivo.', 'erro');
            target.checked = !novoEstado;
        }
        return;
    }

    if (target.classList.contains('btn-secondary') && target.closest('.dispositivo-estado-edicao')) {
        desativarModoEdicao(dispositivoItem);
        return;
    }

    if (target.classList.contains('btn-success') && target.closest('.dispositivo-estado-edicao')) {
        lidarSalvarEdicao(dispositivoItem, dispositivoId);
        return;
    }

    if (target.classList.contains('btn-toggle-state')) {
        const estadoDiv = dispositivoItem.querySelector('.dispositivo-estado');
        const isLigado = estadoDiv.classList.contains('ligado');
        const novoEstado = !isLigado;

        const sucesso = await attEstadoDispositivo(dispositivoId, novoEstado);

        if (sucesso) {
            mostrarNotificacao(`Dispositivo ${novoEstado ? 'ativado' : 'desativado'} com sucesso!`, 'sucesso');
            const comodoItem = dispositivoItem.closest('.comodo-item');
            const comodoId = comodoItem.dataset.comodoId;
            const container = comodoItem.querySelector('.dispositivos-container');
            await renderizarDispositivos(comodoId, container);
        } else {
            mostrarNotificacao('Falha ao alterar o estado do dispositivo.', 'erro');
        }
        return;
    }

    if (target.classList.contains('btn-danger')) {
        const confirmado = await abrirModalConfirmacao("Tem certeza que deseja excluir esse dispositivo? Ele será removido permanentemente.");
        if (confirmado) {
            await lidarExcluirDispositivo(dispositivoId, dispositivoItem);
        }
    }

    if (target.classList.contains('btn-warning')) {
        ativarModoEdicao(dispositivoItem);
    }
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
        await redesenharListaDeCenas();
    } else {
        mostrarNotificacao('Falha ao excluir o dispositivo.', 'erro');
    }
}

function ativarModoEdicao(dispositivoItem) {
    const estadoDiv = dispositivoItem.querySelector('.dispositivo-estado');
    const nomeAtual = estadoDiv.querySelector('span').textContent;

    estadoDiv.style.display = 'none'; 

    const formEdicao = createByElem('div');
    formEdicao.className = 'form-container dispositivo-estado-edicao';
    formEdicao.style.padding = '10px 15px';
    formEdicao.innerHTML = `
        <input type="text" value="${nomeAtual}" style="flex-grow: 1;">
        <div class="dispositivo-actions">
            <button class="btn btn-sm btn-success">Salvar</button>
            <button class="btn btn-sm btn-secondary">Cancelar</button>
        </div>
    `;
    
    dispositivoItem.prepend(formEdicao);
    formEdicao.querySelector('input').focus();
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
        desativarModoEdicao(dispositivoItem);
        const comodoItem = dispositivoItem.closest('.comodo-item');
        const comodoId = comodoItem.dataset.comodoId;
        const container = comodoItem.querySelector('.dispositivos-container');
        await renderizarDispositivos(comodoId, container);
        await redesenharListaDeCenas();
    } else {
        mostrarNotificacao('Falha ao atualizar o Dispositivo.', 'erro');
    }
}

export async function lidarAddDispositivo(event) {
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
        await redesenharListaDeCenas();
        atualizarContadorDispositivos(comodoItem);
    } else {
        mostrarNotificacao('Falha ao adicionar o dispositivo.', 'erro');
    }
}