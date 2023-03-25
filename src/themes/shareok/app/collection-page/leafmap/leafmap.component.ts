import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import  * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import 'leaflet.markercluster';
import * as jsonData from '../../../assets/points.json';

@Component({
  selector: 'app-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.scss']
})
export class LeafmapComponent implements OnInit, AfterViewInit {

  // private map: L.Map;

  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement> | any;

  constructor() {}

  ngOnInit() {}

  private points: any = (jsonData as any).default;

  ngAfterViewInit() {

    const map = L.map(this.mapContainer.nativeElement).setView([35.1879507, -97.4421919], 4);

    L.tileLayer('https://maps.geoapify.com/v1/tile/maptiler-3d/{z}/{x}/{y}.png?apiKey=aed03ff936944702bbbd831228a1f2bc', {
      attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 3,
      id: 'osm-bright'
    } as any).addTo(map);

    let markers = L.markerClusterGroup();

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

    for (var point of this.points) {
      let splitted = point.latlng.split(",");
      let latlng: [number,number] = [splitted[0].trim() as number,splitted[1].trim() as number];
      let url: string = "/handle/"+point.uri;
      markers.addLayer(L.marker(latlng).bindPopup(`
        <a href="${url}">${point.sid}<br>${point.location}</a>
      `)
      );
    }
    map.addLayer(markers);
  }
}
