import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from "axios";
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from "../pokemon/entities/pokemon.entity";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {
  }

  private readonly axios: AxiosInstance = axios;

  async executeSeed() {
    // WARNING: This will delete all pokemon
    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.map(({ name, url }) => {
      const segments = url.split(('/'));
      const no: number = +segments[segments.length - 2];
      pokemonToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'SEED executed';
  }
}
