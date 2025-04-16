import {
  createRoutingFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { generateFakeProduct } from '@shared/models/product.mock';
import { ProductService } from '@shared/services/product.service';
import ProductDetailComponent from './product-detail.component';

describe('ProductDetail', () => {
  let spectator: Spectator<ProductDetailComponent>;

  const mockProduct = generateFakeProduct();

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    providers: [mockProvider(ProductService)],
  });
  beforeEach(() => {
    spectator = createComponent({
      props: {
        slug: mockProduct.slug,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
