import { Spectator, createRoutingFactory } from '@ngneat/spectator/jest';
import { generateFakeProduct } from '@shared/models/product.mock';
import { CartService } from '@shared/services/cart.service';
import { SearchComponent } from '../search/search.component';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let cartService: CartService;

  const createComponent = createRoutingFactory({
    component: HeaderComponent,
    imports: [SearchComponent],
    providers: [CartService],
  });

  beforeEach(() => {
    spectator = createComponent();
    cartService = spectator.inject(CartService);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should start with side menu hidden', () => {
      expect(spectator.component.hideSideMenu()).toBe(true);
    });

    it('should start with main menu hidden', () => {
      expect(spectator.component.showMenu()).toBe(false);
    });

    it('should start with empty cart', () => {
      expect(spectator.component.cart()).toEqual([]);
    });
  });

  describe('Menu toggle functionality', () => {
    it('should toggle main menu visibility', () => {
      // Estado inicial
      expect(spectator.component.showMenu()).toBe(false);

      // Primera activación
      spectator.component.toggleMenu();
      expect(spectator.component.showMenu()).toBe(true);

      // Segunda activación
      spectator.component.toggleMenu();
      expect(spectator.component.showMenu()).toBe(false);
    });

    it('should show/hide menu items when toggle button is clicked', () => {
      const menuButton = spectator.query(
        '[data-collapse-toggle="navbar-default"]'
      );
      const menuContainer = spectator.query('.flex-col.items-center');

      expect(menuContainer).toHaveClass('hidden');

      spectator.click(menuButton!);
      spectator.detectChanges();

      expect(menuContainer).not.toHaveClass('hidden');
    });
  });

  describe('Side cart functionality', () => {
    it('should toggle side menu visibility', () => {
      // Estado inicial
      expect(spectator.component.hideSideMenu()).toBe(true);

      // Primera activación
      spectator.component.toogleSideMenu();
      expect(spectator.component.hideSideMenu()).toBe(false);

      // Segunda activación
      spectator.component.toogleSideMenu();
      expect(spectator.component.hideSideMenu()).toBe(true);
    });

    it('should display correct number of items in cart', () => {
      const products = [generateFakeProduct(), generateFakeProduct()];
      products.forEach(product => cartService.addToCart(product));
      spectator.detectChanges();

      const cartCount = spectator.query('.bg-black.text-white');
      expect(cartCount?.textContent?.trim()).toBe('2');
    });

    // TODO: cambiar por byTestId para identificar el texto más fácil
    // it('should display correct total in side menu', () => {
    //   const product1 = generateFakeProduct({ price: 100 });
    //   const product2 = generateFakeProduct({ price: 200 });
    //   cartService.addToCart(product1);
    //   cartService.addToCart(product2);

    //   spectator.component.toogleSideMenu();
    //   spectator.detectChanges();

    //   const totalElement = spectator.query('p');
    //   expect(totalElement?.textContent?.trim()).toHaveText('Total: 300');
    // });
  });

  describe('Cart integration', () => {
    it('should reflect cart service updates', () => {
      const product = generateFakeProduct();
      cartService.addToCart(product);
      spectator.detectChanges();

      expect(spectator.component.cart()).toEqual([product]);
      expect(spectator.component.cart().length).toBe(1);
    });

    it('should update total when cart changes', () => {
      const product = generateFakeProduct({ price: 150 });
      cartService.addToCart(product);
      spectator.detectChanges();

      expect(spectator.component.total()).toBe(150);
    });
  });

  describe('Edge cases', () => {
    //TODO: validar el error
    // it('should handle empty product images in cart', () => {
    //   const productWithoutImages = generateFakeProduct({ images: [] });
    //   cartService.addToCart(productWithoutImages);
    //   spectator.detectChanges();
    //   const productImage = spectator.query(
    //     'img[alt="' + productWithoutImages.title + '"]'
    //   );
    //   expect(productImage?.getAttribute('src')).toBeUndefined();
    // });
    // it('should handle undefined total', () => {
    //   // Simulamos un total indefinido
    //   Object.defineProperty(cartService, 'total', {
    //     get: () => signal(undefined),
    //   });
    //   spectator.detectChanges();
    //   spectator.component.toogleSideMenu();
    //   spectator.detectChanges();
    //   const totalElement = spectator.query('p');
    //   expect(totalElement?.textContent?.trim()).toBe('Total: ');
    // });
    // it('should handle rapid toggle clicks', () => {
    //   // Simular clics rápidos en el menú principal
    //   for (let i = 0; i < 5; i++) {
    //     spectator.component.toggleMenu();
    //   }
    //   expect(spectator.component.showMenu()).toBe(true);
    //   // Simular clics rápidos en el carrito lateral
    //   for (let i = 0; i < 5; i++) {
    //     spectator.component.toogleSideMenu();
    //   }
    //   expect(spectator.component.hideSideMenu()).toBe(true);
    // });
  });
});
