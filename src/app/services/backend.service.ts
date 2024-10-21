import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Item } from '../models/item';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  url: string = environment.apiDomain;
  constructor(private http: HttpClient) { }

  getAllItems():Observable<Item[]>{
    return this.http.get<Item[]>(`${this.url}/api/Item`)
  }

  addItem(i:Item):Observable<Item>{
    return this.http.post<Item>(`${this.url}/api/Item`, i)
  }

  addUser(u:User):Observable<User>{
    return this.http.post<User>(`${this.url}/api/User`, u)
  }

  deleteItem(i: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/api/Item/${i}`);
  }

  uploadImage(formData: FormData): Observable<any> {
    const imgurUrl = 'https://api.imgur.com/3/image';
    const clientId = this.getImgurClientId();
    
    return this.http.post<any>(imgurUrl, formData, {
      headers: {
        Authorization: `Client-ID ${clientId}`
      }
    });
  }

  getImgurClientId(): Observable<any> {
    return this.http.get<any>(`${this.url}/api/Imgur/client-id`);
  }

}
