import { DOCUMENT, NgClass } from '@angular/common';
import { Component, Inject, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '@config';
import { InConfiguration, AuthService } from '@core';
import { FeatherIconsComponent } from '@shared/components/feather-icons/feather-icons.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    MatButtonModule,
    MatMenuModule,
    FeatherIconsComponent,
  ],
})
export class HeaderComponent implements OnInit {
  public config!: InConfiguration; // Configuración de la aplicación
  isNavbarCollapsed = true; // Estado del navbar móvil
  isOpenSidebar?: boolean; // Estado del sidebar
  docElement?: HTMLElement; // Referencia al elemento HTML
  isFullScreen = false; // Estado de pantalla completa
  userLogged: string | undefined = ''; // Nombre del usuario logueado

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2,
    public readonly elementRef: ElementRef,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    // Obtiene el nombre del usuario desde el servicio de autenticación
    this.userLogged = this.authService.getAuthFromSessionStorage().nombre;
  }

  ngOnInit() {
    this.config = this.configService.configData; // Carga la configuración
    this.docElement = document.documentElement; // Obtiene referencia al HTML
  }

  // Alternar pantalla completa
  callFullscreen() {
    if (!this.isFullScreen) {
      this.docElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }

  // Abrir/cerrar menú móvil
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }

  // Colapsar/expandir menú lateral
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
    }
  }

  // Cerrar sesión
  logout() {
    this.authService.logout();
  }
}