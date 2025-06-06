// Importa utilidades de testing de Angular y el servicio a probar
import { TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects.service';

// Describe: agrupa pruebas relacionadas al servicio ProjectsService
describe('ProjectsService', () => {
  let service: ProjectsService; // Variable para almacenar la instancia del servicio

  // beforeEach: se ejecuta antes de cada prueba (it)
  beforeEach(() => {
    // Configura el módulo de testing (en este caso, vacío)
    TestBed.configureTestingModule({});
    // Obtiene una instancia del servicio mediante inyección de dependencias
    service = TestBed.inject(ProjectsService);
  });

  // Prueba individual: verifica que el servicio se crea correctamente
  it('should be created', () => {
    // expect(service).toBeTruthy(): afirma que la instancia del servicio existe
    expect(service).toBeTruthy();
  });
});