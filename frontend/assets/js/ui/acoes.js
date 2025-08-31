import { listarAcoesPorCena, criarAcao, excluirAcao, attAcao } from "../api/acoes.js";
import { listarTodosDispositivos } from "../api/dispositivos.js";
import { createByElem, mostrarNotificacao, abrirModalConfirmacao } from "../utils.js";
import { redesenharListaDeCenas } from "./cenas.js";

export async function renderizarAcoes(cenaId, container) {
    container.innerHTML = '<p>Carregando Ações...</p>';

    const [acoes, dispositivos] = await Promise.all([
        listarAcoesPorCena(cenaId),
        listarTodosDispositivos()
    ]);

    container.innerHTML = '';

    if (acoes.length === 0) {
        container.innerHTML = '<p>Nenhuma ação cadastrada nesta cena.</p>';
    } else {
        acoes.forEach(acao => {
            const dispositivo = dispositivos.find(d => d.id === acao.dispositivo_id);
            const nomeDispositivo = dispositivo ? dispositivo.nome : `ID ${acao.dispositivo_id} (não encontrado)`;
            const optionsDispositivos = dispositivos.map(d => `<option value="${d.id}" ${d.id === acao.dispositivo_id ? 'selected' : ''}>${d.nome}</option>`).join('');


            const acaoEl = createByElem('div');
            acaoEl.className = 'acao-item';
            acaoEl.dataset.acaoId = acao.id;

            acaoEl.innerHTML = `
                <div class="view-mode">
                    <span>Ordem: ${acao.ordem} - Ação: <strong>${acao.acao ? 'Ligar' : 'Desligar'}</strong> ${nomeDispositivo} (intervalo: ${acao.intervalo_segundos || 0}s)</span>
                    <div class="acao-actions">
                        <button class="btn btn-sm btn-secondary btn-editar-acao">Editar</button>
                        <button class="btn btn-sm btn-danger btn-excluir-acao">Excluir</button>
                    </div>
                </div>
                <div class="edit-mode hidden">
                    <input type="number" class="edit-acao-ordem" value="${acao.ordem}" style="width: 60px;">
                    <select class="edit-acao-dispositivo-id">
                        ${optionsDispositivos}
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
            container.appendChild(acaoEl);
        });
    }

    const formAdicionar = createByElem('div');
    formAdicionar.className = 'form-container-grid';
    formAdicionar.style.marginTop = '15px';

    const optionsDispositivos = dispositivos.map(d => `<option value="${d.id}">${d.nome}</option>`).join('');

    formAdicionar.innerHTML = `
        <input type="number" class="nova-acao-ordem" placeholder="Ordem" style="width: 80px;">
        <select class="nova-acao-dispositivo-id">
            <option value="">Selecione o Dispositivo</option>
            ${optionsDispositivos}
        </select>
        <select class="nova-acao-acao">
            <option value="true">Ligar</option>
            <option value="false">Desligar</option>
        </select>
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

    const novaAcao = await criarAcao(
        cenaId,
        dispositivoIdInput.value,
        acaoInput.value === 'true',
        intervaloInput.value,
        ordemInput.value
    );

    if (novaAcao) {
        mostrarNotificacao('Ação adicionada com sucesso!', 'sucesso');
        await redesenharListaDeCenas(); 
    } else {
        mostrarNotificacao('Falha ao adicionar a ação.', 'erro');
    }
}

export async function lidarAcoesDasAcoes(event) {
    event.stopPropagation();

    const target = event.target;
    const acaoItem = target.closest('.acao-item');
    if (!acaoItem) return;

    const acaoId = acaoItem.dataset.acaoId;
    const cenaItem = target.closest('.cena-item');
    const cenaId = cenaItem.dataset.cenaId;
    const container = cenaItem.querySelector('.acoes-container');

    const viewMode = acaoItem.querySelector('.view-mode');
    const editMode = acaoItem.querySelector('.edit-mode');

    if (target.classList.contains('btn-excluir-acao')) {
        const confirmado = await abrirModalConfirmacao("Tem certeza que deseja excluir esta ação?");
        if (confirmado) {
            const sucesso = await excluirAcao(acaoId);
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
        const ordem = acaoItem.querySelector('.edit-acao-ordem').value;
        const dispositivoId = acaoItem.querySelector('.edit-acao-dispositivo-id').value;
        const acao = acaoItem.querySelector('.edit-acao-acao').value === 'true';
        const intervalo = acaoItem.querySelector('.edit-acao-intervalo').value;

        if (!ordem || !dispositivoId) {
            mostrarNotificacao('Preencha a ordem e selecione um dispositivo para salvar.', 'erro');
            return;
        }

        const sucesso = await attAcao(acaoId, acao, intervalo, ordem, dispositivoId);
        if (sucesso) {
            mostrarNotificacao('Ação atualizada com sucesso!', 'sucesso');
            renderizarAcoes(cenaId, container);
        } else {
            mostrarNotificacao('Falha ao atualizar a ação.', 'erro');
        }
    }
}