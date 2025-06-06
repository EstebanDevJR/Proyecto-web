// Importaciones necesarias para testing
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';

// Grupo de pruebas para el componente UsersComponent
describe('UsersComponent', () => {
  // Variables para la instancia del componente y su entorno de prueba
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;

  // Configuración antes de cada prueba
  beforeEach(async () => {
    // Configura el módulo de testing con el componente standalone
    await TestBed.configureTestingModule({
      imports: [UsersComponent] // Importa el componente a probar
    })
    .compileComponents(); // Compila el componente y su template

    // Crea una instancia del componente para testing
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Dispara la detección inicial de cambios
  });

  // Prueba básica de creación del componente
  it('debería crearse correctamente', () => {
    // Verifica que el componente se haya instanciado correctamente
    expect(component).toBeTruthy();
  });

});