// Importa utilidades de testing de Angular
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// Importa el componente a probar
import { MainComponent } from './main.component';

// Grupo de pruebas para MainComponent
describe('MainComponent', () => {
  // Variables para el componente y su entorno de prueba
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  // Configuración asíncrona antes de cada prueba
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [MainComponent] // Importa el componente standalone
    }).compileComponents(); // Compila el componente y su template
  }));

  // Configuración síncrona después de compilación
  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent); // Crea instancia del componente
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Dispara detección inicial de cambios
  });

  // Prueba básica de creación del componente
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy(); // Verifica que el componente existe
  });

  it('debería renderizar el título correctamente', () => {
  const compiled = fixture.nativeElement;
  expect(compiled.querySelector('h1').textContent).toContain('Dashboard');
  });

  it('debería mostrar secciones principales', () => {
    const sections = fixture.nativeElement.querySelectorAll('.section');
    expect(sections.length).toBeGreaterThan(0);
  });

});