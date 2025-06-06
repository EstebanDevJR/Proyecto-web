import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCreateProjectComponent } from './modal-create-project.component';

describe('ModalCreateProjectComponent', () => {
  let component: ModalCreateProjectComponent;
  let fixture: ComponentFixture<ModalCreateProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCreateProjectComponent] // Importa el componente standalone
    })
    .compileComponents(); // Compila el componente y su template

    // Crea una instancia del componente para testing
    fixture = TestBed.createComponent(ModalCreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara la detección inicial de cambios
  });

  // Prueba básica de creación del componente
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy(); // Verifica que el componente existe
  });
});