/**
 * Arquivo de manipulação de DOM para interface de usuário para os cômodos
*/

import { getById, createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { listarComodos, criarComodo, excluirComodo, attComodo } from "../api/comodos.js";
import { renderizarDispositivos } from "./dispositivos.js";
import { redesenharListaDeCenas } from "./cenas.js";

const comodosListDiv = getById('comodos-list');
const novoComodoInput = getById('novo-comodo-nome');

/**
 * @description Função para redesenhar a lista de cômodos
*/
export async function redesenharListaDeComodos() {
    // Obter IDs dos cômodos expandidos
    const idsExpandidos = new Set();
    document.querySelectorAll('.comodo-item.expanded').forEach(item => {
        idsExpandidos.add(item.dataset.comodoId);
    });

    // Renderizar a lista de cômodos
    await renderizarComodos();

    // Expandir os cômodos que estavam expandidos anteriormente
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

/**
 * @description Função para renderizar a lista de cômodos
*/
export async function renderizarComodos() {
    console.log("Renderizando comodos...");
    const comodos = await listarComodos();

    comodosListDiv.innerHTML = '';

    // Verifica se existem cômodos
    if (comodos.length === 0) {
        comodosListDiv.innerHTML = '<p>Nenhum cômodo cadastrado ainda.</p>';
        return;
    }

    // Renderiza os cômodos
    comodos.forEach(comodo => {
        const comodoElement = createByElem('div');
        comodoElement.className = 'comodo-item';
        comodoElement.dataset.comodoId = comodo.id;

        const qntDispositivos = comodo.dispositivos ? comodo.dispositivos.length : 0;
        
        comodoElement.innerHTML = `
            <div class="comodo-header" style="width:100%; display:flex; cursor:pointer;">
                <span class="comodo-nome">${comodo.nome}</span>
                <div style="display: flex; align-items: center;">
                    <span class="device-count-badge">${qntDispositivos} dispositivos</span>
                    <div class="comodo-actions">
                        <button class="btn btn-sm btn-warning">
                            <img class="seta" src="./assets/img/editar.png" alt="icone editar" title="Editar comodo" class="icon-button">
                        </button>
                        <button class="btn btn-sm btn-danger">
                            <img class="seta" src="./assets/img/excluir.png" alt="icone excluir" title="Excluir comodo" class="icon-button">
                        </button>
                    </div>
                </div>
            </div>
            <div class="dispositivos-container"></div>
            
        `;
        comodosListDiv.appendChild(comodoElement);
    });
}

/**
 * @description Função para desativar o modo de edição de um cômodo
 * @param {HTMLElement} comodoItem - O item do cômodo a ser desativado
*/
function desativarModoEdicaoComodo(comodoItem) {
    const formEdicao = comodoItem.querySelector('.form-container');
    if (formEdicao && !formEdicao.closest('.dispositivos-container')) {
        formEdicao.remove();
    }

    const header = comodoItem.querySelector('.comodo-header');
    if (header) {
        header.style.display = 'flex';
    }
}

/**
 * @description Função para lidar com as ações dos cômodos
 * @param {Event} event - O evento de clique
*/
export async function lidarAcoesDosComodos(event) {
    const target = event.target;
    const comodoItem = target.closest('.comodo-item');
    if (!comodoItem) return;

    // Verifica se o clique foi dentro da lista de dispositivos
    if (target.closest('.dispositivos-container')) {
        return; 
    }

    // Verifica se o clique foi dentro das ações do cômodo
    if (target.closest('.comodo-actions')) {
        const comodoId = comodoItem.dataset.comodoId;

        // Excluir cômodo
        if (target.classList.contains('btn-danger')) {
            const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir este cômodo? Todos os dispositivos serão perdidos.');
            if (confirmado) lidarExcluirComodo(comodoId);
        }

        // Editar cômodo
        if (target.classList.contains('btn-warning')) {
            ativarModoEdicao(comodoItem);
        }

        // Salvar edição
        if (target.classList.contains('btn-success')) {
            lidarSalvarEdicao(comodoItem, comodoId);
        }

        // Cancelar edição
        if (target.classList.contains('btn-secondary')) {
            desativarModoEdicaoComodo(comodoItem);
        }
        return;
    }

    // Verifica se o clique foi dentro do cabeçalho do cômodo
    if (target.closest('.comodo-header')) {
        const comodoId = comodoItem.dataset.comodoId;
        const container = comodoItem.querySelector('.dispositivos-container');
        const isExpanded = comodoItem.classList.toggle('expanded');

        if (isExpanded && container.innerHTML === '') {
            renderizarDispositivos(comodoId, container);
        }
    }
}

/**
 * @description Função para lidar com a exclusão de um cômodo
 * @param {string} id - O ID do cômodo a ser excluído
*/
async function lidarExcluirComodo(id) {
    const sucesso = await excluirComodo(id);
    if (sucesso) {
        mostrarNotificacao('Cômodo excluído com sucesso!', 'sucesso');
        redesenharListaDeComodos();
        await redesenharListaDeCenas();
    } else {
        mostrarNotificacao('Falha ao excluir o cômodo.', 'erro');
    }
}

/**
 * @description Função para ativar o modo de edição de um cômodo
 * @param {HTMLElement} comodoItem - O item do cômodo a ser editado
*/
function ativarModoEdicao(comodoItem) {
    const header = comodoItem.querySelector('.comodo-header');
    const nomeAtual = header.querySelector('span').textContent;
    header.style.display = 'none';

    // Cria o formulário de edição
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

/**
 * @description Função para lidar com a edição de um cômodo
 * @param {HTMLElement} comodoItem - O item do cômodo a ser editado
 * @param {string} id - O ID do cômodo a ser editado
*/
async function lidarSalvarEdicao(comodoItem, id) {
    const input = comodoItem.querySelector('input');
    const novoNome = input.value.trim();

    // Verifica se o novo nome é válido
    if (!novoNome) {
        mostrarNotificacao('O nome do cômodo não pode ser vazio.', 'erro');
        return;
    }

    // Atualiza o cômodo
    const comodoAtualizado = await attComodo(id, novoNome);

    // Verifica se a atualização foi bem-sucedida
    if (comodoAtualizado) {
        mostrarNotificacao('Cômodo atualizado com sucesso!', 'sucesso');
        await redesenharListaDeComodos(); // Atualiza a lista de cômodos
        await redesenharListaDeCenas();   // Atualiza a lista de cenas
    } else {
        mostrarNotificacao('Falha ao atualizar o cômodo.', 'erro');
    }
}

/**
 * @description Função para lidar com a adição de um novo cômodo
*/
export async function lidarAddComodo() {
    const nome = novoComodoInput.value.trim();

    // Verifica se o nome é válido
    if (!nome) {
        mostrarNotificacao('Por favor, digite o nome do cômodo.', 'erro');
        return;
    }

    // Cria o novo cômodo
    const novoComodo = await criarComodo(nome);

    // Verifica se a criação foi bem-sucedida
    if (novoComodo) {
        novoComodoInput.value = '';
        mostrarNotificacao('Cômodo criado com sucesso!', 'sucesso');
        redesenharListaDeComodos(); // Atualiza a lista de cômodos
    } else {
        mostrarNotificacao('Não foi possível criar o cômodo.', 'erro');
    }
}