import { Direction, BidiModule } from '@angular/cdk/bidi';
import { AfterViewInit, Component, Inject, Renderer2 } from '@angular/core';
import { InConfiguration } from '@core';
import { ConfigService } from '@config';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header.component';
import { UnsubscribeOnDestroyAdapter } from '@shared';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    BidiModule,
    RouterOutlet,
  ],
})
export class MainLayoutComponent extends UnsubscribeOnDestroyAdapter implements AfterViewInit {
  direction!: Direction;
  public config!: InConfiguration;
  
  constructor(
    private configService: ConfigService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    super();
    this.config = this.configService.configData;
  }

  ngAfterViewInit(): void {
    // Set direction based on config
    this.direction = this.config.layout.rtl ? 'rtl' : 'ltr';
    
    if (this.config.layout.rtl) {
      this.setRTLSettings();
    } else {
      this.setLTRSettings();
    }

    // Set theme configurations (only non-layout affecting ones)
    this.setThemeConfigurations();
  }

  private setThemeConfigurations() {
    // Set sidebar color (visual only, not layout affecting)
    if (localStorage.getItem('menuOption')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('menuOption') as string
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'menu_' + this.config.layout.sidebar.backgroundColor
      );
      localStorage.setItem(
        'menuOption',
        'menu_' + this.config.layout.sidebar.backgroundColor
      );
    }

    // Set logo color
    if (localStorage.getItem('choose_logoheader')) {
      this.renderer.addClass(
        this.document.body,
        localStorage.getItem('choose_logoheader') as string
      );
    } else {
      this.renderer.addClass(
        this.document.body,
        'logo-' + this.config.layout.logo_bg_color
      );
    }
  }

  setRTLSettings() {
    document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
    this.renderer.addClass(this.document.body, 'rtl');
    localStorage.setItem('isRtl', 'true');
  }
  
  setLTRSettings() {
    document.getElementsByTagName('html')[0].removeAttribute('dir');
    this.renderer.removeClass(this.document.body, 'rtl');
    localStorage.setItem('isRtl', 'false');
  }
}