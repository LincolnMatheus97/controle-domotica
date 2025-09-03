/**
 * Arquivo de manipulação da comunicação com a API voltado para as cenas
 */
import { API_URL } from "../utils.js";

/**
 * @description Função para listar todas as cenas
 * @returns {Promise<Array>} - Uma promessa que resolve para a lista de cenas
*/
export async function listarCenas() {
    try {
        const response = await fetch(`${API_URL}/cenas`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Falha ao listar cenas:", error);
        return [];
    }
}

/**
 * @description Função para criar uma nova cena
 * @param {string} nome - O nome da cena
 * @param {boolean} estado - O estado da cena
 * @returns {Promise<Object|null>} - Uma promessa que resolve para a cena criada ou null em caso de erro
*/
export async function criarCena(nome, estado) {
    try {
        const response = await fetch(`${API_URL}/cenas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, estado }),
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao criar cena:", error);
        return null;
    }
}

/**
 * @description Função para alterar uma cena
 * @param {string} cenaId - O ID da cena
 * @param {string} novoNome - O novo nome da cena
 * @returns {Promise<Object|null>} - Uma promessa que resolve para a cena atualizada ou null em caso de erro
*/
export async function attCena(cenaId, novoNome) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}`, {
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
        console.error("Falha ao alterar cena:", error);
        return null;
    }
}

/**
 * @description Função para excluir uma cena
 * @param {string} cenaId - O ID da cena
 * @returns {Promise<boolean>} - Uma promessa que resolve para true em caso de sucesso ou false em caso de erro
*/
export async function excluirCena(cenaId) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Falha ao excluir cena:", error);
        return false;
    }
}

/**
 * @description Função para inverter o estado de uma cena
 * @param {string} cenaId - O ID da cena
 * @returns {Promise<Object|null>} - Uma promessa que resolve para a cena atualizada ou null em caso de erro
*/
export async function invertEstadoCena(cenaId) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}/inverter`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao alterar estado da cena:", error);
        return null;
    }
}

/**
 * @description Função para executar uma cena
 * @param {string} cenaId - O ID da cena
 * @returns {Promise<Object|null>} - Uma promessa que resolve para o resultado da execução ou null em caso de erro
*/
export async function executarCena(cenaId) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}/executar`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Falha ao executar cena:", error);
        return { sucesso: false, mensagem: error.message };
    }
}