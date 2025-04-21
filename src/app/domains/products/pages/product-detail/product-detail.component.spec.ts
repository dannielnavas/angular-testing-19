import { DeferBlockBehavior } from '@angular/core/testing';
import {
  byTestId,
  createRoutingFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { RelatedComponent } from '@products/components/related/related.component';
import { generateFakeProduct } from '@shared/models/product.mock';
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

  const mockProduct = generateFakeProduct();

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    deferBlockBehavior: DeferBlockBehavior.Manual,
    providers: [
      mockProvider(ProductService, {
        getOneBySlug: jest.fn().mockReturnValue(of(mockProduct)),
      }),
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
});
