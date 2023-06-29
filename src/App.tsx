import axios from "axios";
import { useEffect, useState } from "react";
import './App.css'

interface PokemonListItem {
  name: string;
  url: string;
}

function fetchPokemons (offset: number) {
  return axios.get('https://pokeapi.co/api/v2/pokemon?limit=20&offset='+offset)
}

function usePokemon (offset: number) {
  const [data, setData] = useState<PokemonListItem[]>([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState<Error>();

  useEffect(() => {
    fetchPokemons(offset)
      .then((response) => {
        setData(response.data.results);
        setStatus('success');
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
      })
  },[offset])

  return {
    data,
    status,
    error,
  }
}

function useOffset (initalOffset: number) {
  const [offset, setOffsetInternal] = useState(initalOffset);
  const setOffset = (offset: number) => {
    if(offset < 0) {
      setOffsetInternal(0);
    }
    setOffsetInternal(offset);
  }
  return {
    offset,
    setOffset,
  }
}

function App() {
  const {offset, setOffset} = useOffset(0);
  const { data, status, error } = usePokemon(offset);

  const fetchPrevious = () => {
    setOffset(offset - 20);
  }

  const fetchNext = () => {
    setOffset(offset + 20);
  }

  if(status === 'loading') return (<h1>Cargando...</h1>);

  if(status === "error") {
    return (
      <>
        <h1>Ha ocurrido un error</h1>
        <pre>{error?.message}</pre>
      </>
    )
  }
  
  if(status === 'success' && data.length === 0) return (<h1>No hay pokemones</h1>)

  return ( 
    <>
      <h1>Pokemons</h1>
      <button onClick={fetchPrevious}>previous</button>
      <button onClick={fetchNext}>next</button>
      <ul>
        {data.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
    </> 
  )
}

export default App
