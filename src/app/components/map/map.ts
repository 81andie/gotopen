import { Component, inject, OnInit } from '@angular/core';
import Style from 'ol/style/Style';
import OverviewMap from 'ol/control/OverviewMap.js';
import { defaults as defaultControls } from 'ol/control/defaults.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { GotGeoService } from '../../../services/GotGeo.service';
import { GotGeometry } from '../../../interfaces/got.interface';
import { CommonModule } from '@angular/common';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Icon } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';


@Component({
  selector: 'app-map',
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Mapa implements OnInit {


  private gotGeoService = inject(GotGeoService)
  private markers: GotGeometry[] = []


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
      controls: defaultControls().extend([this.overviewMapControl]),
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

    this.getAlLocalize()


  }



  getAlLocalize() {

    this.gotGeoService.getLocalization().subscribe((data) => {



      const features = data.features.map((item) => {
        // console.log(item)

        const feature = new Feature({
          geometry: new Point(fromLonLat([item.geometry.coordinates[0], item.geometry.coordinates[1]]))
        })

        feature.setProperties({
          name: item.properties.real_place,
          image: item.properties.place_image
        });

        feature.setStyle(new Style({

          image: new Icon({
            src: 'assets/pin-point.png',
            scale: 0.1
          }),

        }));

        return feature
      })

      const vectorSource = new VectorSource({
        features: features,
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      this.map?.addLayer(vectorLayer)

      const element = document.getElementById('popup')!;

      const popup = new Overlay({
        element: element,
        positioning: 'bottom-center',
        stopEvent: false,
      });
      this.map?.addOverlay(popup);

      let popover: { dispose: () => void; } | undefined;
      function disposePopover() {
        if (popover) {
          popover.dispose();
          popover = undefined;
        }
      }

      this.map?.on('click', (evt) => {
        const feature = this.map?.forEachFeatureAtPixel(
          evt.pixel,
          (feature) => feature
        );

        disposePopover();
        if (feature) {
          const coordinates = (feature.getGeometry() as Point).getCoordinates()


          console.log(feature?.get('name'))

          element.innerHTML = `
           <div class="w-64 space-y-4 font-sans bg-stone-100 rounded-lg">

           <!-- Label -->
            <p class="text-xs uppercase tracking-widest text-stone-400">
             Localización
            </p>

            <!-- Título -->
          <h2 class="text-lg font-semibold text-black leading-tight">
           ${feature?.get('name')}
          </h2>

          <!-- Imagen -->
        <div class="overflow-hidden rounded-lg border border-white/10">
          <img
        src="${feature?.get('image')}"
        class="w-full h-36 object-cover"
        alt="
        <strong>${feature?.get('name')}"
      >
        </div>

        </div>
          `
          popup.setPosition(coordinates);

        } else {
          popup.setPosition(undefined);
        }
      })
    })


  }
}








