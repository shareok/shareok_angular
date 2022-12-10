import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import  * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.scss']
})
export class LeafmapComponent implements OnInit, AfterViewInit {

  // private map: L.Map;

  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement> | any;

  // private geopoints: any = jsonData;

  constructor() { }

  ngOnInit() {
    // console.log('Data', this.geopoints);
  }

  ngAfterViewInit() {

    // const map = L.map(this.mapContainer.nativeElement).setView([35.1879507, -97.4421919], 4);
    const map = L.map(this.mapContainer.nativeElement).setView([-37.82, 175.23], 13);

    L.tileLayer('https://maps.geoapify.com/v1/tile/maptiler-3d/{z}/{x}/{y}.png?apiKey=aed03ff936944702bbbd831228a1f2bc', {
      attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 3,
      id: 'osm-bright'
    } as any).addTo(map);

    let markers = L.markerClusterGroup();

    let addressPoints = [
      [-37.8210922667, 175.2209316333, "2"],
      [-37.8210819833, 175.2213903167, "3"],
      [-37.8210881833, 175.2215004833, "3A"],
      [-37.8211946833, 175.2213655333, "1"],
      [-37.8209458667, 175.2214051333, "5"],
      [-37.8208292333, 175.2214374833, "7"],
      [-37.8325816, 175.2238798667, "537"],
      [-37.8315855167, 175.2279767, "454"],
      [-37.8096336833, 175.2223743833, "176"],
      [-37.80970685, 175.2221815833, "178"],
      [-37.8102146667, 175.2211562833, "190"],
      [-37.8088037167, 175.2242227, "156"],
      [-37.8112330167, 175.2193425667, "210"],
      [-37.8116368667, 175.2193005167, "212"],
      [-37.80812645, 175.2255449333, "146"],
      [-37.8080231333, 175.2286383167, "125"],
      [-37.8089538667, 175.2222222333, "174"],
      [-37.8080905833, 175.2275400667, "129"]
    ];

    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = iconDefault;

    for (var a of addressPoints) {
      var b: [number, number] = [a[0] as number,a[1] as number];
      var marker = L.marker(b);
      var c: string = a[2] as string;
      // marker.bindPopup(`'&lt;a href=' + c + '&gt;' + c + '&lt;br/&gt;' + c + '&lt;/a&gt;'`);
      markers.addLayer(L.marker(b).bindPopup(`
      <a href="/">Sample</a><br>Norman, OK
      `)
      );
    }
    map.addLayer(markers);
  }
}
