import { getById } from "./utils.js";
import { renderizarComodos, lidarAddComodo } from "./ui.js";
import { listarComodos } from "./api.js";

function init() {
    console.log('Aplicacao de Domotica iniciada!');

    const addComodoButton = getById('btn-add-comodo');

    addComodoButton.addEventListener('click', lidarAddComodo);

    renderizarComodos();
}

document.addEventListener('DOMContentLoaded', init);