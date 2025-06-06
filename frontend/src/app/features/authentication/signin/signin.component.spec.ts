// Importación de herramientas de testing de Angular
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// Importación del componente a probar
import { SigninComponent } from './signin.component';

// Suite de pruebas para el componente SigninComponent
describe('SigninComponent', () => {
  // Variables para la instancia del componente y su fixture
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

  // Configuración asíncrona antes de cada prueba
  beforeEach(waitForAsync(() => {
    // Configuración del módulo de testing para el componente standalone
    TestBed.configureTestingModule({
      imports: [SigninComponent] // Importa el componente como standalone
    }).compileComponents(); // Compila el componente y su template
  }));

  // Configuración síncrona después de la compilación
  beforeEach(() => {
    // Crea una instancia del componente en el entorno de testing
    fixture = TestBed.createComponent(SigninComponent);
    // Obtiene la instancia del componente
    component = fixture.componentInstance;
    // Dispara la detección de cambios inicial para renderizar el componente
    fixture.detectChanges();
  });

  // Prueba básica de creación del componente
  it('should create', () => {
    // Verifica que el componente se haya creado correctamente
    expect(component).toBeTruthy();
  });
});