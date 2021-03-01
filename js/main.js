const $form = document.getElementById('form-pokemon'),
$namePokemonInput = document.getElementById('name-pokemon'),
$pokemonElement = document.querySelector('.pokemon'),
$paginate = document.getElementById('paginate'),
$message = document.getElementById('message'),
$totalItens = document.getElementById('total-itens'),
$btnBackList = document.getElementById('btn-back-list'),
$dropdownMenuButtonPage = document.getElementById('dropdown-button-page')

let pokemonpromisse = []
let perPage = 12
let urlNext = ''
let urlPrev = ''
let urlBase =  `https://pokeapi.co/api/v2/pokemon?offset=0&limit=`
let totalItens = 0
let currentPage = 1

window.onload = () => {
  loadPokemons(urlBase+perPage)
}

document.body.addEventListener('click',  (event) => {
   event.preventDefault();
   pokemonpromisse = []

  const elemento = event.target
  if(elemento.classList.contains('next')&& urlNext != null){
    currentPage++
    loadPokemons(urlNext)
  }if(elemento.classList.contains('prev') && urlPrev != null){
    currentPage--
    loadPokemons(urlPrev)
  }
  if(elemento.classList.contains('btn-search')){
    loadPokemonByName($namePokemonInput)
  }
  if(elemento.classList.contains('back-list')){
    RequestManager.setCurrentPageInitial()
    loadPokemons(`${urlBase}${perPage}`)
  }
  if(elemento.classList.contains('btn-close')){
    RequestManager.setCurrentPageInitial()
    loadPokemons(`${urlBase}${perPage}`)
  }
  if(elemento.classList.contains('qtdPerPage')){
    RequestManager.setQtyPerPage(elemento.value)
    RequestManager.setCurrentPageInitial()
    loadPokemons(`${urlBase}${perPage}`)
  }
})

function loadPokemons (urlBase){
  RequestManager.getListPokemons(urlBase)
  .then(listPokemons => {
      listPokemons.results.map(function (item){
      const promise = RequestManager.getPokemon(item.url)
        pokemonpromisse.push(promise)
      })
      Promise.all(pokemonpromisse).then((pokemons) => {
        Renderer.renderPokemons(pokemons,$pokemonElement)
      });
      RequestManager.setNextPage(listPokemons.next)
      RequestManager.setPreviousPage(listPokemons.previous)
      RequestManager.setTotalItens(listPokemons.count)
      Renderer.renderBotaoBackList(currentPage, $btnBackList)
      Renderer.renderDropdownOptionQtyItens(null, $dropdownMenuButtonPage)
      Renderer.renderPaginate(urlNext,urlPrev,currentPage, listPokemons.count, $paginate)
  })
  .catch(error => {
    Renderer.renderError(error, $message);
    Form.clearInputs($form); 
    Renderer.renderPokemonFiltered('' ,$pokemonElement);
  })
}

function loadPokemonByName($namePokemonInput){
  Form.getPokemonName($namePokemonInput)
  .then(pokemonName => RequestManager.getPokemonName(pokemonName))
  .then(pokemon => {
    Renderer.renderPokemonFiltered(pokemon, $pokemonElement)
    Renderer.renderError(null, $message)
    Template.clearPaginate($paginate)
    Form.clearInputs($form); 
    Renderer.renderBotaoBackList(++currentPage, $btnBackList)
    Renderer.renderDropdownOptionQtyItens(true, $dropdownMenuButtonPage)
  })
  .catch(error => {
    Renderer.renderError(error, $message);
    Form.clearInputs($form); 
    Renderer.renderPokemonFiltered(null ,$pokemonElement);
    Template.clearPaginate ($paginate)
    Renderer.renderBotaoBackList(null, $btnBackList)
    Renderer.renderDropdownOptionQtyItens(error, $dropdownMenuButtonPage)
  })
}


