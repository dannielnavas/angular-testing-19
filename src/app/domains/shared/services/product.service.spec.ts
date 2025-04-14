import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { generateFakeProduct } from '../models/product.mock';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let spectator: SpectatorHttp<ProductService>;
  const createHttp = createHttpFactory(ProductService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('getOne', () => {
    it('should make a GET request to fetch a product by ID', () => {
      // Arrange
      const productId = '1';
      const mockProduct = generateFakeProduct({ id: 1 });

      // Act
      spectator.service.getOne(productId).subscribe(product => {
        // Assert
        expect(product).toEqual(mockProduct);
      });

      // Assert request
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/1`,
        HttpMethod.GET
      );

      req.flush(mockProduct);
    });

    it('should handle errors when fetching a product fails', () => {
      // Arrange
      const productId = '999';
      const errorResponse = new HttpErrorResponse({
        error: 'Product not found',
        status: 404,
        statusText: 'Not Found',
      });

      // Act & Assert
      spectator.service.getOne(productId).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => {
          expect(error.status).toBe(404);
          expect(error.error).toBe('Product not found');
        },
      });

      // Assert request and simulate error
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/999`,
        HttpMethod.GET
      );
      req.flush('Product not found', errorResponse);
    });

    it('should handle edge case with special characters in ID', () => {
      // Arrange
      const specialId = 'abc-123';
      const mockProduct = generateFakeProduct({ id: 123 });

      // Act
      spectator.service.getOne(specialId).subscribe();

      // Assert proper URL encoding
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/abc-123`,
        HttpMethod.GET
      );

      req.flush(mockProduct);
    });
  });

  describe('getOneBySlug', () => {
    it('should make a GET request to fetch a product by slug', () => {
      // Arrange
      const slug = 'test-product';
      const mockProduct = generateFakeProduct({ slug });

      // Act
      spectator.service.getOneBySlug(slug).subscribe(product => {
        // Assert
        expect(product).toEqual(mockProduct);
      });

      // Assert request
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/${slug}`,
        HttpMethod.GET
      );

      req.flush(mockProduct);
    });

    it('should handle errors when fetching by slug fails', () => {
      // Arrange
      const slug = 'non-existent-product';
      const errorResponse = new HttpErrorResponse({
        error: 'Product not found',
        status: 404,
        statusText: 'Not Found',
      });

      // Act & Assert
      spectator.service.getOneBySlug(slug).subscribe({
        next: () => fail('should have failed with a 404 error'),
        error: error => {
          expect(error.status).toBe(404);
          expect(error.error).toBe('Product not found');
        },
      });

      // Assert request and simulate error
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/${slug}`,
        HttpMethod.GET
      );
      req.flush('Product not found', errorResponse);
    });

    it('should handle edge case with special characters in slug', () => {
      // Arrange
      const specialSlug = 'product-with-spaces-&-symbols';
      const mockProduct = generateFakeProduct({ slug: specialSlug });

      // Act
      spectator.service.getOneBySlug(specialSlug).subscribe();

      // Assert proper URL handling
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/${specialSlug}`,
        HttpMethod.GET
      );

      req.flush(mockProduct);
    });
  });

  describe('getProducts', () => {
    it('should make a GET request without params', () => {
      // Arrange
      const mockProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
      ];

      // Act
      spectator.service.getProducts({}).subscribe(products => {
        // Assert
        expect(products).toEqual(mockProducts);
        expect(products.length).toBe(2);
      });

      // Assert request
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products`,
        HttpMethod.GET
      );

      req.flush(mockProducts);
    });

    it('should include category_id as a query param when provided', () => {
      // Arrange
      const params = { category_id: '5' };
      const mockProducts: Product[] = [generateFakeProduct()];

      // Act
      spectator.service.getProducts(params).subscribe();

      // Assert URL contains the query param
      const expectedUrl = new URL(`${environment.apiUrl}/api/v1/products`);
      expectedUrl.searchParams.set('categoryId', '5');

      const req = spectator.expectOne(expectedUrl.toString(), HttpMethod.GET);

      req.flush(mockProducts);
    });

    it('should include category_slug as a query param when provided', () => {
      // Arrange
      const params = { category_slug: 'electronics' };
      const mockProducts: Product[] = [generateFakeProduct()];

      // Act
      spectator.service.getProducts(params).subscribe();

      // Assert URL contains the query param
      const expectedUrl = new URL(`${environment.apiUrl}/api/v1/products`);
      expectedUrl.searchParams.set('categorySlug', 'electronics');

      const req = spectator.expectOne(expectedUrl.toString(), HttpMethod.GET);

      req.flush(mockProducts);
    });

    it('should include both params when category_id and category_slug are provided', () => {
      // Arrange
      const params = { category_id: '10', category_slug: 'clothing' };
      const mockProducts: Product[] = [generateFakeProduct()];

      // Act
      spectator.service.getProducts(params).subscribe();

      // Assert URL contains both query params
      const expectedUrl = new URL(`${environment.apiUrl}/api/v1/products`);
      expectedUrl.searchParams.set('categoryId', '10');
      expectedUrl.searchParams.set('categorySlug', 'clothing');

      const req = spectator.expectOne(expectedUrl.toString(), HttpMethod.GET);

      req.flush(mockProducts);
    });

    it('should handle empty response', () => {
      // Act
      spectator.service.getProducts({}).subscribe(products => {
        // Assert
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      // Assert request
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products`,
        HttpMethod.GET
      );

      req.flush([]);
    });

    it('should handle server errors', () => {
      // Arrange
      const errorResponse = new HttpErrorResponse({
        error: 'Server error',
        status: 500,
        statusText: 'Internal Server Error',
      });

      // Act & Assert
      spectator.service.getProducts({}).subscribe({
        next: () => fail('should have failed with a server error'),
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      // Assert request and simulate error
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products`,
        HttpMethod.GET
      );
      req.flush('Server error', errorResponse);
    });
  });

  describe('getRelatedProducts', () => {
    it('should make a GET request to fetch related products', () => {
      // Arrange
      const slug = 'main-product';
      const mockRelatedProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
      ];

      // Act
      spectator.service.getRelatedProducts(slug).subscribe(products => {
        // Assert
        expect(products).toEqual(mockRelatedProducts);
        expect(products.length).toBe(2);
      });

      // Assert request
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/${slug}/related`,
        HttpMethod.GET
      );

      req.flush(mockRelatedProducts);
    });

    it('should handle case with no related products', () => {
      // Arrange
      const slug = 'unique-product';

      // Act
      spectator.service.getRelatedProducts(slug).subscribe(products => {
        // Assert
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
      });

      // Assert request
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/${slug}/related`,
        HttpMethod.GET
      );

      req.flush([]);
    });

    it('should handle API errors when fetching related products', () => {
      // Arrange
      const slug = 'error-product';
      const errorResponse = new HttpErrorResponse({
        error: 'Failed to fetch related products',
        status: 503,
        statusText: 'Service Unavailable',
      });

      // Act & Assert
      spectator.service.getRelatedProducts(slug).subscribe({
        next: () => fail('should have failed with a service unavailable error'),
        error: error => {
          expect(error.status).toBe(503);
          expect(error.error).toBe('Failed to fetch related products');
        },
      });

      // Assert request and simulate error
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/${slug}/related`,
        HttpMethod.GET
      );
      req.flush('Failed to fetch related products', errorResponse);
    });
  });
});
