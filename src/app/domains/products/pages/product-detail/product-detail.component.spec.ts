import { DeferBlockBehavior } from '@angular/core/testing';
import { faker } from '@faker-js/faker/.';
import {
  byTestId,
  createRoutingFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { RelatedComponent } from '@products/components/related/related.component';
import { generateFakeProduct } from '@shared/models/product.mock';
import { CartService } from '@shared/services/cart.service';
import { MetaTagsService } from '@shared/services/meta-tags.service';
import { ProductService } from '@shared/services/product.service';
import { of } from 'rxjs';
import ProductDetailComponent from './product-detail.component';

// Object.defineProperty(window, 'IntersectionObserver', {
//   writable: true,
//   configurable: true,
//   value: jest.fn(() => ({
//     observe: jest.fn(),
//     unobserve: jest.fn(),
//     disconnect: jest.fn(),
//   })),
// });

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

describe('ProductDetail', () => {
  let spectator: Spectator<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;
  let cartService: SpyObject<CartService>;

  const mockProduct = generateFakeProduct({
    images: [
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
    ],
  });

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    deferBlockBehavior: DeferBlockBehavior.Manual,
    providers: [
      mockProvider(ProductService, {
        getOneBySlug: jest.fn().mockReturnValue(of(mockProduct)),
      }),
      mockProvider(CartService),
      mockProvider(MetaTagsService),
    ],
  });
  beforeEach(() => {
    spectator = createComponent({
      // props: {
      //   slug: mockProduct.slug,
      // },

      detectChanges: false,
    });
    spectator.setInput('slug', mockProduct.slug);
    productService = spectator.inject(ProductService);
    cartService = spectator.inject(CartService);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('Should call the productService with the correct slug', () => {
    // Arrange
    // Act
    spectator.detectChanges();
    // Assert
    expect(productService.getOneBySlug).toHaveBeenCalledWith(mockProduct.slug);
  });

  it('Should display the product cover', () => {
    // Arrange
    // productService.getOneBySlug.mockReturnValue(of(mockProduct)); ya viene en el mockProvider
    // Act
    spectator.detectChanges();
    const img = spectator.query<HTMLImageElement>(byTestId('cover'));
    // Assert
    expect(img).toBeTruthy();
    expect(img?.src).toBe(mockProduct.images[0]);
  });

  it('Should load related products', async () => {
    spectator.detectChanges();
    await spectator.deferBlock().renderComplete();
    const related = spectator.query(RelatedComponent);
    expect(related).toBeTruthy();
  });

  it('Should change the cover when the image is clicked', () => {
    spectator.detectChanges();
    const gallery = spectator.query(byTestId('gallery'));
    const images = gallery?.querySelectorAll('img');
    expect(images).toHaveLength(mockProduct.images.length);
    if (images && images.length > 0) {
      spectator.click(images[1]);
      const cover = spectator.query<HTMLImageElement>(byTestId('cover'));
      expect(cover).toBeTruthy();
      expect(cover?.src).toBe(mockProduct.images[1]);
    }
  });

  it('Should add the product to the cart', () => {
    spectator.detectChanges();
    // const addToCartButton = spectator.query<HTMLButtonElement>();
    // expect(addToCartButton).toBeTruthy();
    spectator.click(byTestId('add-to-cart'));
    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
  });
});
