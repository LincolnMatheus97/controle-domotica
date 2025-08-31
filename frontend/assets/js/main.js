import { getById } from "./utils.js";
import { renderizarComodos, lidarAddComodo, lidarAcoesDosComodos } from "./ui/comodos.js";
import { lidarAcoesDosDispositivos, lidarAddDispositivo } from "./ui/dispositivos.js";
import { lidarAcoesDasCenas, lidarAddCena, renderizarCenas } from "./ui/cenas.js";
import { lidarAcoesDasAcoes, lidarAddAcao } from "./ui/acoes.js";


function init() {
    console.log('Aplicacao de Domotica iniciada!');

    const addComodoButton = getById('btn-add-comodo');
    const comodosList = getById('comodos-list');
    const addCenaButton = getById('btn-add-cena');
    const cenaList = getById('cenas-list');

    addComodoButton.addEventListener('click', lidarAddComodo);
    addCenaButton.addEventListener('click', lidarAddCena);

    // Listener para Cômodos e Dispositivos
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

    // Listener para Cenas e Ações
    cenaList.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('btn-add-acao')) {
            lidarAddAcao(event);
        } else if (target.closest('.acao-item')) {
            lidarAcoesDasAcoes(event);
        } else if (target.closest('.cena-item')) {
            lidarAcoesDasCenas(event);
        }
    });
    
    // Listener para fechar itens expandidos
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.closest('#comodos-section') && !target.closest('#cenas-section') && !target.closest('#confirm-modal')) {
            document.querySelectorAll('.comodo-item.expanded, .cena-item.expanded').forEach(item => {
                item.classList.remove('expanded');
            });
        }
    });

    // Renderiza a lista inicial de cômodos e cenas
    renderizarComodos();
    renderizarCenas();
}

document.addEventListener('DOMContentLoaded', init);