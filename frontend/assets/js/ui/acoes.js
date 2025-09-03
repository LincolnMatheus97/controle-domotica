/**
 * Arquivo de manipulação de DOM para interface de usuário para as ações
*/

import { listarAcoesPorCena, criarAcao, excluirAcao, attAcao } from "../api/acoes.js";
import { listarComodos } from "../api/comodos.js";
import { listarTodosDispositivos } from "../api/dispositivos.js";
import { createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { redesenharListaDeCenas } from "./cenas.js";

/**
 * @description Função para renderizar as ações de uma cena
 * @param {string} cenaId - O ID da cena
 * @param {HTMLElement} container - O contêiner onde as ações serão renderizadas
 * @returns {Promise<void>}
*/
export async function renderizarAcoes(cenaId, container) {
    container.innerHTML = '<p>Carregando Ações...</p>';

    // Carregar as ações, dispositivos e cômodos
    const [acoes, dispositivos, comodos] = await Promise.all([
        listarAcoesPorCena(cenaId),
        listarTodosDispositivos(),
        listarComodos()
    ]);

    // Mapear os cômodos
    const comodosMap = new Map(comodos.map(c => [c.id, c.nome]));

    container.innerHTML = '';

    // Verificar se há ações
    if (acoes.length === 0) {
        container.innerHTML = '<p>Nenhuma ação cadastrada nesta cena.</p>';
    } else {

        const titulo = createByElem('h3');
        titulo.textContent = 'Sequência de ações';
        titulo.style.marginBottom = '10px';
        titulo.className = 'titulo-acoes'
        container.appendChild(titulo);

        // Renderizar as ações
        acoes.forEach(acao => {
            const dispositivo = dispositivos.find(d => d.id === acao.dispositivo_id);
            const nomeDispositivo = dispositivo ? dispositivo.nome : `ID ${acao.dispositivo_id} (não encontrado)`;
            const nomeComodo = dispositivo ? ((comodosMap.get(dispositivo.comodo_id)) || 'N/A') : '';
            const optionsDispositivosEdicao = dispositivos.map(d => {
                const comodoNome = comodosMap.get(d.comodo_id) || 'N/A';
                return `<option value="${d.id}" ${d.id === acao.dispositivo_id ? 'selected' : ''}>${d.nome} (${comodoNome})</option>`;
            }).join('');
            const acaoEl = createByElem('div');
            acaoEl.className = 'acao-item';
            acaoEl.dataset.acaoId = acao.id;

            // Criar contêiner para a ação
            const ctnAcao = createByElem('div')
            ctnAcao.className = 'ctn-acao'

            // Adicionar a ação ao contêiner
            acaoEl.innerHTML = `
                <div class="view-mode">
                    <div class='acao-info'>
                        <div class='title-ordem'><span>${acao.ordem} Ordem</span></div>
                        <span>Ação: <strong>${acao.acao ? 'Ligar' : 'Desligar'}</strong></span>
                        ${nomeDispositivo} em (${nomeComodo}) - (intervalo: ${acao.intervalo_segundos || 0}s)
                    </div>
                    <div class="acao-actions">
                        <button class="btn btn-sm btn-secondary btn-editar-acao">Editar</button>
                        <button class="btn btn-sm btn-danger btn-excluir-acao">Excluir</button>
                    </div>
                </div>
                <div class="edit-mode hidden">
                    <input type="number" class="edit-acao-ordem" value="${acao.ordem}" style="width: 60px;">
                    <select class="edit-acao-dispositivo-id">
                        ${optionsDispositivosEdicao}
                    </select>
                    <select class="edit-acao-acao">
                        <option value="true" ${acao.acao ? 'selected' : ''}>Ligar</option>
                        <option value="false" ${!acao.acao ? 'selected' : ''}>Desligar</option>
                    </select>
                    <input type="number" class="edit-acao-intervalo" value="${acao.intervalo_segundos || 0}" style="width: 80px;">
                    <div class="acao-actions">
                        <button class="btn btn-sm btn-success btn-salvar-acao">Salvar</button>
                        <button class="btn btn-sm btn-secondary btn-cancelar-edicao-acao">Cancelar</button>
                    </div>
                </div>
            `;
            ctnAcao.appendChild(acaoEl)
            container.appendChild(ctnAcao);
        });
    }

    // Criar formulário para adicionar nova ação
    const formAdicionar = createByElem('div');
    formAdicionar.className = 'form-container-grid';
    formAdicionar.style.marginTop = '15px';

    // Criar lista de opções para dispositivos, que será usada no formulário de adição
    const optionsDispositivosAdicionar = dispositivos.map(d => {
        const comodoNome = comodosMap.get(d.comodo_id) || 'N/A';
        return `<option value="${d.id}">${d.nome} (${comodoNome})</option>`;
    }).join('');

    // Adicionar o formulário ao contêiner
    formAdicionar.innerHTML = `
        <h2>Adicionar ação</h2>
        <span>Número de ordem</span>
        <input type="number" class="nova-acao-ordem" placeholder="Ordem" style="width: 100px;">
        <span>Tipo de dispositivo</span>
        <select class="nova-acao-dispositivo-id">
            <option value="">Selecione o Dispositivo</option>
            ${optionsDispositivosAdicionar}
        </select>
        <span>Modo</span>
        <select class="nova-acao-acao">
            <option value="true">Ligar</option>
            <option value="false">Desligar</option>
        </select>
        <span>Intervalo</span>
        <input type="number" class="nova-acao-intervalo" placeholder="Intervalo (s)" value="0" style="width: 120px;">
        <button class="btn btn-primary btn-sm btn-add-acao">Adicionar Ação</button>
    `;
    container.appendChild(formAdicionar);
}

/**
 * @description Função para lidar com a adição de uma nova ação, incluindo uma lógica de pilha para ordenar as ações
 * @param {Event} event - O evento de clique
 * @returns {Promise<void>}
*/
export async function lidarAddAcao(event) {
    event.stopPropagation();

    const target = event.target;
    const cenaItem = target.closest('.cena-item');
    const cenaId = cenaItem.dataset.cenaId;
    const container = cenaItem.querySelector('.acoes-container');

    const ordemInput = container.querySelector('.nova-acao-ordem');
    const dispositivoIdInput = container.querySelector('.nova-acao-dispositivo-id');
    const acaoInput = container.querySelector('.nova-acao-acao');
    const intervaloInput = container.querySelector('.nova-acao-intervalo');

    // Validar campos obrigatórios
    if (!ordemInput.value || !dispositivoIdInput.value) {
        mostrarNotificacao('Preencha a ordem e selecione um dispositivo.', 'erro');
        return;
    }

    const todasAcoes = await listarAcoesPorCena(cenaId);
    const ordemDesejada = parseInt(ordemInput.value);
    const acaoConflitante = todasAcoes.find(a => a.ordem === ordemDesejada);

    // Verificar se há ações conflitantes
    let ordemParaCriar = ordemDesejada;
    if (acaoConflitante) {
        await empilharOrdenacao(cenaId, ordemDesejada,'+');
        mostrarNotificacao(`Ordem ${ordemDesejada} já existe. As ações foram reordenadas.`, 'info', 4000);
    }

    // Criar nova ação
    const novaAcao = await criarAcao(
        cenaId,
        dispositivoIdInput.value,
        acaoInput.value === 'true',
        intervaloInput.value,
        ordemParaCriar
    );

    // Verificar se a nova ação foi criada com sucesso
    if (novaAcao) {
        mostrarNotificacao('Ação adicionada com sucesso!', 'sucesso');
        await redesenharListaDeCenas();
    } else {
        mostrarNotificacao('Falha ao adicionar a ação.', 'erro');
    }
}

/**
 * @description Função para lidar com as ações das ações (edição, exclusão, etc.)
 * @param {Event} event - O evento de clique
 * @returns {Promise<void>}
*/
export async function lidarAcoesDasAcoes(event) {
    event.stopPropagation();

    const target = event.target;
    const acaoItem = target.closest('.acao-item');
    if (!acaoItem) return;

    const acaoIdAtual = acaoItem.dataset.acaoId;
    const cenaItem = target.closest('.cena-item');
    const cenaId = cenaItem.dataset.cenaId;

    const viewMode = acaoItem.querySelector('.view-mode');
    const editMode = acaoItem.querySelector('.edit-mode');

    // Lógica para exclusão de ação
    if (target.classList.contains('btn-excluir-acao')) {
        const confirmado = await abrirModalConfirmacao("Tem certeza que deseja excluir esta ação?");
        if (confirmado) {
            const sucesso = await excluirAcao(acaoIdAtual);
            if (sucesso) {
                mostrarNotificacao('Ação excluída com sucesso!', 'sucesso');
                await redesenharListaDeCenas(); 
            } else {
                mostrarNotificacao('Falha ao excluir a ação.', 'erro');
            }
        }

    // Lógica para edição de ação
    } else if (target.classList.contains('btn-editar-acao')) {
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');

    // Lógica para cancelar edição de ação
    } else if (target.classList.contains('btn-cancelar-edicao-acao')) {
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');

    // Lógica para salvar edição de ação
    } else if (target.classList.contains('btn-salvar-acao')) {
        const novaOrdem = parseInt(acaoItem.querySelector('.edit-acao-ordem').value);
        const dispositivoId = acaoItem.querySelector('.edit-acao-dispositivo-id').value;
        const acao = acaoItem.querySelector('.edit-acao-acao').value === 'true';
        const intervalo = acaoItem.querySelector('.edit-acao-intervalo').value;

        // Verifica se a edição da ordem é válida
        await trocarOuAtualizarOrdemAcao({
            cenaId,
            acaoIdAtual,
            novaOrdem,
            dispositivoId,
            acao,
            intervalo
        });
    }
}

/**
 * @description Função para trocar ou atualizar a ordem de uma ação
 * @param {Object} param - Os parâmetros da função
 * @param {string} param.cenaId - O ID da cena
 * @param {string} param.acaoIdAtual - O ID da ação atual
 * @param {number} param.novaOrdem - A nova ordem da ação
 * @param {string} param.dispositivoId - O ID do dispositivo
 * @param {boolean} param.acao - O valor da ação
 * @param {number} param.intervalo - O intervalo da ação
 * @returns {Promise<void>}
*/
async function trocarOuAtualizarOrdemAcao({ cenaId, acaoIdAtual, novaOrdem, dispositivoId, acao, intervalo }) {
    const todasAcoes = await listarAcoesPorCena(cenaId);

    const acaoAtual = todasAcoes.find(a => a.id == acaoIdAtual);
    const ordemAntiga = acaoAtual ? acaoAtual.ordem : null;

    // Verifica se há ações conflitantes
    if (ordemAntiga !== null && novaOrdem === ordemAntiga) {
        const sucesso = await attAcao(acaoIdAtual, acao, intervalo, novaOrdem, dispositivoId);
        if (sucesso) mostrarNotificacao('Ação atualizada com sucesso!', 'sucesso');
        else mostrarNotificacao('Falha ao atualizar a ação.', 'erro');
        await redesenharListaDeCenas();
        return;
    }

    mostrarNotificacao(`Ordem ${novaOrdem} já existe. As ações foram reordenadas.`, 'info', 4000);

    // Reordena as ações se a nova ordem for menor que a antiga
    if (novaOrdem < ordemAntiga) {
        await empilharOrdenacao(cenaId, novaOrdem, '+');

    // Reordena as ações se a nova ordem for maior que a antiga
    } else if (novaOrdem > ordemAntiga) {
        await empilharOrdenacao(cenaId, ordemAntiga, '-', novaOrdem);
    }

    const sucesso = await attAcao(acaoIdAtual, acao, intervalo, novaOrdem, dispositivoId);
    if (sucesso) {
        mostrarNotificacao('Ação atualizada e ordens ajustadas!', 'sucesso');
    } else {
        mostrarNotificacao('Falha ao atualizar a ação.', 'erro');
    }
    await redesenharListaDeCenas();
}

/**
 * @description Função para empilhar a ordenação das ações
 * @param {string} cenaId - O ID da cena
 * @param {number} ordemInicial - A ordem inicial das ações
 * @param {string} sinal - O sinal de empilhamento ('+' ou '-')
 * @param {number} [ordemfinal] - A ordem final das ações (opcional)
*/
async function empilharOrdenacao(cenaId, ordemInicial, sinal, ordemfinal = null) {
    const todasAcoes = await listarAcoesPorCena(cenaId);

    // Verifica se há ações afetadas
    if (sinal === '+') {
        const afetadas = todasAcoes
            .filter(a => a.ordem >= ordemInicial)
            .sort((a, b) => b.ordem - a.ordem);
        for (const acao of afetadas) {
            await attAcao(acao.id, acao.acao, acao.intervalo_segundos, acao.ordem + 1, acao.dispositivo_id);
        }

    // Reordena as ações se a nova ordem for maior que a antiga
    } else if (sinal === '-') {
        const afetadas = todasAcoes
            .filter(a => a.ordem > ordemInicial && a.ordem <= ordemfinal)
            .sort((a, b) => a.ordem - b.ordem);
        for (const acao of afetadas) {
            await attAcao(acao.id, acao.acao, acao.intervalo_segundos, acao.ordem - 1, acao.dispositivo_id);
        }
    }
}