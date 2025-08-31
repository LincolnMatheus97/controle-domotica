import { getById } from "./utils.js";
import { renderizarComodos, lidarAddComodo, lidarAcoesDosComodos } from "./ui/comodos.js";
import { lidarAcoesDosDispositivos, lidarAddDispositivo } from "./ui/dispositivos.js";
import { lidarAcoesDasCenas, lidarAddCena, renderizarCenas } from "./ui/cenas.js";


function init() {
    console.log('Aplicacao de Domotica iniciada!');

    const addComodoButton = getById('btn-add-comodo');
    const comodosList = getById('comodos-list');
    const addCenaButton = getById('btn-add-cena');
    const cenaList = getById('cenas-list');

    addComodoButton.addEventListener('click', lidarAddComodo);
    addCenaButton.addEventListener('click', lidarAddCena);

    // Listener principal (orquestrador)
    comodosList.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('btn-add-dispositivo')) {
            lidarAddDispositivo(event);

        } else if (target.closest('.dispositivo-item')) {
            lidarAcoesDosDispositivos(event);

        } else if (target.closest('.comodo-item')) {
            lidarAcoesDosComodos(event);
        }
    });

    cenaList.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('btn-add-acao')) {
            // lidarAddAcoes(event);
        } else if (target.closest('.acao-item')) {
            // lidarActionsDasAcoes(event);
        } else if (target.closest('.cena-item')) {
            lidarAcoesDasCenas(event);
        }
    });

    // Listener secundario 
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.closest('#cenas-section') && !target.closest('#confirm-modal')) {
            const comodosExpandidos = document.querySelectorAll('.cena-item.expanded');
            comodosExpandidos.forEach(cena => {
                cena.classList.remove('expanded');
            });
        }
    });

    // Renderiza a lista inicial de cômodos e cenas
    renderizarComodos();
    renderizarCenas();
}

document.addEventListener('DOMContentLoaded', init);