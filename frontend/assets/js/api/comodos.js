/**
 * Arquivo de manipulação da comunicação com a API voltado para os cômodos
*/

import { API_URL } from "../utils.js";

/**
 * @description Função para listar todos os cômodos
 * @returns {Promise<Array>} - Uma promessa que resolve para a lista de cômodos
*/
export async function listarComodos() {
    try {
        const response = await fetch(`${API_URL}/comodos`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Falha ao listar cômodos:", error);
        return []; 
    }
}

/**
 * @description Função para criar um novo cômodo
 * @param {string} nome - O nome do cômodo
 * @returns {Promise<Object|null>} - Uma promessa que resolve para o cômodo criado ou null em caso de erro
*/
export async function criarComodo(nome) {
    try {
        const response = await fetch(`${API_URL}/comodos`, {
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
        console.error("Falha ao criar comodos:", error);
        return null;
    }
}

/**
 * @description Função para alterar um cômodo
 * @param {string} id - O ID do cômodo
 * @param {string} novoNome - O novo nome do cômodo
 * @returns {Promise<Object|null>} - Uma promessa que resolve para o cômodo atualizado ou null em caso de erro
*/
export async function attComodo(id, novoNome) {
    try {
        const response = await fetch(`${API_URL}/comodos/${id}`, {
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
        console.error("Falha ao alterar comodo:", error);
        return null;
    }
}

/**
 * @description Função para excluir um cômodo
 * @param {string} id - O ID do cômodo
 * @returns {Promise<boolean>} - Uma promessa que resolve para true em caso de sucesso ou false em caso de erro
*/
export async function excluirComodo(id) {
    try {
        const response = await fetch(`${API_URL}/comodos/${id}`, {
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