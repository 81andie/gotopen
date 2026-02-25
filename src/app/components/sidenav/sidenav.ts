import { CommonModule } from '@angular/common';
import { Component, effect, inject, Inject, PLATFORM_ID } from '@angular/core';
import { GotGeoService } from '../../../services/GotGeo.service';
import { GotGeoJson } from '../../../interfaces/got.interface';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {

      constructor(@Inject(PLATFORM_ID) platformId: Object) {

    effect(() => {
    this.opened = !!this.localization()
    });

 

  }


 private mapState = inject(GotGeoService)
 public localization = this.mapState.selectLocation
 opened = false;




  toggle() {
  if (this.localization()) return;
  this.opened = true

  }


  clear() {

    this.opened = false;
  }


}
