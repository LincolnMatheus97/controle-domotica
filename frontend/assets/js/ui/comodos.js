import { getById, createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { listarComodos, criarComodo, excluirComodo, attComodo } from "../api/comodos.js";

const comodosListDiv = getById('comodos-list');
const novoComodoInput = getById('novo-comodo-nome');

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
        
        comodoElement.innerHTML = `
            <span>${comodo.nome}</span>
            <div class="comodo-actions">
                <button class="btn btn-sm btn-warning">Editar</button>
                <button class="btn btn-sm btn-danger">Excluir</button>
            </div>
        `;
        comodosListDiv.appendChild(comodoElement);
    });
}

export async function lidarAcoesDosComodos(event) {
    const target = event.target;
    const comodoItem = target.closest('.comodo-item');
    if (!comodoItem) return;

    const comodoId = comodoItem.dataset.comodoId;

    if (target.classList.contains('btn-danger')) {
        const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este cômodo? Ele será removido permanentemente.');
        if (confirmado) {
            lidarExcluirComodo(comodoId);
        }
    }

    if (target.classList.contains('btn-warning')) {
        ativarModoEdicao(comodoItem);
    }

    if (target.classList.contains('btn-success')) {
        lidarSalvarEdicao(comodoItem, comodoId);
    }

    if (target.classList.contains('btn-secondary')) {
        renderizarComodos();
    }
}

async function lidarExcluirComodo(id) {
    const sucesso = await excluirComodo(id);
    if (sucesso) {
        mostrarNotificacao('Cômodo excluído com sucesso!', 'sucesso');
        renderizarComodos();
    } else {
        mostrarNotificacao('Falha ao excluir o cômodo.', 'erro');
    }
}

function ativarModoEdicao(comodoItem) {
    const nomeAtual = comodoItem.querySelector('span').textContent;
    comodoItem.innerHTML = `
        <input type="text" value="${nomeAtual}" class="form-container input[type='text']" style="flex-grow: 1;">
        <div class="comodo-actions">
            <button class="btn btn-sm btn-success">Salvar</button>
            <button class="btn btn-sm btn-secondary">Cancelar</button>
        </div>
    `;
    comodoItem.querySelector('input').focus();
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
    } else {
        mostrarNotificacao('Falha ao atualizar o cômodo.', 'erro');
    }
    renderizarComodos();
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
        renderizarComodos();
        mostrarNotificacao('Cômodo criado com sucesso!', 'sucesso');
    } else {
        mostrarNotificacao('Não foi possível criar o cômodo.', 'erro');
    }
}