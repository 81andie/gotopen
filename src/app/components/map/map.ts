import { Component } from '@angular/core';
import Style from 'ol/style/Style';
import OverviewMap from 'ol/control/OverviewMap.js';
import {defaults as defaultControls} from 'ol/control/defaults.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';



@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Mapa {



private source = new OSM();
private overviewMapControl = new OverviewMap({
layers: [
    new TileLayer({
      source: this.source,
    }),
  ],


})


private map: Map | null = null;

  ngOnInit(): void {
    this.map = new Map({
      controls :defaultControls().extend([this.overviewMapControl]),
      layers: [
        new TileLayer({
          source: this.source,
        }),
      ],
      target: 'map',
      view: new View({
        center: [311158.68373997946, 5157606.481663526],
        zoom: 14,
      }),
    });

  }
}





