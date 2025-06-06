// Importa utilidades de testing de Angular
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

// Importa el componente a probar
import { AppComponent } from './app.component';

// Describe: Define un grupo de pruebas para el AppComponent
describe('AppComponent', () => {
  // Configuración asíncrona antes de cada prueba
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // Módulo de testing para router
      declarations: [AppComponent] // Declara el componente a probar
    }).compileComponents(); // Compila el componente y su plantilla
  }));

  // Prueba: Verifica que el componente se crea correctamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // Crea instancia
    const app = fixture.debugElement.componentInstance; // Obtiene instancia
    expect(app).toBeTruthy(); // Comprueba que existe
  });

  // Prueba: Verifica que el título es correcto
  it(`should have as title 'angulardark'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('angulardark'); // Comprueba el título
  });

  // Prueba: Verifica que el título se renderiza correctamente
  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // Detecta cambios
    const compiled = fixture.debugElement.nativeElement; // Obtiene el DOM
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to angulardark!'
    ); // Verifica contenido
  });
});