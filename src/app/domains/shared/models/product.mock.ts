import { faker } from '@faker-js/faker';
import { Product } from './product.model';

export const generateFakeProduct = (data?: Partial<Product>): Product => ({
  id: faker.number.int(),
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price()),
  images: [faker.image.url()],
  creationAt: faker.date.past().toISOString(),
  category: {
    id: faker.number.int(),
    name: faker.commerce.department(),
    image: faker.image.url(),
    slug: faker.lorem.slug(),
  },
  slug: faker.lorem.slug(),
  ...data,
});
