import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GotGeometry, GotFeature, GotGeoJson } from '../interfaces/got.interface';

@Injectable({ providedIn: 'root' })

export class GotGeoService {

  constructor(private http: HttpClient) { }

  private geoLocalize = 'assets/prueba.geojson';

  private _selectLocation = signal<GotGeoJson | null>(null);
  private _searchLocation = signal<Array<GotFeature['properties'] & { latitude: number, longitude: number }>>([]);

  selectLocation = this._selectLocation.asReadonly();
  searchLocalition = this._searchLocation.asReadonly()


   getLocalizationPrueba(){
  return this.http.get<[GotGeometry]>(this.geoLocalize)
}

  getLocalization(): Observable<GotGeoJson> {
    return this.http.get<GotGeoJson>(this.geoLocalize)
  }


  setLocation(properties: GotGeoJson) {
    this._selectLocation.set(properties);
  }

  getLocalizationMarkers() {
    return this.http.get<[GotFeature]>(this.geoLocalize)
  }
  setSearchLocation(properties: Array<GotFeature['properties'] & { latitude: number, longitude: number }>) {
    this._searchLocation.set(properties)
  }



}
