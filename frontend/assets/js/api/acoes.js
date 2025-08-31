import { API_URL } from "../utils.js";

export async function listarAcoesPorCena(cenaId) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}/acoes`);
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha as listar ações:", error);
        return [];
    }
}

export async function criarAcao(cenaId, dispId, estadoAcao, interv, ordem) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}/acoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dispositivo_id: dispId, acao: estadoAcao, intervalo_segundos: interv, ordem: ordem }),
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao criar ação:", error);
        return null;
    }
}

export async function attAcao(acaoId, novoEstadoAcao, novoInterv, novaOrdem, novoDispId) {
    try {
        const response = await fetch(`${API_URL}/acoes/${acaoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ acao: novoEstadoAcao, intervalo_segundos: novoInterv, ordem: novaOrdem, dispositivo_id: novoDispId }),
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao alterar ação:", error);
        return null;
    }
}

export async function excluirAcao(acaoId) {
    try {
        const response = await fetch(`${API_URL}/acoes/${acaoId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Falha ao excluir ação:", error);
        return false;
    }
}