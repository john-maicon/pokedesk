const Form = {
  clearInputs: ($form) => {
    $form.reset()
  },
  getPokemonName: ($input) => {
    if(!$input.value.trim()){ return Promise.reject('Por favor, informe um nome no campo acima.') }
    return new Promise(resolve => resolve($input.value.trim()));
  },
}

const RequestManager = {
  getListPokemons: async (url) => {
    const response = await fetch(url)
    if(response.status === 404) return Promise.reject('Nada encontrado')
    return response.json()
  },
  getPokemon: async (url) => {
    const response = await fetch(url)
    if(response.status === 404) return Promise.reject('Pokemon não encontrado')
    return response.json()
  },
  getPokemonName: async (pokemonName) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    if(response.status === 404) return Promise.reject('Pokemon não encontrado')
    return response.json()
  },
  setNextPage: (nextPage) => {
    return new Promise(resolve => resolve(urlNext = nextPage));
  },
  setPreviousPage: (prevPage) => {
    return new Promise(resolve => resolve(urlPrev = prevPage));
  },
  setTotalItens: (totalItens) => {
    return new Promise(resolve => resolve(totalItens = totalItens));
  },
  setQtyPerPage: (value) => {
    return new Promise(resolve => resolve(perPage = value));
  },
  setCurrentPageInitial: () => {
    return new Promise(resolve => resolve(currentPage = 1));
  }
}

const Renderer = {
  renderPokemons: (pokemons, $pokemonElement) => {
    $pokemonElement.innerHTML = pokemons ? Template.getPokemonsTemplate(pokemons) : ''
  },
  renderPokemonFiltered: (pokemon, $pokemonElement) => {
    $pokemonElement.innerHTML = pokemon ? Template.getPokemonFilteredTemplate(pokemon) : ''
  },
  renderPaginate: (urlNext,urlPrev,paginaAtual,totalitens, $paginate) => {
    $paginate.innerHTML =  Template.getPaginateTemplate(urlNext,urlPrev,totalitens,paginaAtual)
  },
  renderBotaoBackList: (paginaAtual, $btnBackList) => {
    $btnBackList.innerHTML = paginaAtual !== null && paginaAtual > 1 ?  `<button id="btn-back-list" type="button" class="btn btn-outline-secondary btn-sm back-list shadow-none">Voltar ao início</button>`: ''
  },
  renderDropdownOptionQtyItens: (error, $dropdownMenuButtonPage) => {
    $dropdownMenuButtonPage.innerHTML = error ? '' : Template.getdropdownMenuButtonPageTemplate()
  },
  renderError:(error, $errorSection) => {
    $errorSection.innerHTML = error ?  Template.getErrorTemplate(error) : ''
  }
}

const Template = {
  getPokemonsTemplate: (pokemons) => {
    const pokemonsTemplate = pokemons.map(poke => {
      return `
      <div class="col-sm-3 mb-3">
        <div class="card rounded-3 ${poke.types[0].type.name}">
          <img class="card-img-top p-5" src="https://pokeres.bastionbot.org/images/pokemon/${poke.id}.png" alt="...">
          <div class="card-body">
            <h5 class="card-title text-center">${poke.name}</h5>
          </div>
        </div>
      </div> 
      `
    }).join("")
    return `${pokemonsTemplate}`
  },
  getPokemonFilteredTemplate: (pokemon) => {
    const pokemonTemplate = `<div class="col-sm-3 m-auto">
      <div class="card rounded-3 ">
        <img class="card-img-top p-5" src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png" alt="...">
        <div class="card-body">
          <h5 class="card-title text-center">${pokemon.name}</h5>
        </div>
      </div>
    </div> 
    `
    return `${pokemonTemplate}`
  },
  getPaginateTemplate: (urlNext,urlPrev, totalitens, paginaAtual) => {
    return `
    <div class="container">
    <div class="controls">
    <nav aria-label="Page navigation">
    <ul class="pagination mb-0">
      <li class="page-item">
        <div class="page-link prev ${urlPrev ? 'd-block' : 'd-none'}" aria-label="Previous">
        &laquo;
        </div>
      </li>
      <li class="page-item"><a class="page-link" href="!#">${paginaAtual}</a></li>
      <li class="page-item">
        <div class="page-link next ${urlNext ? 'd-block' : 'd-none'}" aria-label="Next">
        &raquo;
        </div>
      </li>
    </ul>
  </nav>
  <div class="qty-itens">Total de itens: ${totalitens}</div>
  </div>

  </div>`
  },
  getdropdownMenuButtonPageTemplate: () => {
    return `
    <button class="btn btn-outline-secondary btn-sm back-list shadow-none dropdown-toggle" type="button" id="dropdownMenuButtonPage" data-bs-toggle="dropdown" aria-expanded="false">
    Quantidade
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonPage" style="width: 50%;">
      <li><input class="qtdPerPage" type="text" value="4" disabled></li>
      <li><input class="qtdPerPage" type="text" value="8" disabled></li>
      <li><input class="qtdPerPage" type="text" value="12" disabled></li>
      <li><input class="qtdPerPage" type="text" value="16" disabled></li>
    </ul>
    `
  },
  getErrorTemplate:(error) => {
    return `
      <div class="alert alert-primary" role="alert">
      <button type="button" class="btn-close me-4" data-bs-dismiss="alert" aria-label="Close"></button>
          ${error}
      </div>` 
  },
  clearPaginate:($paginate) =>{
    $paginate.innerHTML = ''
  }
}


