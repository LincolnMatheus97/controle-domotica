/**
 * Arquivo de manipulação da comunicação com a API voltado para os dispositivos
*/

import { API_URL } from "../utils.js";

/**
 * @description Função para listar todos os dispositivos
 * @returns {Promise<Array>} - Uma promessa que resolve para a lista de dispositivos
*/
export async function listarTodosDispositivos() {
    try {
        const response = await fetch(`${API_URL}/dispositivos`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao listar todos os dispositivos:", error);
        return [];
    }
}

/**
 * @description Função para listar dispositivos por cômodo
 * @param {string} comodoId - O ID do cômodo
 * @returns {Promise<Array>} - Uma promessa que resolve para a lista de dispositivos do cômodo
*/
export async function listarDispositivosPorComodo(comodoId) {
    try {
        const response = await fetch(`${API_URL}/comodos/${comodoId}/dispositivos`);
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Falha as listar dispositivos:", error);
        return [];
    }
}

/**
 * @description Função para criar um novo dispositivo
 * @param {string} comodoId - O ID do cômodo
 * @param {string} nome - O nome do dispositivo
 * @returns {Promise<Object|null>} - Uma promessa que resolve para o dispositivo criado ou null em caso de erro
*/
export async function criarDispositivo(comodoId, nome) {
    try {
        const response = await fetch(`${API_URL}/comodos/${comodoId}/dispositivos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome }),
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao criar dispositivo:", error);
        return null;
    }
}

/**
 * @description Função para alterar um dispositivo
 * @param {string} dispositivoId - O ID do dispositivo
 * @param {string} novoNome - O novo nome do dispositivo
 * @returns {Promise<Object|null>} - Uma promessa que resolve para o dispositivo atualizado ou null em caso de erro
*/
export async function attDispositivo(dispositivoId, novoNome) {
    try {
        const response = await fetch(`${API_URL}/dispositivos/${dispositivoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: novoNome }),
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao alterar dispositivo:", error);
        return null;
    }
}

/**
 * @description Função para alterar o estado de um dispositivo
 * @param {string} dispositivoId - O ID do dispositivo
 * @param {boolean} novoEstado - O novo estado do dispositivo
 * @returns {Promise<Object|null>} - Uma promessa que resolve para o dispositivo atualizado ou null em caso de erro
*/
export async function attEstadoDispositivo(dispositivoId, novoEstado) {
    try {
        const response = await fetch(`${API_URL}/dispositivos/${dispositivoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: novoEstado }),
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao alterar dispositivo:", error);
        return null;
    }
}

/**
 * @description Função para excluir um dispositivo
 * @param {string} dispositivoId - O ID do dispositivo
 * @returns {Promise<boolean>} - Uma promessa que resolve para true em caso de sucesso ou false em caso de erro
*/
export async function excluirDispositivo(dispositivoId) {
    try {
        const response = await fetch(`${API_URL}/dispositivos/${dispositivoId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Falha ao excluir comodo:", error);
        return false;
    }
}