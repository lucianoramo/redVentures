// ! inserido para evitar um erro no uso de async / await relacionado ao Babel local
import 'regenerator-runtime/runtime'

//URL base da API
const API_BASE_URL = `https://front-br-challenges.web.app/api/v2/green-thumb/?`

//Busca os dados na API conforme escolhas do usuário
async function fetchApi(sun, water, pets) { //handle status 404
    handleLoading('start')
    let response = await fetch(`${API_BASE_URL}sun=${sun}&water=${water}&pets=${pets}`);
    if (response.status === 200) {
        let data = await response.json();
        console.log(response.status);
        await writeData(data)
    } else {
        console.log("sem resultados para essa combinação")
        cleanResults()

    }
}

const handleLoading = (modo) => {
    const loadingDiv = document.getElementById('loading')
    const noResultsDiv = document.getElementById('no-results')

    switch (modo) {
        case 'start':
            loadingDiv.style.display = 'block'
            noResultsDiv.style.display = 'none'
            break
        case 'finished':
            loading.style.display = 'none'
            noResultsDiv.style.display = 'none'
            break
        case 'no-results':
            loading.style.display = 'none'
            noResultsDiv.style.display = 'block'
            break
        default:
            break;
    }

}

const writeData = (plants) => {
    handleLoading('finished')
    const container = document.getElementById('div-results')
    container.innerHTML = ""
    plants.map((plant, id) => {
        var template = document.createElement('template');
        if (id === 0) {
            template.innerHTML = `
            <div class="item item-${id + 1}">
                <div class="imgGrid"><img src="${plant.url}"></div>
                <h4>${plant.name}</h4>
                <div class="planta-footer">
                    <div class="planta-preco">
                        <h4>$${plant.price}</h4>
                    </div>
                    <div class="planta-icones">
                        <div class="planta-icone sun"><img src="./images/icons/low-sun.svg" alt=""></div>
                        <div class="planta-icone water"><img src="./images/icons/3-drops.svg" alt=""></div>
                        <div class="planta-icone pets"><img src="./images/icons/pet.svg" alt=""></div>
                    </div>
                </div>
                </div>`.trim()
            container.appendChild(template.content.firstChild)
        } else {
            template.innerHTML = `<div class="item item-${id + 1}">
                <div class="imgGrid"><img src="${plant.url}"></div>
                <h4>${plant.name}</h4>
                <div class="planta-footer">
                    <div class="planta-preco">
                        <h4>$${plant.price}</h4>
                    </div>
                    <div class="planta-icones">
                        <div class="planta-icone sun"><img src="./images/icons/low-sun.svg" alt=""></div>
                        <div class="planta-icone water"><img src="./images/icons/3-drops.svg" alt=""></div>
                        <div class="planta-icone pets"><img src="./images/icons/pet.svg" alt=""></div>
                    </div>
                </div>
                </div>`.trim()
            container.appendChild(template.content.firstChild)
        }
    })

}

const cleanResults = () => {
    const container = document.getElementById('div-results')
    container.innerHTML = ""

}
let selectStatus = {
    sun: "",
    water: "",
    pets: ""
}
const checkSelectStatus = () => {
    if (selectStatus.sun !== "" && selectStatus.water !== "" && selectStatus.pets !== "") {
        console.log(`rodar funcao: ${selectStatus.sun} ${selectStatus.water} ${selectStatus.pets}`)
        fetchApi(selectStatus.sun, selectStatus.water, selectStatus.pets)
        
    } else {
        console.log("nada")

    }

}
/****************************************************************
 Tratamento das caixas de escolha e disparo da funçao de consulta a API
*/


for (const select of document.querySelectorAll('.custom-select-wrapper')){
   // console.log(select)
    select.addEventListener('click', function () {

        this.querySelector('.custom-select').classList.toggle('open');
        this.querySelector('.custom-select__trigger').classList.toggle('trigger_open')
       
    })
}


for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function () {
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;

        }
        const tipoSelect = this.parentNode.parentNode.parentNode.parentNode.dataset.value
        const selectedValue = this.parentNode.querySelector('.custom-option.selected').dataset.value
        selectStatus[tipoSelect] = selectedValue
        checkSelectStatus()
        console.log(selectStatus)
    })
}
window.addEventListener('click', function (e) {
    const select = document.querySelector('.custom-select')
    const trigger = document.querySelector('.custom-select__trigger')
    if (!select.contains(e.target)) {
        select.classList.remove('open');
        trigger.classList.remove('trigger_open')
    }

});
/****************************************************************
 FIM // Tratamento das caixas de escolha e disparo da funçao de consulta a API
*/