import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { generateFakeCategory } from '../models/category.mock';
import { Category } from '../models/category.model';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let spectator: SpectatorHttp<CategoryService>;
  const createHttp = createHttpFactory(CategoryService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('getAll', () => {
    it('should make a GET request to fetch all categories', () => {
      // Arrange
      const mockCategories: Category[] = [
        generateFakeCategory(),
        generateFakeCategory(),
      ];

      // Act
      spectator.service.getAll().subscribe(categories => {
        // Assert
        expect(categories).toEqual(mockCategories);
        expect(categories.length).toBe(2);
      });

      // Assert request
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );

      req.flush(mockCategories);
    });

    it('should handle empty response', () => {
      // Act
      spectator.service.getAll().subscribe(categories => {
        // Assert
        expect(categories).toEqual([]);
        expect(categories.length).toBe(0);
      });

      // Assert request
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
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
      spectator.service.getAll().subscribe({
        next: () => fail('should have failed with a server error'),
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      // Assert request and simulate error
      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush('Server error', errorResponse);
    });
  });

  describe('getAllPromise', () => {
    it('should fetch all categories using fetch API', async () => {
      // Arrange
      const mockCategories: Category[] = [
        generateFakeCategory(),
        generateFakeCategory(),
      ];

      // Mock global fetch
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockCategories),
      });

      // Act
      const result = await spectator.service.getAllPromise();

      // Assert
      expect(result).toEqual(mockCategories);
      expect(result.length).toBe(2);
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );
    });

    it('should handle empty response with fetch API', async () => {
      // Arrange
      // Mock global fetch
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce([]),
      });

      // Act
      const result = await spectator.service.getAllPromise();

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle network error with fetch API', async () => {
      // Arrange
      // Mock global fetch to reject
      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error('Network error'));

      // Act & Assert
      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle JSON parsing error with fetch API', async () => {
      // Arrange
      // Mock global fetch with JSON parse error
      global.fetch = jest.fn().mockResolvedValueOnce({
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
      });

      // Act & Assert
      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        'Invalid JSON'
      );
    });

    // it('should handle HTTP error status with fetch API', async () => {
    //   // Arrange
    //   const errorResponse = {
    //     ok: false,
    //     status: 404,
    //     statusText: 'Not Found',
    //   };

    //   // Mock global fetch with error status
    //   global.fetch = jest.fn().mockResolvedValueOnce(errorResponse);

    //   // We don't expect the JSON method to be called due to how the service is implemented,
    //   // but in a more robust implementation, you would check status before parsing JSON

    //   // Act
    //   const result = await spectator.service.getAllPromise();

    //   // Assert - in the current implementation, it would try to parse the response regardless of status
    //   // This test reveals a potential issue in the service implementation that should be fixed
    //   expect(fetch).toHaveBeenCalledWith(
    //     `${environment.apiUrl}/api/v1/categories`
    //   );
    // });
  });

  afterEach(() => {
    // Clean up mocks
    jest.restoreAllMocks();
  });
});
