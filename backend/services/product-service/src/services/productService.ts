import prisma from '../prisma/client';
import { getRedisClient } from '../redis/client';
import { sendProductCreated } from '../kafka/producer';

export class ProductService {
  static async getAll() {
    const redis = getRedisClient();
    const cacheKey = 'products:all';
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const products = await prisma.product.findMany();
    await redis.set(cacheKey, JSON.stringify(products), 'EX', 60);
    return products;
  }

  static async getById(id: string) {
    const redis = getRedisClient();
    const cacheKey = `product:${id}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const product = await prisma.product.findUnique({ where: { id } });
    if (product) await redis.set(cacheKey, JSON.stringify(product), 'EX', 60);
    return product;
  }

  static async create(data: { name: string; price: number; stock: number }) {
    const product = await prisma.product.create({ data });

    const redis = getRedisClient();
    await redis.del('products:all'); // invalidate cache

    // Publish product-created event
    await sendProductCreated(product);

    return product;
  }
}