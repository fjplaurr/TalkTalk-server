import type {
  Collection,
  Db,
  DeleteResult,
  Document,
  InsertManyResult,
  UpdateResult,
} from 'mongodb';
import { MongoClient } from 'mongodb';
import type http from 'http';
import type { GetSeedsReturnType } from './seeds';
import { getSeeds } from './seeds';

const URL = process.env.MONGO_URI!;
const DATABASE_NAME = 'api-db';

// eslint-disable-next-line import/no-mutable-exports
export let server: http.Server;
class MongoDbService {
  private static instance: MongoDbService | null = null; // Static instance variable
  connection: MongoClient | null;
  private database: Db | null;
  private collection: Collection<Document> | null;
  private url: string;
  private count = 0;
  private databaseName: string;

  constructor() {
    this.connection = null;
    this.database = null;
    this.collection = null;
    this.url = URL;
    this.databaseName = DATABASE_NAME;
  }

  setCollection(collectionName: string): void {
    if (this.database !== null) {
      try {
        this.collection = this.database.collection<Document>(collectionName);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`It was not possible to set a collection:`, err);
      }
    }
  }

  async connectWithRetry(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Attempting MongoDB connection (will retry if needed)');
    try {
      this.connection = await MongoClient.connect(this.url);
      this.database = await this.connection.db(this.databaseName);
      // eslint-disable-next-line no-console
      console.log('MongoDB connection successful', this.databaseName);
    } catch (err) {
      const retrySeconds = 5;
      this.count += 1;
      // eslint-disable-next-line no-console
      console.log(
        `MongoDB connection unsuccessful (will retry #${this.count} after ${retrySeconds} seconds):`,
        err
      );
      setTimeout(this.connectWithRetry, retrySeconds * 1000);
    }
  }

  async close(): Promise<boolean> {
    if (this.connection != null) {
      await this.connection.close();
      return true;
    }
    return false;
  }

  async create<T extends Document>(document: T): Promise<boolean> {
    if (this.collection !== null) {
      const createdResult = await this.collection.insertOne(document);
      if (createdResult.acknowledged) {
        return true;
      }
    }
    return false;
  }

  async readOne<T extends Document>(filter: Partial<T>): Promise<T | null> {
    if (this.collection !== null) {
      const foundDocument: Promise<T | null> =
        this.collection.findOne<T>(filter);
      return foundDocument;
    }
    return null;
  }

  async readMany<T extends Document>(filter?: Partial<T>): Promise<T[] | null> {
    if (this.collection !== null) {
      const cursor = await this.collection.find<T>(filter ?? {});
      const foundDocuments = await cursor.toArray();
      return foundDocuments;
    }
    return null;
  }

  async update<T extends Document>(
    queryDocument: Partial<T>,
    updateDocument: Partial<T>
  ): Promise<UpdateResult | null> {
    if (this.collection !== null) {
      const updatedResult = await this.collection.updateOne(queryDocument, {
        $set: updateDocument,
      });
      return updatedResult;
    }
    return null;
  }

  async delete<T extends Document>(
    queryDocument: Partial<T>
  ): Promise<DeleteResult | null> {
    if (this.collection !== null) {
      const deletedDocument = await this.collection.deleteOne(queryDocument);
      return deletedDocument;
    }
    return null;
  }

  async aggregate(pipeline: Document[]): Promise<Document[] | null> {
    if (this.collection !== null) {
      const cursor = await this.collection.aggregate(pipeline);
      const aggregatedDocuments = await cursor.toArray();
      return aggregatedDocuments;
    }
    return null;
  }

  async dropDB(): Promise<boolean> {
    if (this.database === null) {
      return false;
    }
    return this.database.dropDatabase();
  }

  async dropCollection(): Promise<boolean> {
    if (this.collection !== null && this.database !== null) {
      return this.database?.dropCollection(this.collection.collectionName);
    }
    return false;
  }

  async createCollection(
    collectionName: string
  ): Promise<false | Collection<Document>> {
    if (this.database === null) {
      return false;
    }
    return this.database.createCollection(collectionName);
  }

  private async createMany<T extends Document>(
    documents: T[]
  ): Promise<InsertManyResult<Document> | null> {
    if (this.collection !== null) {
      const createdResults = await this.collection.insertMany(documents);
      return createdResults;
    }
    return null;
  }

  async seedDB(): Promise<boolean> {
    if (this.database !== null) {
      try {
        await this.dropDB();
        const seeds: GetSeedsReturnType = getSeeds();
        await Promise.all(
          seeds.map(async (seed) => {
            this.setCollection(seed.collectionName);
            await this.createMany(seed.data as Document[]);
          })
        );
        return true;
      } catch (error) {
        console.error('Error during seeding:', error);
        return false;
      }
    }
    return false;
  }
}

export default new MongoDbService();
