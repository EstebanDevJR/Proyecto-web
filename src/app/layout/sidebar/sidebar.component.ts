import {
  Router,
  NavigationEnd,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { AuthService } from '@core';
import { RouteInfo } from './sidebar.metadata';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgScrollbar } from 'ngx-scrollbar';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    NgScrollbar,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    RouterLinkActive,
    NgClass,
  ],
})
export class SidebarComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  public sidebarItems!: RouteInfo[]; // Items del menú filtrados por rol
  public innerHeight?: number; // Altura de la ventana
  public bodyTag!: HTMLElement; // Referencia al body
  listMaxHeight?: string; // Altura máxima de la lista
  listMaxWidth?: string; // Ancho máximo de la lista
  userLogged: string | undefined = ''; // Nombre del usuario

  constructor(
    @Inject(DOCUMENT) private readonly _document: Document,
    private readonly _renderer: Renderer2,
    public readonly _elementRef: ElementRef,
    private readonly _authService: AuthService,
    private readonly _router: Router,
    private readonly _domSanitizer: DomSanitizer
  ) {
    super();
    // Cierra el sidebar al navegar (en móviles)
    this.subs.sink = this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this._renderer.removeClass(this._document.body, 'overlay-open');
      }
    });
  }

  // Maneja el redimensionamiento de la ventana
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }

  // Cierra el sidebar al hacer click fuera
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this._renderer.removeClass(this._document.body, 'overlay-open');
    }
  }

  // Alternar menús desplegables
  callToggleMenu(event: Event, length: number): void {
    if (!this.isValidLength(length) || !this.isValidEvent(event)) {
      return;
    }

    const parentElement = (event.target as HTMLElement).closest('li');
    if (!parentElement) return;

    const activeClass = parentElement.classList.contains('active');
    activeClass 
      ? this._renderer.removeClass(parentElement, 'active')
      : this._renderer.addClass(parentElement, 'active');
  }

  // Sanitiza HTML para prevenir XSS
  sanitizeHtml(html: string): SafeHtml {
    return this._domSanitizer.bypassSecurityTrustHtml(html);
  }

  ngOnInit() {
    // Filtra rutas por rol del usuario
    const rolAuthority = this._authService.getAuthFromSessionStorage().rol_id;
    this.sidebarItems = ROUTES.filter(item => item?.rolAuthority.includes(rolAuthority));
    this.initLeftSidebar();
    this.bodyTag = this._document.body;
  }

  // Inicializa el sidebar
  initLeftSidebar() {
    this.setMenuHeight();
    this.checkStatuForResize(true);
  }

  // Calcula altura del menú
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - 60; // Resta altura del header
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }

  // Verifica estado responsive
  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1025) {
      this._renderer.addClass(this._document.body, 'ls-closed');
    } else {
      this._renderer.removeClass(this._document.body, 'ls-closed');
    }
  }

  // Efectos hover - DISABLED to prevent sidebar movement
  mouseHover() {
    // Disabled to prevent sidebar following mouse
    // const body = this._elementRef.nativeElement.closest('body');
    // if (body.classList.contains('submenu-closed')) {
    //   this._renderer.addClass(this._document.body, 'side-closed-hover');
    //   this._renderer.removeClass(this._document.body, 'submenu-closed');
    // }
  }

  mouseOut() {
    // Disabled to prevent sidebar following mouse
    // const body = this._elementRef.nativeElement.closest('body');
    // if (body.classList.contains('side-closed-hover')) {
    //   this._renderer.removeClass(this._document.body, 'side-closed-hover');
    //   this._renderer.addClass(this._document.body, 'submenu-closed');
    // }
  }

  // Helpers de validación
  private isValidLength(length: number): boolean {
    return length > 0;
  }

  private isValidEvent(event: Event): boolean {
    return event && event.target instanceof HTMLElement;
  }
}