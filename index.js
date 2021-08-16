// ! inserted to avoid async / await error related to Babel on local development
import 'regenerator-runtime/runtime'

// * Base URL API 
const API_BASE_URL = `https://front-br-challenges.web.app/api/v2/green-thumb/?`


/*
 * * 
 * Busca os dados na API conforme escolhas do usuário
 * 
 * @param {string} sun Option for the sun selection
 * @param {string} water Option for how much it rains 
 * @param {string} pets Option for if pets chew plants
*/
async function fetchApi(sun, water, pets) {

    // * carrega inicializa o loading
    handleLoading('start')

    //* busca os dados na API
    let response = await fetch(`${API_BASE_URL}sun=${sun}&water=${water}&pets=${pets}`);

    // * handle status e exibe o chama a funcao para escrever os dados
    if (response.status === 200) {
        let data = await response.json();
        //console.log(response.status);
        await renderData(data) //* escreve os dados no Grid
    } else {
        //console.log("sem resultados para essa combinação")
        handleLoading('no-results') //* carrega a seção de nenhum resultado
        cleanResults()

    }
} //* fim fetchApi()

//* Inicializa o objeto que contem as opçoes escolhidas em cada combo
let selectStatus = {
    sun: "",
    water: "",
    pets: ""
}

/*
 * * 
 * Administra o que precisa aparecer e desaparecer na tela.
 * 
 * @param {string} modo determina de vai iniciar(start), terminou(finished) ou 
 * se retornou nenhum resultado (no-result)
*/
const handleLoading = (modo) => {
    const loadingDiv = document.getElementById('loading')
    const noResultsDiv = document.getElementById('no-results')
    const results = document.getElementById('results')
    switch (modo) {
        case 'start':
            results.style.display = 'block'
            loadingDiv.style.display = 'block'
            noResultsDiv.style.display = 'none'
            break
        case 'finished':
            loadingDiv.style.display = 'none'
            noResultsDiv.style.display = 'none'
            break
        case 'no-results':
            results.style.display = 'none'
            loadingDiv.style.display = 'none'
            noResultsDiv.style.display = 'block'
            break
        default:
            break;
    }

} //* Fim handleLoading()

/*
 * * 
 * Seleciona os icones conforme o tipo de plantas e retorna o caminho das imagens.
 * 
 * @param {object} plant recebe o objeto planta que vem da Api
*/

const handlePlantIcon = (plant) => {
    let icones = {}
    switch (plant.sun) {
        case 'no':
            icones.sun = 'no-sun.svg'
            break;
        case 'low':
            icones.sun = 'low-sun.svg'
            break;
        case 'high':
            icones.sun = 'low-sun.svg'
            break;
        default:
            break;
    }
    switch (plant.water) {
        case 'rarely':
            icones.water = '1-drop.svg'
            break;
        case 'regularly':
            icones.water = '2-drop.svg'
            break;
        case 'daily':
            icones.water = '3-drop.svg'
            break;
        default:
            break;
    }
    switch (plant.toxicity) {
        case true:
            icones.toxicity = 'toxic.svg'
            break;
        case false:
            icones.toxicity = 'pet.svg'
            break;
        default:
            break;
    }
    return icones
    //console.log(icones)
}
/*
 * * 
 * Renderiza o grid de reultados da busca
 * 
 * @param {object} plants Objeto com as plantas que atendem os critérios da busca
*/

const renderData = (plants) => {

    handleLoading('finished')

    //* Limpa a DIV de resultados para iniciar a escrita
    const container = document.getElementById('div-results')
    container.innerHTML = `<div id="loading" style="display:none;"><div class="lds-ellipsis">
    <div></div><div></div><div></div><div></div></div></div>`

    //* percorre o objeto com as plantas e preenche o template do Grid
    plants.map((plant, id) => {

        const iconsSvgPath = handlePlantIcon(plant);

        var template = document.createElement('template');

        //* Se é o elemento featured o template é diferente
        if (id === 0) {
            template.innerHTML = `
            <div class="item item-${id + 1}">
                <div class="staff-favorite"><p>✨ Staff favorite</p></div>
                <div class="imgGrid"><img src="${plant.url}"></div>
                <div class="fav-planta-footer">
                    <div class="fav-planta-name">    
                        <h4>${plant.name}</h4>
                    </div>
                    <div class="fav-preco-icone">
                        <div class="planta-preco">
                            <h4>$${plant.price}</h4>
                        </div>
                        <div class="planta-icones">
                            <div class="planta-icone sun"><img src="./images/icons/${iconsSvgPath.sun}" alt=""></div>
                            <div class="planta-icone water"><img src="./images/icons/${iconsSvgPath.water}" alt=""></div>
                            <div class="planta-icone pets"><img src="./images/icons/${iconsSvgPath.toxicity}" alt=""></div>
                        </div>
                    </div>
                    
                </div>
            </div>`.trim()
            container.appendChild(template.content.firstChild)

            //* Para os demais itens o template é o mesmo
        } else {
            template.innerHTML = `
            <div class="item item-${id + 1}">
                <div class="imgGrid"><img src="${plant.url}"></div>
                <h4>${plant.name}</h4>
                <div class="planta-footer">
                    <div class="planta-preco">
                        <h4>$${plant.price}</h4>
                    </div>
                    <div class="planta-icones">
                        <div class="planta-icone sun"><img src="./images/icons/${iconsSvgPath.sun}" alt=""></div>
                        <div class="planta-icone water"><img src="./images/icons/${iconsSvgPath.water}" alt=""></div>
                        <div class="planta-icone pets"><img src="./images/icons/${iconsSvgPath.toxicity}" alt=""></div>
                    </div>
                </div>
            </div>`.trim()
            container.appendChild(template.content.firstChild)
        }
    })

}
//* Limpa o dados da DIV de resutados 
const cleanResults = () => {
    const container = document.getElementById('div-results')
    container.innerHTML = `<div id="loading" style="display:none;"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>`
    //console.log("clean")
}

//* checa se todos os 3 select boxes foram selecionados e dispara a funçao de buscar dados na API
const checkSelectStatus = () => {
    if (selectStatus.sun !== "" && selectStatus.water !== "" && selectStatus.pets !== "") {
        //console.log(`rodar funcao: ${selectStatus.sun} ${selectStatus.water} ${selectStatus.pets}`)
        cleanResults()
        fetchApi(selectStatus.sun, selectStatus.water, selectStatus.pets)

    }
}
/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Tratamento das caixas de escolha e disparo da funçao de consulta a API
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

for (const select of document.querySelectorAll('.custom-select-wrapper')) {
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
       // console.log(selectStatus)
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
/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * FIM // Tratamento das caixas de escolha e disparo da funçao de consulta a API
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/
