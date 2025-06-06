import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAssignUsersProjectsComponent } from './modal-assign-users-projects.component';

// Grupo de pruebas para el componente ModalAssignUsersProjectsComponent
describe('ModalAssignUsersProjectsComponent', () => {
  let component: ModalAssignUsersProjectsComponent;
  let fixture: ComponentFixture<ModalAssignUsersProjectsComponent>;

  // Configuración antes de cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAssignUsersProjectsComponent] // Importa el componente standalone
    })
    .compileComponents(); // Compila el componente y su template

    // Crea una instancia del componente para testing
    fixture = TestBed.createComponent(ModalAssignUsersProjectsComponent);
    component = fixture.componentInstance; // Obtiene la instancia del componente
    fixture.detectChanges(); // Dispara la detección inicial de cambios
  });

  // Prueba básica de creación del componente
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy(); // Verifica que el componente existe
  });
});