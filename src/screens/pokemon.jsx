import { useParams } from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";

const Pokemon = () => {
    const {id} = useParams();
    const [pokemon, setPokemon] = useState({});


    useEffect(() => {
        axios.get(`http://localhost:3000/api/pokemons/${id}`).then((response) => {
            console.log("🚀 ~ Pokemon ~ response:", response.data)
            setPokemon(response.data);
        }).catch((error) => {
            console.log("🚀 ~ Pokemon ~ error:", error)
        })
    }, [id])

    console.log("🚀 ~ Pokemon ~ id:", id)
    return (
        <div>
            <h1>Pokemon</h1>
            {/* <p>{pokemon.name}</p> */}
            <p>{pokemon.name?.french}</p>
            <p>{pokemon.type}</p>
            <p>{pokemon.base?.hp}</p>
            <p>{pokemon.base?.attack}</p>
            <p>{pokemon.base?.defense}</p>
            <img src={pokemon.image} alt={pokemon.name?.french} />
            <p>{pokemon.name?.chinese}</p>
            <p>{pokemon.name?.english}</p>
            <p>{pokemon.name?.japanese}</p>
            <p>{pokemon.name?.french}</p>
            <p>{pokemon.name?.german}</p>
        </div>
    )
}

export default Pokemon;