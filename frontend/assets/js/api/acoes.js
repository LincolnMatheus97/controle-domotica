/*
 * Arquivo de manipulação da comunicação com a API voltado para as ações
*/

import { API_URL } from "../utils.js";

/**
 * @description Função para listar as ações de uma cena
 * @param {string} cenaId - O ID da cena
 * @returns {Promise<Array>} - Uma promessa que resolve para a lista de ações da cena
*/
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

/**
 * @description Função para criar uma nova ação
 * @param {string} cenaId - O ID da cena
 * @param {string} dispId - O ID do dispositivo
 * @param {string} estadoAcao - O estado da ação
 * @param {number} interv - O intervalo em segundos
 * @param {number} ordem - A ordem da ação
 * @returns {Promise<Object|null>} - Uma promessa que resolve para a ação criada ou null em caso de erro
*/
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

/**
 * @description Função para alterar uma ação
 * @param {string} acaoId - O ID da ação
 * @param {string} novoEstadoAcao - O novo estado da ação
 * @param {number} novoInterv - O novo intervalo em segundos
 * @param {number} novaOrdem - A nova ordem da ação
 * @param {string} novoDispId - O novo ID do dispositivo
 * @returns {Promise<Object|null>} - Uma promessa que resolve para a ação atualizada ou null em caso de erro
*/
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
/**
 * @description Função para excluir uma ação
 * @param {string} acaoId - O ID da ação
 * @returns {Promise<boolean>} - Uma promessa que resolve para true em caso de sucesso ou false em caso de erro
*/
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