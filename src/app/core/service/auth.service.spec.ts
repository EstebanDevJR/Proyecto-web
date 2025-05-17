// Importa las utilidades de testing de Angular
import { TestBed } from '@angular/core/testing';

// Importa el servicio a probar
import { AuthService } from './auth.service';

// Describe el conjunto de pruebas para AuthService
describe('AuthService', () => {
  let service: AuthService; // Variable para la instancia del servicio

  // Configuración antes de cada prueba
  beforeEach(() => {
    // Configura el módulo de testing
    TestBed.configureTestingModule({});
    
    // Obtiene una instancia del servicio
    service = TestBed.inject(AuthService);
  });

  // Prueba básica de creación del servicio
  it('should be created', () => {
    // Verifica que el servicio se haya instanciado correctamente
    expect(service).toBeTruthy();
  });
});