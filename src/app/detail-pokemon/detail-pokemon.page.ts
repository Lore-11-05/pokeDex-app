import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PokemonService, PokemonDetail } from '../services/pokemon.service';

@Component({
  selector: 'app-detail-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
})
export class DetailPokemonPage implements OnInit {
  pokemon: PokemonDetail | null = null;
  pokemonId: string = '';  // 👈 AGREGAR ESTA VARIABLE
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID recibido:', id);  // 👈 Para depurar
    if (id) {
      this.pokemonId = id;  // 👈 ASIGNAR EL ID
      this.loadPokemon(id);
    } else {
      this.errorMessage = 'No se encontró el Pokémon';
      this.isLoading = false;
    }
  }

  loadPokemon(id: string) {
    this.isLoading = true;
    this.pokemonService.getPokemonDetail(id).subscribe({
      next: (data: PokemonDetail) => {
        this.pokemon = data;
        this.isLoading = false;
        console.log('Pokémon cargado:', data);  // 👈 Para depurar
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.errorMessage = 'Error al cargar el Pokémon';
        this.isLoading = false;
      }
    });
  }

  getPokemonImage(): string {
    if (!this.pokemon) return '';
    return this.pokemon.sprites.other?.['official-artwork']?.front_default ||
           this.pokemon.sprites.front_default ||
           'https://via.placeholder.com/150';
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      normal: 'medium',
      fire: 'danger',
      water: 'primary',
      grass: 'success',
      electric: 'warning',
      ice: 'light',
      fighting: 'danger',
      poison: 'secondary',
      ground: 'warning',
      flying: 'tertiary',
      psychic: 'tertiary',
      bug: 'success',
      rock: 'medium',
      ghost: 'dark',
      dark: 'dark',
      dragon: 'primary',
      steel: 'light',
      fairy: 'tertiary'
    };
    return colors[type] || 'medium';
  }

  getStatLabel(statName: string): string {
    const labels: Record<string, string> = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
      'speed': 'Velocidad'
    };
    return labels[statName] || statName;
  }
}