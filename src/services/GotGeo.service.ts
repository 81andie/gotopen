import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GotGeometry, GotFeature, GotGeoJson } from '../interfaces/got.interface';

@Injectable({ providedIn: 'root' })

export class GotGeoService {

  constructor(private http: HttpClient) { }

  private geoLocalize = 'assets/prueba.geojson';

  private _selectLocation = signal<GotGeoJson | null>(null);

  selectLocation = this._selectLocation.asReadonly();

  getLocalization(): Observable<GotGeoJson> {
    return this.http.get<GotGeoJson>(this.geoLocalize)
  }


  setLocation(properties: GotGeoJson) {
    this._selectLocation.set(properties);
  }

  

}
