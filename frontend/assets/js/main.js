import { getById } from "./utils.js";
import { renderizarComodos, lidarAddComodo, lidarAcoesDosComodos } from "./ui/comodos.js";


function init() {
    console.log('Aplicacao de Domotica iniciada!');

    const addComodoButton = getById('btn-add-comodo');
    const comodosList = getById('comodos-list');

    addComodoButton.addEventListener('click', lidarAddComodo);
    comodosList.addEventListener('click', lidarAcoesDosComodos);

    renderizarComodos();
}

document.addEventListener('DOMContentLoaded', init);