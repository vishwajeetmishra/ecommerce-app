import { ProductController } from "../controllers/productController";

export const resolvers = {
  Query: {
    products: () => ProductController.getAll(),
    product: (_: any, { id }: { id: string }) => ProductController.getById(id),
  },
  Mutation: {
    createProduct: (_: any, args: { name: string; price: number; stock: number }) =>
      ProductController.create(args),
  },
  Product: {
    __resolveReference: (ref: { id: string }) => ProductController.getById(ref.id),
  },
};