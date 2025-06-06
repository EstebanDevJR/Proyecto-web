import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from 'app/services/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ModalCreateUserComponent } from 'app/pages/modal-create-user/modal-create-user.component';
import { ModalEditUsersComponent } from 'app/pages/modal-edit-users/modal-edit-users.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatInputModule,
    MatTooltipModule,
    MatCardModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  // Columnas a mostrar en la tabla
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'action'];

  // Configuración del breadcrumb
  breadscrums = [
    {
      title: 'Gestión de usuarios',
      item: [],
      active: 'Datos básicos',
    },
  ];

  // Configuración de la tabla
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // Formulario de búsqueda
  userFormSearchFilter!: FormGroup;
  usersList: any[] = [];
  isLoading = false;

  // Filtros por defecto
  userDefaultFilterSearch: any = {
    name: undefined,
    email: undefined,
  }

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly userService: UsersService,
    private readonly dialogModel: MatDialog,
    private readonly _sanckBar: MatSnackBar
  ) { }
  
  ngOnInit(): void {
    this.createUserFormSearchFilter();
    this.getAllUserByAdministrator();
    this.setupFilterListeners();
  }

  /**
   * Crea el formulario de búsqueda
   */
  createUserFormSearchFilter() {
    this.userFormSearchFilter = this._formBuilder.group({
      name: [''],
      email: ['']
    });
  }

  /**
   * Configura los listeners para los cambios en los filtros
   */
  setupFilterListeners() {
    this.handleUserFilterChange('name', 'name');
    this.handleUserFilterChange('email', 'email');
  }

  /**
   * Convierte el ID del rol a su nombre correspondiente
   * @param rol_id ID del rol
   * @returns Nombre del rol
   */
  getRoleName(rol_id: number): string {
    switch (rol_id) {
      case 1: return 'Administrador';
      case 2: return 'Usuario';
      default: return 'Desconocido';
    }
  }

  /**
   * Obtiene información del estado/relación del usuario
   * @param user Usuario
   * @returns Información de estado
   */
  getUserStatus(user: any): string {
    if (user.rol_id === 1) {
      return 'Administrador';
    } else {
      return user.administrador_id ? `Asignado al Admin ${user.administrador_id}` : 'Usuario Libre';
    }
  }

  /**
   * Escucha cambios en los filtros y actualiza los resultados
   * @param controlName Nombre del control del formulario
   * @param filterKey Clave del filtro para la API
   */
  handleUserFilterChange(controlName: string, filterKey: string) {
    this.userFormSearchFilter.controls[controlName].valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((value: any) => {
      this.userDefaultFilterSearch[filterKey] = value;
      this.getAllUserByAdministrator({ 
        ...this.userDefaultFilterSearch, 
        [filterKey]: value 
      });
    });
  }

  /**
   * Obtiene todos los usuarios filtrados por administrador
   * @param filters Filtros de búsqueda
   */
  getAllUserByAdministrator(filters?: any): void {
    this.isLoading = true;
    this.userService.getAllUserByAdministrator(filters).subscribe({
      next: (response) => {
        this.usersList = response.users;
        this.dataSource.data = response.users;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this._sanckBar.open('Error al cargar usuarios', 'Cerrar', { 
          duration: 5000 
        });
      }
    });
  }

  /**
   * Abre el modal para crear un nuevo usuario
   */
  openModalCreateUser(): void {
    const dialogRef = this.dialogModel.open(ModalCreateUserComponent, {
      width: '820px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserByAdministrator();
      }
    });
  }

  /**
   * Abre el modal para editar un usuario existente
   * @param userInformation Datos del usuario a editar
   */
  openModalUpdateUsers(userInformation: any): void {
    const dialogRef = this.dialogModel.open(ModalEditUsersComponent, {
      width: '820px',
      disableClose: true,
      data: { user: userInformation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAllUserByAdministrator();
      }
    }); 
  }

  /**
   * Elimina un usuario
   * @param userId ID del usuario a eliminar
   */
  deleteUser(userId: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          this._sanckBar.open(response.message, 'Cerrar', { duration: 5000 });
          this.getAllUserByAdministrator();
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Error al eliminar el usuario';
          this._sanckBar.open(errorMessage, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }
}