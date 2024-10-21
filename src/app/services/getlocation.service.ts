import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetlocationService {
  apiDomain: string = environment.apiDomain;
  url:string = 'https://maps.googleapis.com/maps/api/geocode/json';
  constructor(private http: HttpClient) {}


 getLocation(address:string):Observable<any> {

  const requestUrl = {address};
  return this.http.post<any>(this.apiDomain+"/api/Location/save-location", {address: address} );

 }

  // getUserLocation(): Promise<{ Latitude: number, Longitude: number }> 
  // { return new Promise((resolve, reject) => { if (navigator.geolocation) 
  //   { navigator.geolocation.getCurrentPosition( (position) =>
  //      { const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
  //       resolve(coords); }, 
  //       (error) => { reject('Unable to retrieve location. Please enable location services.'); } ); }
  //        else { reject('Geolocation is not supported by this browser.'); } }); }
}
