/**
 * @description Função para observar elementos na tela
*/
const myObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('mostrar')
        }else {
            entry.target.classList.remove('mostrar')
        }
    })
})

const elements = document.querySelectorAll('.esconder');

elements.forEach((el) => myObserver.observe(el));