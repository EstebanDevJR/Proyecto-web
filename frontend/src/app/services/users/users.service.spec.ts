// Importa las utilidades de testing de Angular
import { TestBed } from '@angular/core/testing';

// Importa el servicio que se va a probar
import { UsersService } from './users.service';

// Describe: Define un grupo de pruebas relacionadas con el UsersService
describe('UsersService', () => {
  let service: UsersService; // Variable para almacenar la instancia del servicio

  // beforeEach: Se ejecuta antes de cada prueba (it)
  beforeEach(() => {
    // Configura el módulo de testing de Angular
    TestBed.configureTestingModule({});
    // Obtiene una instancia del servicio mediante inyección de dependencias
    service = TestBed.inject(UsersService);
  });

  // it: Define una prueba individual
  it('should be created', () => {
    // Afirma que el servicio se ha creado correctamente (no es null/undefined)
    expect(service).toBeTruthy();
  });
});