// Importación de herramientas de testing de Angular
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// Importación del componente a probar
import { Page404Component } from './page404.component';

// Suite de pruebas para el Page404Component
describe('Page404Component', () => {
  // Variables para la instancia del componente y su fixture
  let component: Page404Component;
  let fixture: ComponentFixture<Page404Component>;

  // Configuración asíncrona antes de cada prueba
  beforeEach(waitForAsync(() => {
    // Configuración del módulo de testing
    TestBed.configureTestingModule({
      imports: [Page404Component] // Importa el componente como standalone (si es Angular 14+)
    }).compileComponents(); // Compila el componente y su template
  }));

  // Configuración síncrona después de la compilación
  beforeEach(() => {
    // Crea una instancia del componente dentro del testing environment
    fixture = TestBed.createComponent(Page404Component);
    // Obtiene la instancia del componente
    component = fixture.componentInstance;
    // Dispara la detección de cambios inicial
    fixture.detectChanges();
  });

  // Prueba básica: Verifica que el componente se crea correctamente
  it('should create', () => {
    // Expectativa: que el componente exista (instancia creada correctamente)
    expect(component).toBeTruthy();
  });
});