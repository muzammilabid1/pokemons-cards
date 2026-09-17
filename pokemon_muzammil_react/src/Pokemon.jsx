import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCard } from "./PokemonCard";
export const Pokemon = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const limit = 3;

  const api = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${
    (page - 1) * limit
  }`;

  const fetchData = async () => {
    try {
      const response = await fetch(api);
      const data = await response.json();

      setTotalPages(Math.ceil(data.count / limit));

      const detailsPokemonData = data.results.map(async (curPokemon) => {
        const response = await fetch(curPokemon.url);
        const pokemonData = await response.json();

        return pokemonData;
      });

      const detailsResponse = await Promise.all(detailsPokemonData);

      setPokemons(detailsResponse);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page]);

  if (loading) {
    return (
      <div>
        <h1>loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{error.message}</h1>
      </div>
    );
  }

  //* search functionality
  const searchData = pokemons.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <section className="container">
      <header>
        <h1>Let's Catch Pokemon</h1>
      </header>
      <div className="pokemon-search">
        <input
          type="text"
          placeholder="Search Pokemon"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <ul className="cards">
        {searchData.map((curPokemon) => (
          <PokemonCard key={curPokemon.id} data={curPokemon} />
        ))}
      </ul>
      {/*? pagination */}
      <section className="pagination">
        <button
          onClick={() => setPage((prevPage) => prevPage - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        {Array.from(
          {
            length: Math.min(5, totalPages),
          },
          (_, index) => {
            let pageNumber;

            if (page <= 3) {
              pageNumber = index + 1;
            } else if (page >= totalPages - 2) {
              pageNumber = totalPages - 4 + index;
            } else {
              pageNumber = page - 2 + index;
            }

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={page === pageNumber ? "active" : ""}
              >
                {pageNumber}
              </button>
            );
          },
        )}
        {page < totalPages - 2 && <span>...</span>}
        {page < totalPages - 1 && (
          <button onClick={() => setPage(totalPages)}>{totalPages}</button>
        )}
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </section>
    </section>
  );
};
