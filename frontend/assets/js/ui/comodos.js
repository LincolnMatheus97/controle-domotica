import { getById, createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { listarComodos, criarComodo, excluirComodo, attComodo } from "../api/comodos.js";
import { renderizarDispositivos } from "./dispositivos.js";

const comodosListDiv = getById('comodos-list');
const novoComodoInput = getById('novo-comodo-nome');

async function redesenharListaDeComodos() {
    const idsExpandidos = new Set();
    document.querySelectorAll('.comodo-item.expanded').forEach(item => {
        idsExpandidos.add(item.dataset.comodoId);
    });

    await renderizarComodos();

    if (idsExpandidos.size > 0) {
        idsExpandidos.forEach(id => {
            const comodoParaExpandir = comodosListDiv.querySelector(`.comodo-item[data-comodo-id='${id}']`);
            if (comodoParaExpandir) {
                comodoParaExpandir.classList.add('expanded');
                const container = comodoParaExpandir.querySelector('.dispositivos-container');
                renderizarDispositivos(id, container);
            }
        });
    }
}

export async function renderizarComodos() {
    console.log("Renderizando comodos...");
    const comodos = await listarComodos();

    comodosListDiv.innerHTML = '';

    if (comodos.length === 0) {
        comodosListDiv.innerHTML = '<p>Nenhum cômodo cadastrado ainda.</p>';
        return;
    }

    comodos.forEach(comodo => {
        const comodoElement = createByElem('div');
        comodoElement.className = 'comodo-item';
        comodoElement.dataset.comodoId = comodo.id;

        const qntDispositivos = comodo.dispositivos ? comodo.dispositivos.length : 0;
        
        comodoElement.innerHTML = `
            <div class="comodo-header" style="width:100%; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                <span>${comodo.nome}</span>
                <div style="display: flex; align-items: center;">
                    <span class="device-count-badge">${qntDispositivos} disp.</span>
                    <div class="comodo-actions">
                        <button class="btn btn-sm btn-warning">Editar</button>
                        <button class="btn btn-sm btn-danger">Excluir</button>
                    </div>
                </div>
            </div>
            <div class="dispositivos-container"></div>
        `;
        comodosListDiv.appendChild(comodoElement);
    });
}

export async function lidarAcoesDosComodos(event) {
    const target = event.target;
    const comodoItem = target.closest('.comodo-item');
    if (!comodoItem) return;

    if (target.closest('.dispositivos-container')) {
        return; 
    }

    if (target.closest('.comodo-actions')) {
        const comodoId = comodoItem.dataset.comodoId;
        if (target.classList.contains('btn-danger')) {
            const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este cômodo? Todos os dispositivos serão perdidos.');
            if (confirmado) lidarExcluirComodo(comodoId);
        }
        if (target.classList.contains('btn-warning')) {
            ativarModoEdicao(comodoItem);
        }
        if (target.classList.contains('btn-success')) {
            lidarSalvarEdicao(comodoItem, comodoId);
        }
        if (target.classList.contains('btn-secondary')) {
            redesenharListaDeComodos();
        }
        return;
    }

    if (target.closest('.comodo-header')) {
        const comodoId = comodoItem.dataset.comodoId;
        const container = comodoItem.querySelector('.dispositivos-container');
        const isExpanded = comodoItem.classList.toggle('expanded');

        if (isExpanded && container.innerHTML === '') {
            renderizarDispositivos(comodoId, container);
        }
    }
}

async function lidarExcluirComodo(id) {
    const sucesso = await excluirComodo(id);
    if (sucesso) {
        mostrarNotificacao('Cômodo excluído com sucesso!', 'sucesso');
        redesenharListaDeComodos();
    } else {
        mostrarNotificacao('Falha ao excluir o cômodo.', 'erro');
    }
}

function ativarModoEdicao(comodoItem) {
    const header = comodoItem.querySelector('.comodo-header');
    const nomeAtual = header.querySelector('span').textContent;
    header.style.display = 'none';

    const formEdicao = createByElem('div');
    formEdicao.className = 'form-container';
    formEdicao.style.width = '100%';
    formEdicao.innerHTML = `
        <input type="text" value="${nomeAtual}" style="flex-grow: 1;">
        <div class="comodo-actions">
            <button class="btn btn-sm btn-success">Salvar</button>
            <button class="btn btn-sm btn-secondary">Cancelar</button>
        </div>
    `;
    comodoItem.insertBefore(formEdicao, comodoItem.querySelector('.dispositivos-container'));
    formEdicao.querySelector('input').focus();
}

async function lidarSalvarEdicao(comodoItem, id) {
    const input = comodoItem.querySelector('input');
    const novoNome = input.value.trim();

    if (!novoNome) {
        mostrarNotificacao('O nome do cômodo não pode ser vazio.', 'erro');
        return;
    }

    const comodoAtualizado = await attComodo(id, novoNome);
    if (comodoAtualizado) {
        mostrarNotificacao('Cômodo atualizado com sucesso!', 'sucesso');
        redesenharListaDeComodos();
    } else {
        mostrarNotificacao('Falha ao atualizar o cômodo.', 'erro');
    }
}

export async function lidarAddComodo() {
    const nome = novoComodoInput.value.trim();
    if (!nome) {
        mostrarNotificacao('Por favor, digite o nome do cômodo.', 'erro');
        return;
    }

    const novoComodo = await criarComodo(nome);
    if (novoComodo) {
        novoComodoInput.value = '';
        mostrarNotificacao('Cômodo criado com sucesso!', 'sucesso');
        redesenharListaDeComodos();
    } else {
        mostrarNotificacao('Não foi possível criar o cômodo.', 'erro');
    }
}