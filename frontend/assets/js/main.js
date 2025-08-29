import { getById } from "./utils.js";
import { renderizarComodos, lidarAddComodo, lidarAcoesDosComodos } from "./ui/comodos.js";
import { lidarAcoesDosDispositivos, lidarAdicionarDispositivo } from "./ui/dispositivos.js";


function init() {
    console.log('Aplicacao de Domotica iniciada!');

    const addComodoButton = getById('btn-add-comodo');
    const comodosList = getById('comodos-list');

    addComodoButton.addEventListener('click', lidarAddComodo);
    
    // Listener principal (orquestrador)
    comodosList.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('btn-add-dispositivo')) {
            lidarAdicionarDispositivo(event);

        } else if (target.closest('.dispositivo-item')) {
            lidarAcoesDosDispositivos(event);

        } else if (target.closest('.comodo-item')) {
            lidarAcoesDosComodos(event);
        }
    });

    // Listener secundario 
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.closest('#comodos-section') && !target.closest('#confirm-modal')) {
            const comodosExpandidos = document.querySelectorAll('.comodo-item.expanded');
            comodosExpandidos.forEach(comodo => {
                comodo.classList.remove('expanded');
            });
        }
    });

    // Renderiza a lista inicial de cômodos
    renderizarComodos();
}

document.addEventListener('DOMContentLoaded', init);