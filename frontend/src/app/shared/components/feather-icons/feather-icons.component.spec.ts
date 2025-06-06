// Importa utilidades de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente a probar
import { FeatherIconsComponent } from './feather-icons.component';

// Describe: Define un grupo de pruebas para el componente FeatherIconsComponent
describe('FeatherIconsComponent', () => {
  let component: FeatherIconsComponent; // Instancia del componente
  let fixture: ComponentFixture<FeatherIconsComponent>; // Entorno de prueba del componente

  // Configuración asíncrona antes de cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatherIconsComponent] // Importa el componente standalone
    }).compileComponents(); // Compila el componente y su plantilla
  });

  // Configuración síncrona antes de cada prueba
  beforeEach(() => {
    fixture = TestBed.createComponent(FeatherIconsComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Ejecuta el primer ciclo de detección de cambios
  });

  // Prueba básica: verifica que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Comprueba que el componente existe
  });
});