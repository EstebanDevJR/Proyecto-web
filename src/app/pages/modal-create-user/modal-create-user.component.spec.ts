// Importaciones necesarias para las pruebas
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCreateUserComponent } from './modal-create-user.component';

// Grupo de pruebas para el componente ModalCreateUserComponent
describe('ModalCreateUserComponent', () => {
  // Variables para la instancia del componente y su fixture
  let component: ModalCreateUserComponent;
  let fixture: ComponentFixture<ModalCreateUserComponent>;

  // Configuración antes de cada prueba
  beforeEach(async () => {
    // Configura el módulo de testing con el componente standalone
    await TestBed.configureTestingModule({
      imports: [ModalCreateUserComponent] // Importa el componente a probar
    })
    .compileComponents(); // Compila el componente y su template

    // Crea una instancia del componente para testing
    fixture = TestBed.createComponent(ModalCreateUserComponent);
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Dispara la detección inicial de cambios
  });

  // Prueba básica de creación del componente
  it('debería crearse correctamente', () => {
    // Verifica que el componente se haya instanciado correctamente
    expect(component).toBeTruthy();
  });
});