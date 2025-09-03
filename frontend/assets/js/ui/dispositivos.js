/**
 * Arquivo de manipulação de DOM para interface de usuário para os dispositivos
*/

import { createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { attDispositivo, attEstadoDispositivo, criarDispositivo, excluirDispositivo, listarDispositivosPorComodo } from "../api/dispositivos.js";
import { redesenharListaDeCenas } from "./cenas.js";

/**
 * @description Função para renderizar a lista de dispositivos em um cômodo
 * @param {string} comodoId - ID do cômodo
 * @param {HTMLElement} container - Container onde os dispositivos serão renderizados
*/
export async function renderizarDispositivos(comodoId, container) {
    container.innerHTML = '<p>Carregando Dispositivos...</p>';

    const dispositivos = await listarDispositivosPorComodo(comodoId);

    container.innerHTML = '';

    // Verifica se existem dispositivos
    if (dispositivos.length === 0) {
        container.innerHTML = '<p>Nenhum dispositivo cadastrado neste cômodo.</p>';
    } else {

        // Criar titulo so se ele ainda não existe no container
        if (!container.querySelector('.titulo-container-disp')) {
            const containerTituloDispositivo = document.createElement('div');
            const tituloDispositivo = document.createElement('h2');
            const iconeDispositivo = document.createElement('img');

            containerTituloDispositivo.className = 'titulo-container-disp';
            tituloDispositivo.textContent = 'Dispositivos inseridos';
            iconeDispositivo.src = './assets/img/dispositivo.png';
            iconeDispositivo.alt = 'icone dispositivo';

            containerTituloDispositivo.appendChild(iconeDispositivo);
            containerTituloDispositivo.appendChild(tituloDispositivo);
            container.appendChild(containerTituloDispositivo);
        }

        // Renderiza os dispositivos normal
        dispositivos.forEach(dispositivo => {
            const dispositivoEl = createByElem('div');
            dispositivoEl.className = 'dispositivo-item';
            dispositivoEl.dataset.dispositivoId = dispositivo.id;

            const estadoClasse = dispositivo.estado ? 'ligado' : 'desligado';
            const iconeLampada = dispositivo.estado ? 'lamp-ligado' : 'lamp-desligado'
            const textoBotaoToggle = dispositivo.estado ? 'Desativar' : 'Ativar';
            const iconeBotaoToggle = dispositivo.estado ? 'ativo' : 'inativo'
            const classeBotaoToggle = dispositivo.estado ? 'btn-secondary' : 'btn-success';
            
            dispositivoEl.innerHTML = `
                <div class="dispositivo-estado ${estadoClasse}">
                    <div class='icon-disp'>
                        <img src="./assets/img/${iconeLampada}.png" alt="icone lampada" width="30px">
                    </div>
                    <span>${dispositivo.nome}</span>
                    <div class="dispositivo-actions"> 
                        <button class="btn btn-sm ${classeBotaoToggle} btn-toggle-state"><img class="seta" src="./assets/img/${iconeBotaoToggle}.png" alt="icone ativo ou inativo" title="Ligar dispositivo"></button>
                        <button class="btn btn-sm btn-warning"><img class="seta" src="./assets/img/editar.png" alt="icone editar" title="Editar comodo"></button>
                        <button class="btn btn-sm btn-danger"><img class="seta" src="./assets/img/excluir.png" alt="icone excluir" title="Excluir comodo"></button>
                    </div>
                </div>
                `;
            container.appendChild(dispositivoEl);
        });
    }

    // Formulário para adicionar novo dispositivo
    const formAdicionar = createByElem('div');
    formAdicionar.className = 'form-container';
    formAdicionar.style.marginTop = '15px';
    formAdicionar.innerHTML = `
        <input type="text" class="novo-dispositivo-nome" placeholder="Novo dispositivo">
        <button class="btn btn-primary btn-sm btn-add-dispositivo">Adicionar</button>
    `;
    container.appendChild(formAdicionar);
}

/**
 * @description Função para desativar o modo de edição de um dispositivo
 * @param {HTMLElement} dispositivoItem - O item do dispositivo a ser desativado
*/
function desativarModoEdicao(dispositivoItem) {
    // Remove o formulário de edição, se existir
    const formEdicao = dispositivoItem.querySelector('.form-container.dispositivo-estado-edicao');
    if (formEdicao) {
        formEdicao.remove();
    }

    // Restaura o estado original
    const estadoDiv = dispositivoItem.querySelector('.dispositivo-estado');
    if (estadoDiv) {
        estadoDiv.style.display = 'flex';
    }
}

/**
 * @description Função para lidar com as ações dos dispositivos
 * @param {Event} event - O evento de clique
*/
export async function lidarAcoesDosDispositivos(event) {
    const target = event.target;
    const dispositivoItem = target.closest('.dispositivo-item');
    if (!dispositivoItem) return;

    const dispositivoId = dispositivoItem.dataset.dispositivoId;

    // Desativar modo de edição
    if (target.classList.contains('btn-secondary') && target.closest('.dispositivo-estado-edicao')) {
        desativarModoEdicao(dispositivoItem);
        return;
    }

    // Salvar edição
    if (target.classList.contains('btn-success') && target.closest('.dispositivo-estado-edicao')) {
        lidarSalvarEdicao(dispositivoItem, dispositivoId);
        return;
    }

    // Alternar estado do dispositivo ao clicar no botão de edição
    if (target.classList.contains('btn-toggle-state')) {
        const estadoDiv = dispositivoItem.querySelector('.dispositivo-estado');
        const isLigado = estadoDiv.classList.contains('ligado');
        const novoEstado = !isLigado;

        const sucesso = await attEstadoDispositivo(dispositivoId, novoEstado);

        // Atualiza a interface com base no novo estado
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

    // Excluir dispositivo
    if (target.classList.contains('btn-danger')) {
        const confirmado = await abrirModalConfirmacao("Tem certeza que deseja excluir esse dispositivo? Ele será removido permanentemente.");
        if (confirmado) {
            await lidarExcluirDispositivo(dispositivoId, dispositivoItem);
        }
    }

    // Ativar modo de edição
    if (target.classList.contains('btn-warning')) {
        ativarModoEdicao(dispositivoItem);
    }
}

/**
 * @description Função para atualizar o contador de dispositivos em um cômodo
 * @param {HTMLElement} comodoItem - O item do cômodo cujo contador deve ser atualizado
*/
function atualizarContadorDispositivos(comodoItem) {
    if (!comodoItem) return;
    const countBadge = comodoItem.querySelector('.device-count-badge');
    const deviceItems = comodoItem.querySelectorAll('.dispositivo-item');
    if (countBadge) {
        countBadge.textContent = `${deviceItems.length} dispositivos`;
    }
}

/**
 * @description Função para lidar com a exclusão de um dispositivo
 * @param {string} id - O ID do dispositivo a ser excluído
 * @param {HTMLElement} dispositivoItem - O item do dispositivo a ser excluído
 * @returns {Promise<void>}
*/
async function lidarExcluirDispositivo(id, dispositivoItem) {
    const comodoItem = dispositivoItem.closest('.comodo-item');
    const sucesso = await excluirDispositivo(id);
    if (sucesso) {
        mostrarNotificacao('Dispositivo excluído com sucesso!', 'sucesso');
        dispositivoItem.remove();
        atualizarContadorDispositivos(comodoItem);

        // Atualizar mensagem se ha dispositivos inseridos
        const container = comodoItem.querySelector('.dispositivos-container')
        const restantes = container.querySelectorAll('.dispositivo-item').length

        // Atualizar título se não houver mais dispositivos
        if(restantes === 0) {
            const titulo = container.querySelector('.titulo-container-disp')
            if(titulo){
                titulo.remove()
            }

            // Adicionar mensagem de "nenhum dispositivo"
            if(!container.querySelector('.msg-vazia')){
                const msg = createByElem('p')
                msg.className = 'msg-vazia'
                msg.textContent = 'Nenhum dispositivo cadastrado neste cômodo.'
                // Adicionar como primeiro
                container.prepend(msg)
            }
        }

        await redesenharListaDeCenas();

    } else {
        mostrarNotificacao('Falha ao excluir o dispositivo.', 'erro');
    }
}

/**
 * @description Função para ativar o modo de edição de um dispositivo
 * @param {HTMLElement} dispositivoItem - O item do dispositivo a ser editado
*/
function ativarModoEdicao(dispositivoItem) {
    const estadoDiv = dispositivoItem.querySelector('.dispositivo-estado');
    const nomeAtual = estadoDiv.querySelector('span').textContent;

    estadoDiv.style.display = 'none'; 

    // Criar formulário de edição
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

/**
 * @description Função para lidar com a confirmação da edição de um dispositivo
 * @param {HTMLElement} dispositivoItem - O item do dispositivo a ser editado
 * @param {string} id - O ID do dispositivo a ser editado
 * @returns {Promise<void>}
*/
async function lidarSalvarEdicao(dispositivoItem, id) {
    const input = dispositivoItem.querySelector('input');
    const novoNome = input.value.trim();

    // Verificar se o novo nome é válido
    if (!novoNome) {
        mostrarNotificacao('O nome do dispositivo não pode ser vazio.', 'erro');
        return;
    }

    // Atualizar dispositivo
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

/**
 * @description Função para lidar com a adição de um novo dispositivo
 * @param {Event} event - O evento de clique
 * @returns {Promise<void>}
*/
export async function lidarAddDispositivo(event) {
    const target = event.target;
    const comodoItem = target.closest('.comodo-item');
    const comodoId = comodoItem.dataset.comodoId;
    const container = comodoItem.querySelector('.dispositivos-container');
    
    const inputNome = container.querySelector('.novo-dispositivo-nome');
    const nomeDispositivo = inputNome.value.trim();

    // Verificar se o nome do dispositivo é válido
    if (!nomeDispositivo) {
        mostrarNotificacao('Por favor, digite o nome do dispositivo.', 'erro');
        return;
    }

    // Criar dispositivo
    const novoDispositivo = await criarDispositivo(comodoId, nomeDispositivo);

    // Verificar se o dispositivo foi criado com sucesso
    if (novoDispositivo) {
        mostrarNotificacao('Dispositivo adicionado com sucesso!', 'sucesso');
        await renderizarDispositivos(comodoId, container);
        await redesenharListaDeCenas(); // Atualiza a lista de cenas
        atualizarContadorDispositivos(comodoItem);
    } else {
        mostrarNotificacao('Falha ao adicionar o dispositivo.', 'erro');
    }
}