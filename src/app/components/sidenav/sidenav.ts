import { CommonModule } from '@angular/common';
import { Component, effect, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {

      constructor(@Inject(PLATFORM_ID) platformId: Object) {

    effect(() => {
      if (this.localization) {
        this.opened = true;
      }
    });

  }

 public localization = false
  opened = false;


  toggle() {
  if (!this.localization) return;
  this.opened = !this.opened;
  }


  clear() {

    this.opened = false;
  }


}
