const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const pokemonContainer = document.getElementById("pokemon-container");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const types = document.getElementById("types-container");

const stats = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
const getAllStatCells = () => stats.map((stat) => document.getElementById(`${stat}`));
const statCells = getAllStatCells();

const fetchPokemonList = async () => {
  try {
    const res = await fetch('https://pokeapi-proxy.freecodecamp.rocks/api/pokemon');
    const data = await res.json();
    return data;
  }
  catch (err) {
    console.error("error fetching pokemon list: " + err);
  }
};
const fetchPokemonInfo = async (targetPokemon) => {
  try {
    const res = await fetch(`${targetPokemon.url}`);
    const data = await res.json();
    return data;
  }
  catch (err) {
    console.error("error fetching pokemonInfo: " + err);
  }
}

const updatePokemonInfo = (pokemonInfo) => {
  pokemonName.textContent = `${pokemonInfo.name.toUpperCase()}`;
  pokemonId.textContent = `#${pokemonInfo.id}`;
  weight.textContent = `Weight: ${pokemonInfo.weight}`;
  height.textContent = `Height: ${pokemonInfo.height}`;
  const img = document.createElement("img");
  img.id = "sprite"
  img.src = pokemonInfo.sprites.front_default;
  img.alt = `${pokemonInfo.name} front default sprite`;
  pokemonContainer.appendChild(img);
  const pokemonTypes = pokemonInfo.types;
  pokemonTypes.forEach((type) => {
    types.innerHTML += `<p class="types">${type.type.name.toUpperCase()}</p>`;
  });
};
const updatePokemonStats = (pokemonInfo) => {
  console.log(pokemonInfo.stats);
  const pokemonStats = pokemonInfo.stats;
  pokemonStats.forEach((stat) => {
    const tableCell = document.getElementById(`${stat.stat.name}`);
    tableCell.textContent = `${stat.base_stat}`;
  });
}
const resetPokemon = () => {
  pokemonName.textContent = "";
  pokemonId.textContent = "";
  weight.textContent = "";
  height.textContent = "";
  const images = document.querySelectorAll("#sprite");
  images.forEach((image) => image.remove());
  types.innerHTML = "";
  statCells.forEach((cell) => cell.textContent = "");
};
const updatePokemon = async () => {
  searchBtn.disabled = true;
  console.log("running");
  const input = searchInput.value.toLowerCase();
  await fetchPokemonList()
  .then ((pokemonList) => {
    return pokemonList.results.find((pokemon) => {
      if (input == pokemon.id || input == pokemon.name) {
        return pokemon;
      }
    });
  })
  .then ((targetPokemon) => {
    if (!targetPokemon) {
      alert("Pokémon not found");
      Promise.reject("target pokemon was undefined");
    } else return fetchPokemonInfo(targetPokemon);
  })
  .then ((pokemonInfo) => {
    updatePokemonInfo(pokemonInfo);
    updatePokemonStats(pokemonInfo);
    searchBtn.disabled = false;
  })
  .catch ((err) => {
    console.error("error updating pokemon page: " + err)
    searchBtn.disabled = false;
    });
};
searchBtn.addEventListener("click", () => {
  resetPokemon();
  updatePokemon();
}); 
searchInput.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
  resetPokemon();
  updatePokemon();
  }
}); 
searchInput.addEventListener("change", resetPokemon);
