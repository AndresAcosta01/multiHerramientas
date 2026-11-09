import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { HERRAMIENTAS } from './herramientas';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly herramientas = HERRAMIENTAS;
  protected readonly menuAbierto = signal(false);

  private readonly router = inject(Router);
  private readonly nombreDe = (url: string) => HERRAMIENTAS.find((h) => url.startsWith(h.ruta))?.nombre ?? HERRAMIENTAS[0].nombre;
  /** Nombre de la herramienta abierta, para la ruta de la barra superior. */
  protected readonly actual = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => this.nombreDe(e.urlAfterRedirects)),
    ),
    { initialValue: this.nombreDe(this.router.url) },
  );
}
