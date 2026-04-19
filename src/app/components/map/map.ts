import { Component, effect, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import Style from 'ol/style/Style';
import OverviewMap from 'ol/control/OverviewMap.js';
import { defaults as defaultControls } from 'ol/control/defaults.js';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { GotGeoService } from '../../../services/GotGeo.service';
import { GotGeometry, GotProperties } from '../../../interfaces/got.interface';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Icon } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { getDistance } from 'ol/sphere';
import * as olSphere from 'ol/sphere';
import type { Coordinate } from 'ol/coordinate';


import Overlay from 'ol/Overlay';
import StadiaMaps from 'ol/source/StadiaMaps';
import { boundingExtent } from 'ol/extent';


@Component({
  selector: 'app-map',
  imports: [CommonModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Mapa implements OnInit {


  private gotGeoService = inject(GotGeoService)
  public mapState = inject(GotGeoService);
  private markers: GotGeometry[] = []
  private vectorSource!: VectorSource;
  private overlay:any;

  public mapStateUpdate = inject(GotGeoService)

  isBrowser: any;

  constructor(@Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    effect(() => {
      const selected = this.mapStateUpdate.searchLocalition()
      if (!selected.length || !this.map) return
      const projectedCoords = selected.map(p =>
        fromLonLat([p.longitude, p.latitude])
      );

      if (projectedCoords.length === 1) {
        this.map.getView().animate({
          center: projectedCoords[0],
          zoom: 13,
          duration: 800,
        });
        return;
      }

      const extent = boundingExtent(projectedCoords);

      this.map.getView().fit(extent, {
        padding: [20, 20, 20, 20],
        duration: 800,
        maxZoom: 12,
      });




    })


  }

  private source = new OSM();


  private overviewMapControl = new OverviewMap({
    layers: [
      new TileLayer({
        source: new StadiaMaps({
          layer: 'alidade_smooth_dark',
          apiKey: '2a85ba10-edc8-416e-b902-4baccea6710d',
          retina: true,
        }),
      })
    ],


  })


  private map: Map | null = null;

  ngOnInit(): void {
    this.map = new Map({
      controls: defaultControls().extend([this.overviewMapControl]),
      layers: [
        new TileLayer({
          source: new StadiaMaps({
            layer: 'alidade_smooth',
            apiKey: '2a85ba10-edc8-416e-b902-4baccea6710d',
            retina: true,
          }),
        }),
      ],
      target: 'map',
      view: new View({
        center: [311158.68373997946, 5157606.481663526],
        zoom: 5,
      }),
    });

    this.getAlLocalize()
    this.getPrueba()
    this.getNearestPoint()



  }



  getAlLocalize() {

    this.mapState.getLocalization().subscribe((data) => {

      let feature;

      const features = data.features.map((item) => {

        feature = new Feature({
          geometry: new Point(fromLonLat([item.geometry.coordinates[0], item.geometry.coordinates[1]]))
        })


        feature.setProperties({
          id: item.properties.id,
          country: item.properties.country,
          name: item.properties.real_place,
          image: item.properties.place_image,
          actors: item.properties.actors,
          escene: item.properties.scene,
          series: item.properties.series,
          latitude: item.geometry.coordinates[0],
          longitude: item.geometry.coordinates[1]
        });

        feature.setStyle(new Style({

          image: new Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'assets/pin-point.png',
            scale: 0.060
          }),

        }));

        return feature
      })

      this.vectorSource = new VectorSource({
        features: features,
      });

      const vectorLayer = new VectorLayer({
        source: this.vectorSource,
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
          evt.pixel, (feature) => feature


        );



        disposePopover();
        if (feature) {
          const coordinates = (feature.getGeometry() as Point).getCoordinates()
          const coordinatesAll: [number, number] = [coordinates[0], coordinates[1]];

          // console.log(feature?.get('name'))

          element.innerHTML = `
           <div class="w-64 space-y-4 font-sans bg-stone-100 rounded-lg">

           <!-- Label -->
            <p class="text-xs uppercase tracking-widest text-stone-400">
             Localización
            </p>

            <!-- Título -->
          <h2 class="text-md font-semibold text-black leading-tight">
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

          this.mapState.setLocation({
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: coordinatesAll
              },
              properties: {
                real_place: feature.get('name'),
                place_image: feature.get('image'),
                latitude: feature.get('latitude'),
                longitude: feature.get('longitude'),
                id: feature.get('id'),
                series: feature.get('series'),
                scene: feature.get('scene'),
                country: feature.get('country'),
                actors: feature.get('actors'),
                place_logo: ''
              }




            }]




          });


        } else {
          popup.setPosition(undefined);
        }

      })

    })

  }


  getPrueba() {

    this.gotGeoService.getLocalizationPrueba().subscribe((data: GotGeometry[]) => {
      this.map?.on('dblclick', (event) => {
        this.map?.forEachFeatureAtPixel(event.pixel, (feature) => {

          const properties = feature.getProperties() as GotProperties;

          const geometry = feature.getGeometry() as Point;
          const coordinates = geometry.getCoordinates();

          const [longitude, latitude] = toLonLat((feature.getGeometry() as Point).getCoordinates());
          this.mapStateUpdate.setSearchLocation([{ ...properties, longitude: longitude, latitude: latitude, }])


        });
      });


    })


  }


  getNearestPoint() {

    const container = document.getElementById('popupClickLocalization')!;
    const content = document.getElementById('popup-content1');
    const closer = document.getElementById('popup-closer1')!;

    if (!this.overlay) {
    this.overlay = new Overlay({
      element: container,
      autoPan: { animation: { duration: 250 } },
    });
    this.map?.addOverlay(this.overlay);

    // ⚡ Evento de cierre
    closer.onclick = () => {
      this.overlay.setPosition(undefined);

      return false;
    };
  }


    this.map?.addOverlay(this.overlay);


    this.map?.on('singleclick', (evt) => {

      if (!this.vectorSource) return;

      const clickCoordinate = evt.coordinate;

      content!.innerHTML = '<p>Estás aquí:</p>';
      this.overlay.setPosition(clickCoordinate);

      const closestFeature = this.vectorSource.getClosestFeatureToCoordinate(clickCoordinate);

      if (!closestFeature) return;

      const geometry = closestFeature.getGeometry() as Point;
      const closestCoordinate = geometry.getCoordinates();

      this.map?.getView().animate({
        center: closestCoordinate,
        zoom: 18,
        duration: 800,
      });



    })


  }

}








