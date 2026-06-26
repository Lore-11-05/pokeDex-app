import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-list-pokemons',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './list-pokemons.page.html',
  styleUrls: ['./list-pokemons.page.scss'],
})
export class ListPokemonsPage implements OnInit {
  pokemons: any[] = [];  
  loading: boolean = false;
  offset: number = 0;
  limit: number = 20;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.loading = true;
    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: (response: any) => {
        this.pokemons = response.results.map((pokemon: any, index: number) => ({
          ...pokemon,
          id: this.offset + index + 1
        }));
        this.loading = false;
        console.log('Pokémons cargados:', this.pokemons);
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  loadMore(event: any) {
    this.offset += this.limit;
    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: (response: any) => {
        const newPokemons = response.results.map((pokemon: any, index: number) => ({
          ...pokemon,
          id: this.offset + index + 1
        }));
        this.pokemons = [...this.pokemons, ...newPokemons];
        event.target.complete();
      },
      error: (error: any) => {
        console.error('Error:', error);
        event.target.complete();
      }
    });
  }
}