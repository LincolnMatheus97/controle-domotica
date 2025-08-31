import { API_URL } from "../utils.js";

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