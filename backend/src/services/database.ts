// Mock Prisma Client for development when network is not available
interface MockMetric {
  id: string;
  metricType: string;
  zone: string;
  value: number;
  teamId: string;
  projectId?: string;
  timestamp: Date;
  metadata?: any;
  team?: { id: string; name: string };
  project?: { id: string; name: string };
}

interface MockPrismaClient {
  metric: {
    findMany: (args?: any) => Promise<MockMetric[]>;
    findUnique: (args: any) => Promise<MockMetric | null>;
    create: (args: any) => Promise<MockMetric>;
    update: (args: any) => Promise<MockMetric>;
    delete: (args: any) => Promise<MockMetric>;
    count: (args?: any) => Promise<number>;
  };
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  $queryRaw: (query: any) => Promise<any>;
}

class MockDatabaseService {
  private static instance: MockDatabaseService;
  public prisma: MockPrismaClient;
  private metrics: MockMetric[] = [];

  private constructor() {
    this.prisma = {
      metric: {
        findMany: async (args?: any) => {
          let result = [...this.metrics];
          if (args?.skip) result = result.slice(args.skip);
          if (args?.take) result = result.slice(0, args.take);
          return result;
        },
        findUnique: async (args: any) => {
          return this.metrics.find(m => m.id === args.where?.id) || null;
        },
        create: async (args: any) => {
          const metric: MockMetric = {
            id: Math.random().toString(36).substr(2, 9),
            ...args.data,
            timestamp: new Date(),
          };
          this.metrics.push(metric);
          return metric;
        },
        update: async (args: any): Promise<MockMetric> => {
          const index = this.metrics.findIndex(m => m.id === args.where.id);
          if (index >= 0) {
            this.metrics[index] = { ...this.metrics[index], ...args.data };
            return this.metrics[index]!;
          }
          throw new Error('Metric not found');
        },
        delete: async (args: any): Promise<MockMetric> => {
          const index = this.metrics.findIndex(m => m.id === args.where.id);
          if (index >= 0) {
            return this.metrics.splice(index, 1)[0]!;
          }
          throw new Error('Metric not found');
        },
        count: async () => this.metrics.length,
      },
      $connect: async () => {
        console.log('📊 Mock Database connected successfully');
      },
      $disconnect: async () => {
        console.log('📊 Mock Database disconnected successfully');
      },
      $queryRaw: async () => [{ result: 1 }],
    };
  }

  public static getInstance(): MockDatabaseService {
    if (!MockDatabaseService.instance) {
      MockDatabaseService.instance = new MockDatabaseService();
    }
    return MockDatabaseService.instance;
  }

  public async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export const db = MockDatabaseService.getInstance();
export default db;