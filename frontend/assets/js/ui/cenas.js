import { attCena, criarCena, excluirCena, listarCenas } from "../api/cenas.js";
import { getById, createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";

const cenasListDiv = getById('cenas-list');
const novaCenaInput = getById('nova-cena-nome');

async function redesenharListaDeCenas() {
    const idsExpandidos = new Set();
    document.querySelectorAll('.cena-item.expanded').forEach(item => {
        idsExpandidos.add(item.dataset.cenaId);
    });

    await renderizarCenas();

    if (idsExpandidos.size > 0) {
        idsExpandidos.forEach(id => {
            const cenasParaExpandir = cenasListDiv.querySelector(`.cena-item[data-cena-id='${id}']`);
            if (cenasParaExpandir) {
                cenasParaExpandir.classList.add('expanded');
                const container = cenasParaExpandir.querySelector('.acoes-container');
                // renderizarAcoes(id, container);
            }
        });
    } 
}

export async function renderizarCenas() {
    console.log("Renderizando cenas...");
    const cenas = await listarCenas();

    cenasListDiv.innerHTML = '';

    if (cenas.length === 0) {
        cenasListDiv.innerHTML = '<p>Nenhuma cena cadastrada ainda.</p>';
        return;
    }

    cenas.forEach(cena => {
        const cenasElement = createByElem('div');
        cenasElement.className = 'cena-item';
        cenasElement.dataset.cenaId = cena.id;

        const qntAcoes = cena.acoes ? cena.acoes.length : 0;

        cenasElement.innerHTML = `
            <div class="cena-header" style="width:100%; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                <span>${cena.nome}</span>
                <div style="display: flex; align-items: center;">
                    <span class="device-count-badge">${qntAcoes} ações</span>
                    <div class="cena-actions">
                        <button class="btn btn-sm btn-warning">Editar</button>
                        <button class="btn btn-sm btn-danger">Excluir</button>
                    </div>
                </div>
            </div>
            <div class="acoes-container"></div>
        `;
        cenasListDiv.appendChild(cenasElement);
    });
}

export async function lidarAcoesDasCenas(event) {
    const target = event.target;
    const cenaItem = target.closest('.cena-item');
    if (!cenaItem) return;

    if (target.closest('.acoes-container')) {
        return;
    }

    if (target.closest('.cena-actions')) {
        const cenaId = cenaItem.dataset.cenaId;
        if (target.classList.contains('btn-danger')) {
            const confirmado = await abrirModalConfirmacao('Tem certeza que deseja excluir esta cena? Todos as ações serão perdidas.');
            if (confirmado) lidarExcluirCena(cenaId);
        }
        if (target.classList.contains('btn-warning')) {
            ativarModoEdicao(cenaItem);
        }
        if (target.classList.contains('btn-success')) {
            lidarSalvarEdicao(cenaItem, cenaId);
        }
        if (target.classList.contains('btn-secondary')) {
            redesenharListaDeCenas();
        }
        return;
    }
    
    if (target.closest('.cena-header')) {
        const cenaId = cenaItem.dataset.cenaId;
        const container = cenaItem.querySelector('.acoes-container');
        const isExpanded = cenaItem.classList.toggle('expanded');

        if (isExpanded && container.innerHTML === '') {
            // renderizarAcoes(cenaId, container);
        }
    }
}

async function lidarExcluirCena(id) {
    const sucesso = await excluirCena(id);
    if (sucesso) {
        mostrarNotificacao('Cena excluída com sucesso!', 'sucesso');
        redesenharListaDeCenas();
    } else {
        mostrarNotificacao('Falha ao excluir a cena.', 'erro');
    }
}

function ativarModoEdicao(cenaItem) {
    const header = cenaItem.querySelector('.cena-header');
    const nomeAtual = header.querySelector('span').textContent;
    header.style.display = 'none';

    const formEdicao = createByElem('div');
    formEdicao.className = 'form-container';
    formEdicao.style.width = '100%';
    formEdicao.innerHTML = `
        <input type="text" value="${nomeAtual}" style="flex-grow: 1;">
        <div class="cena-actions">
            <button class="btn btn-sm btn-success">Salvar</button>
            <button class="btn btn-sm btn-secondary">Cancelar</button>
        </div>
    `;
    cenaItem.insertBefore(formEdicao, cenaItem.querySelector('.acoes-container'));
    formEdicao.querySelector('input').focus();
}

async function lidarSalvarEdicao(cenasItem, id) {
    const input = cenasItem.querySelector('input');
    const novoNome = input.value.trim();

    if (!novoNome) {
        mostrarNotificacao('O nome da cena não pode ser vazio.', 'erro');
        return;
    }

    const cenaAtualizado = await attCena(id, novoNome);
    if (cenaAtualizado) {
        mostrarNotificacao('Cena atualizada com sucesso!', 'sucesso');
        redesenharListaDeCenas();
    } else {
        mostrarNotificacao('Falha ao atualizar a cena.', 'erro');
    }
}

export async function lidarAddCena() {
    const nome = novaCenaInput.value.trim();
    if (!nome) {
        mostrarNotificacao('Por favor, digite o nome da cena.', 'erro');
        return;
    }

    const novaCena = await criarCena(nome);
    if (novaCena) {
        novaCenaInput.value = '';
        mostrarNotificacao('Cena criada com sucesso!', 'sucesso');
        redesenharListaDeCenas();
    } else {
        mostrarNotificacao('Não foi possível criar a cena.', 'erro');
    }
}