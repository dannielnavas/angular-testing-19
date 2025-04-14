import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Category } from '@shared/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<Category[]>(`${environment.apiUrl}/api/v1/categories`);
  }

  async getAllPromise(): Promise<Category[]> {
    const response = await fetch(`${environment.apiUrl}/api/v1/categories`);
    const data = await response.json();
    return data;
  }
}
