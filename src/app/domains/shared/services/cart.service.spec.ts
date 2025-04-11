import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { generateFakeProduct } from '@shared/models/product.mock';
import { Product } from '@shared/models/product.model';
import { CartService } from './cart.service';

describe('CartService', () => {
  let spectator: SpectatorService<CartService>;
  const createService = createServiceFactory(CartService);

  // Productos de prueba que se usarán en múltiples casos
  const mockProduct1: Product = generateFakeProduct({ price: 100 });
  const mockProduct2: Product = generateFakeProduct({ price: 200 });

  beforeEach(() => (spectator = createService()));

  it('should be created', () => {
    expect(spectator.service).toBeDefined();
  });

  describe('cart signal', () => {
    it('should start with an empty cart', () => {
      expect(spectator.service.cart()).toEqual([]);
      expect(spectator.service.cart().length).toBe(0);
    });
  });

  describe('addToCart method', () => {
    it('should add a product to the cart', () => {
      spectator.service.addToCart(mockProduct1);
      expect(spectator.service.cart()).toEqual([mockProduct1]);
      expect(spectator.service.cart().length).toBe(1);
    });

    it('should add multiple products to the cart', () => {
      spectator.service.addToCart(mockProduct1);
      spectator.service.addToCart(mockProduct2);

      expect(spectator.service.cart().length).toBe(2);
      expect(spectator.service.cart()).toEqual([mockProduct1, mockProduct2]);
    });

    it('should add the same product multiple times', () => {
      spectator.service.addToCart(mockProduct1);
      spectator.service.addToCart(mockProduct1);

      expect(spectator.service.cart().length).toBe(2);
      expect(spectator.service.cart()).toEqual([mockProduct1, mockProduct1]);
    });

    it('should handle edge case with product having zero price', () => {
      const zeroProduct = generateFakeProduct({ price: 0 });
      spectator.service.addToCart(zeroProduct);

      expect(spectator.service.cart().length).toBe(1);
      expect(spectator.service.cart()[0].price).toBe(0);
    });

    it('should handle edge case with product having negative price', () => {
      const negativeProduct = generateFakeProduct({ price: -50 });
      spectator.service.addToCart(negativeProduct);

      expect(spectator.service.cart().length).toBe(1);
      expect(spectator.service.cart()[0].price).toBe(-50);
    });
  });

  describe('total computed', () => {
    it('should calculate total price of products in cart', () => {
      spectator.service.addToCart(mockProduct1);
      expect(spectator.service.total()).toBe(100);

      spectator.service.addToCart(mockProduct2);
      expect(spectator.service.total()).toBe(300);
    });

    it('should return zero for empty cart', () => {
      expect(spectator.service.total()).toBe(0);
    });

    it('should handle negative prices in total calculation', () => {
      spectator.service.addToCart(mockProduct1); // price: 100
      const negativeProduct = generateFakeProduct({ price: -50 });
      spectator.service.addToCart(negativeProduct);

      expect(spectator.service.total()).toBe(50); // 100 + (-50) = 50
    });

    it('should handle floating point prices correctly', () => {
      const floatProduct1 = generateFakeProduct({ price: 10.5 });
      const floatProduct2 = generateFakeProduct({ price: 20.75 });

      spectator.service.addToCart(floatProduct1);
      spectator.service.addToCart(floatProduct2);

      expect(spectator.service.total()).toBeCloseTo(31.25);
    });

    it('should handle a large number of products', () => {
      // Añadir 100 productos con precio 1
      for (let i = 0; i < 100; i++) {
        const product = {
          ...mockProduct1,
          id: i,
          price: 1,
          title: `Product ${i}`,
        };
        spectator.service.addToCart(product);
      }

      expect(spectator.service.cart().length).toBe(100);
      expect(spectator.service.total()).toBe(100);
    });
  });
});
