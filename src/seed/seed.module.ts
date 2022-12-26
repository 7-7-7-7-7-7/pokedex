import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from "../pokemon/pokemon.module";
import { CommonModule } from "../common/common.module";

@Module({
  imports: [
    CommonModule,
    PokemonModule
  ],
  controllers: [SeedController],
  providers: [SeedService]
})
export class SeedModule {}
