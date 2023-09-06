let listaDeItens = []
let itemAEditar

const form = document.getElementById("form-itens")
const itensInput = document.getElementById("receber-item")
const ulItens = document.getElementById("lista-de-itens")
const ulItensComprados = document.getElementById("itens-comprados")
const listaRecuperada = localStorage.getItem('listaDeItens')

function guardaDados() {
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}

if (listaRecuperada) {
    listaDeItens = JSON.parse(listaRecuperada)
    mostraItens()
} else {
    listaDeItens = []
}

form.addEventListener("submit", (evento) => {
    evento.preventDefault()

    salvarItem()
    mostraItens()
    // usando o .focus conseguimos manter o input ainda selecionado após clicar no botão
    itensInput.focus()
})

function salvarItem() {
    const comprasItem = itensInput.value
    // .some percorre a lista de itens, para depois verificarmos se é igual a algum item dentro da lista
    // usando o toUpperCase o js trasnforma a string com letras maíusculas e verifica, usamos isso caso os itens sejam digitados com letras minusculas ou maiusculas
    const checarDuplicado = listaDeItens.some((elemento)=> elemento.valor.toUpperCase() === comprasItem.toUpperCase())
    
    if(checarDuplicado) {
        alert("Item já existe")
    } else {
        listaDeItens.push(
            {
                valor: comprasItem,
                checar: false
            }
        ) 
    }
    
    itensInput.value = ""
}

function mostraItens() {
    ulItens.innerHTML = ""
    ulItensComprados.innerHTML = ""

    listaDeItens.forEach((item, index)=> {
        if(item.checar) {            
            ulItensComprados.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" checked class="is-clickable" />  
                    <span class="itens-comprados is-size-5">${item.valor}</span>
                </div>
                <div>
                    <i class="fa-solid fa-trash is-clickable deletar"></i>
                </div>
            </li>
            `
        } else {
            ulItens.innerHTML += `
            <li class="item-compra is-flex is-justify-content-space-between" data-value="${index}">
                <div>
                    <input type="checkbox" class="is-clickable" />
                    <input type="text" class="is-size-5" value="${item.valor}" ${index != itemAEditar ? "disabled" : ""}></input>
                </div>
                
                <div>
                    ${ index == itemAEditar ? '<i class="fa-regular fa-floppy-disk is-clickable salvar"></i>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                    <i class="fa-solid fa-trash is-clickable deletar"></i>
                </div>
            </li>
                `
        }
    }) 

    const inputCheck = document.querySelectorAll('input[type="checkbox"]')

    inputCheck.forEach((i)=> {
        i.addEventListener("click", (evento) => {
            const valorDoElemento = (evento.target.parentElement.parentElement.getAttribute("data-value"))

            // identificamos o objeto pelo seu indíce, que está guardado no "valorDoElemento" - listaDeItens na posição zero no item checar
            // usamos o evento.target.checked é um método o checkbox, quando clicamos ele fica com valor checked = true, e check = false
            // conseguimos assim alterar o valor .checar da listaDeItens para true ou false quando ele está check ou checked
            listaDeItens[valorDoElemento].checar = evento.target.checked

            console.log(listaDeItens[valorDoElemento].checar)
            mostraItens()
        })
    })

    const deletarObjetos = document.querySelectorAll(".deletar")

    deletarObjetos.forEach((objeto) => {
        objeto.addEventListener("click", (evento) =>{
            const valorDoElemento = (evento.target.parentElement.parentElement.getAttribute("data-value"))

            listaDeItens.splice(valorDoElemento,1)
            mostraItens()
        })
    })

    // quando clicamos no botão de editar, atribuimos a constante itemAEditar o data-value do objeto
    const editarItens = document.querySelectorAll(".editar")

    editarItens.forEach((objeto) => {
        objeto.addEventListener("click", (evento) =>{
            itemAEditar = (evento.target.parentElement.parentElement.getAttribute("data-value"))
            mostraItens()
        })
    })

    const salvarItens = document.querySelectorAll(".salvar")

    salvarItens.forEach((objeto) => {
        objeto.addEventListener("click", () => {
            salvarEdicao()
        })
    })

    guardaDados()
}

function salvarEdicao() {
    // passamos o itemAEditar no data-value do objeto para editar exatamente o objeto que tenha o valor do "itemAEditar"
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)
    console.log(itemEditado.value)

    listaDeItens[itemAEditar].valor = itemEditado.value
    itemAEditar = -1
    console.log(listaDeItens)
    mostraItens()
}