import { API_URL } from "../utils.js";

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