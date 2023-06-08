import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  apiUrl =  'http://localhost:1020/unicor-investigation/api/IrrigationSystem/';

  constructor(private http: HttpClient) { }

  getListAll() {
    return this.http.get(`${this.apiUrl}Datos/listAll`);
  }

}
