import {
  byTestId,
  createRoutingFactory,
  Spectator,
} from '@ngneat/spectator/jest';

import { generateFakeProduct } from '@shared/models/product.mock';
import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let spectator: Spectator<ProductComponent>;

  const createComponent = createRoutingFactory({
    component: ProductComponent,
  });

  const mockProduct = generateFakeProduct();

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput('product', mockProduct);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should display product title', () => {
    spectator.detectChanges();
    expect(spectator.query('h3')).toHaveText(mockProduct.title);
  });

  it('should display product title data-testid', () => {
    spectator.detectChanges();
    // const element = spectator.query('[data-testid="product-title"]');
    const element = spectator.query(byTestId('product-title'));
    expect(element).toHaveText(mockProduct.title);
  });
});
