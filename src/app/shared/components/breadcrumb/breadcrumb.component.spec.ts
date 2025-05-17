// Importa utilidades de testing de Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa el componente a probar
import { BreadcrumbComponent } from './breadcrumb.component';

// Describe: Define un grupo de pruebas para el BreadcrumbComponent
describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent; // Instancia del componente
  let fixture: ComponentFixture<BreadcrumbComponent>; // Entorno de prueba del componente

  // beforeEach asíncrono para configuración inicial
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent] // Importa el componente standalone
    }).compileComponents(); // Compila el componente y su plantilla
  });

  // Segundo beforeEach para creación del componente
  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent); // Crea una instancia del componente
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Detecta cambios iniciales
  });

  // Prueba básica: verifica que el componente se crea correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Comprueba que el componente existe
  });
});