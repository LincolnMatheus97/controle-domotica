import { getById, createByElem } from "./utils.js";
import { listarComodos, criarComodo } from "./api.js";

const comodosListDiv = getById('comodos-list');
const novoComodoInput = getById('novo-comodo-nome');

export async function renderizarComodos() {
    console.log("Rederizando comodos...");
    const comodos = await listarComodos();

    comodosListDiv.innerHTML = '';

    if (comodos.length === 0) {
        comodosListDiv.innerHTML = '<p>Nenhum cômodo cadastrado ainda.</p>';
        return;
    }

    comodos.forEach(comodo => {
        const comodoElement = createByElem('div');
        comodoElement.className = 'comodo-item';
        comodoElement.innerHTML = `<span>${comodo.nome}</span>`;
        comodoElement.dataset.comodoID = comodo.id;
        comodosListDiv.appendChild(comodoElement);
    });
}

export async function lidarAddComodo() {
    const nome = novoComodoInput.value.trim();
    if (!nome) {
        alert('Por favor, digite o nome do cômodo.');
        return;
    }

    const novoComodo = await criarComodo(nome);
    if (novoComodo) {
        novoComodoInput.value = '';
        renderizarComodos();
    } else {
        alert('Não foi possivel criar o cômodo.');
    }
}
