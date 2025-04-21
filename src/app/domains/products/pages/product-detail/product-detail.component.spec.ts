import {
  byTestId,
  createRoutingFactory,
  mockProvider,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { generateFakeProduct } from '@shared/models/product.mock';
import { ProductService } from '@shared/services/product.service';
import { of } from 'rxjs';
import ProductDetailComponent from './product-detail.component';

describe('ProductDetail', () => {
  let spectator: Spectator<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;

  const mockProduct = generateFakeProduct();

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
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
});
