import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from "mongoose";
import { Pokemon } from "./entities/pokemon.entity";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch(error) {
      if(error.code === 11000) {
        throw new BadRequestException(`Error trying to create a new pokemon: ${createPokemonDto.name} already exists`)
      }
      throw new BadRequestException(`Can't create a new pokemon, the error is ${error.message}`)
    }
  }

  async findAll() {
    return this.pokemonModel.find();
  }

  async findOne(term: string) {
    try {
      let pokemon;

      // Search by number
      if( !isNaN(+term)) {
        pokemon = await this.pokemonModel.findOne({ no: +term });
      }

      // Search by mongoId
      if (!pokemon && isValidObjectId(term)) {
        pokemon = await this.pokemonModel.findById(term);
      }

      // Search by name
      if (!pokemon) {
        let search = new RegExp(['^', term, '$'].join(''), 'i');
        pokemon = await this.pokemonModel.findOne({ name: search });
      }

      // ERROR: not found
      if(!pokemon) {
        throw new NotFoundException(`Pokemon #${term} does not exists in db!`);
      }

      return pokemon;

    } catch(error) {
      throw new BadRequestException(`Error getting the pokemon, the error is ${error.message}`);
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      if(error.code === 11000) {
        throw new BadRequestException(`Error trying to update pokemon: Poke no. already exists in db.`);
      }

      throw new InternalServerErrorException(`Error trying to update pokemon: ${error.message}`);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if(deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id ${id} does not exists in db!`);
    }

    return;
  }
}
