import { API_URL } from "../utils.js";

export async function listarCenas() {
    try {
        const response = await fetch(`${API_URL}/cenas`);
        if(!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error("Falha ao listar cenas:", error);
        return []; 
    }
}

export async function criarCena(nome, estado) {
    try {
        const response = await fetch(`${API_URL}/cenas`, {
           method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, estado }),
        });
        return await response.json();
    } catch (error) {
        console.error("Falha ao criar cena:", error);
        return null;
    }
}

export async function attCena(cenaId, novoNome) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: novoNome}),
        });
        return await response.json();
    } catch (error) {
        console.error("Falha ao alterar cena:", error);
        return null;
    }
}

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

export async function invetEstadoCena(cenaId) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}/inverter`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Falha ao alterar estado da cena:", error);
        return false;
    }
}

export async function excutarCena(cenaId) {
    try {
        const response = await fetch(`${API_URL}/cenas/${cenaId}/executar`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error("Falha ao executar cena:", error);
        return false;
    }
}