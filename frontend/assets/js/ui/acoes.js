import { listarAcoesPorCena, criarAcao, excluirAcao, attAcao } from "../api/acoes.js";
import { listarComodos } from "../api/comodos.js";
import { listarTodosDispositivos } from "../api/dispositivos.js";
import { createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { redesenharListaDeCenas } from "./cenas.js";

export async function renderizarAcoes(cenaId, container) {
    container.innerHTML = '<p>Carregando Ações...</p>';

    const [acoes, dispositivos, comodos] = await Promise.all([
        listarAcoesPorCena(cenaId),
        listarTodosDispositivos(),
        listarComodos()
    ]);

    const comodosMap = new Map(comodos.map(c => [c.id, c.nome]));

    container.innerHTML = '';

    if (acoes.length === 0) {
        container.innerHTML = '<p>Nenhuma ação cadastrada nesta cena.</p>';
    } else {

        // ADICIONEI ISSO AQUI
        const titulo = createByElem('h3');
        titulo.textContent = 'Sequência de ações';
        titulo.style.marginBottom = '10px';
        titulo.className = 'titulo-acoes'
        container.appendChild(titulo);


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

            // ADICIONEI ISSO AQUI
            const ctnAcao = createByElem('div')
            ctnAcao.className = 'ctn-acao'

            // ALTEREI ISSO AQUI
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

    const formAdicionar = createByElem('div');
    formAdicionar.className = 'form-container-grid';
    formAdicionar.style.marginTop = '15px';

    const optionsDispositivosAdicionar = dispositivos.map(d => {
        const comodoNome = comodosMap.get(d.comodo_id) || 'N/A';
        return `<option value="${d.id}">${d.nome} (${comodoNome})</option>`;
    }).join('');

    
    // ALTEREI ISSO AQUI
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

    if (!ordemInput.value || !dispositivoIdInput.value) {
        mostrarNotificacao('Preencha a ordem e selecione um dispositivo.', 'erro');
        return;
    }

    const todasAcoes = await listarAcoesPorCena(cenaId);
    const ordemDesejada = parseInt(ordemInput.value);
    const acaoConflitante = todasAcoes.find(a => a.ordem === ordemDesejada);

    let ordemParaCriar = ordemDesejada;
    if (acaoConflitante) {
        const maiorOrdem = Math.max(...todasAcoes.map(a => a.ordem), 0);
        ordemParaCriar = maiorOrdem + 1;
    }

    const novaAcao = await criarAcao(
        cenaId,
        dispositivoIdInput.value,
        acaoInput.value === 'true',
        intervaloInput.value,
        ordemParaCriar
    );

    if (novaAcao) {
        await trocarOuAtualizarOrdemAcao({
            cenaId,
            acaoIdAtual: novaAcao.id,
            novaOrdem: parseInt(ordemInput.value),
            dispositivoId: dispositivoIdInput.value,
            acao: acaoInput.value === 'true',
            intervalo: intervaloInput.value
        });
    } else {
        mostrarNotificacao('Falha ao adicionar a ação.', 'erro');
    }
}

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
    } else if (target.classList.contains('btn-editar-acao')) {
        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');
    } else if (target.classList.contains('btn-cancelar-edicao-acao')) {
        viewMode.classList.remove('hidden');
        editMode.classList.add('hidden');
    } else if (target.classList.contains('btn-salvar-acao')) {
        const novaOrdem = parseInt(acaoItem.querySelector('.edit-acao-ordem').value);
        const dispositivoId = acaoItem.querySelector('.edit-acao-dispositivo-id').value;
        const acao = acaoItem.querySelector('.edit-acao-acao').value === 'true';
        const intervalo = acaoItem.querySelector('.edit-acao-intervalo').value;

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

async function trocarOuAtualizarOrdemAcao({ cenaId, acaoIdAtual, novaOrdem, dispositivoId, acao, intervalo }) {
    const todasAcoes = await listarAcoesPorCena(cenaId);

    const acaoAtual = todasAcoes.find(a => a.id == acaoIdAtual);
    const ordemAntiga = acaoAtual ? acaoAtual.ordem : null;

    if (ordemAntiga !== null && novaOrdem === ordemAntiga) {
        const sucesso = await attAcao(acaoIdAtual, acao, intervalo, novaOrdem, dispositivoId);
        if (sucesso) mostrarNotificacao('Ação atualizada com sucesso!', 'sucesso');
        else mostrarNotificacao('Falha ao atualizar a ação.', 'erro');
        await redesenharListaDeCenas();
        return;
    }

    const acaoConflitante = todasAcoes.find(a => a.ordem === novaOrdem);

    if (acaoConflitante) {
        mostrarNotificacao('Trocando ordem das ações...', 'info');

        const [sucessoAcaoAtual, sucessoAcaoConflitante] = await Promise.all([
            attAcao(acaoIdAtual, acao, intervalo, novaOrdem, dispositivoId),
            attAcao(acaoConflitante.id, acaoConflitante.acao, acaoConflitante.intervalo_segundos, ordemAntiga, acaoConflitante.dispositivo_id)
        ]);

        if (sucessoAcaoAtual && sucessoAcaoConflitante) {
            mostrarNotificacao('Ordem das ações trocada com sucesso!', 'sucesso');
        } else {
            mostrarNotificacao('Ocorreu um erro ao trocar a ordem das ações.', 'erro');
        }
    } else {
        const sucesso = await attAcao(acaoIdAtual, acao, intervalo, novaOrdem, dispositivoId);
        if (sucesso) {
            mostrarNotificacao('Ação atualizada com sucesso!', 'sucesso');
        } else {
            mostrarNotificacao('Falha ao atualizar a ação.', 'erro');
        }
    }
    await redesenharListaDeCenas();
}