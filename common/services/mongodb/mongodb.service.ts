import { Collection, Db, Document, MongoClient } from 'mongodb';
import http from 'http';
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

  setCollection(collectionName: string) {
    if (this.database !== null) {
      try {
        this.collection = this.database.collection<Document>(collectionName);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`It was not possible to set a collection:`, err);
      }
    }
  }

  async connectWithRetry() {
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

  async close() {
    if (this.connection != null) {
      await this.connection.close();
    }
  }

  async create<T extends Document>(document: T) {
    if (this.collection !== null) {
      const createdResult = await this.collection.insertOne(document);
      return createdResult;
    }
    return null;
  }

  async readOne<T, U extends Partial<T>>(queryDocument: U): Promise<T | null> {
    if (this.collection !== null) {
      const foundDocument: Promise<T | null> =
        this.collection.findOne<T>(queryDocument);
      return foundDocument;
    }
    return null;
  }

  async readMany(queryDocument: Partial<Document>) {
    if (this.collection !== null) {
      const cursor = await this.collection.find(queryDocument);
      const foundDocuments = await cursor.toArray();
      return foundDocuments;
    }
    return null;
  }

  async update<T extends Document>(
    queryDocument: Partial<T>,
    updateDocument: Partial<T>
  ) {
    if (this.collection !== null) {
      const updatedResult = await this.collection.updateOne(queryDocument, {
        $set: updateDocument,
      });
      return updatedResult;
    }
    return null;
  }

  async delete<T extends Document>(queryDocument: Partial<T>) {
    if (this.collection !== null) {
      const deletedDocument = await this.collection.deleteOne(queryDocument);
      return deletedDocument;
    }
    return null;
  }

  async aggregate(pipeline: Document[]) {
    if (this.collection !== null) {
      const cursor = await this.collection.aggregate(pipeline);
      const aggregatedDocuments = await cursor.toArray();
      return aggregatedDocuments;
    }
    return null;
  }

  async dropDB() {
    return this.database?.dropDatabase();
  }

  async dropCollection() {
    if (this.collection !== null) {
      return this.database?.dropCollection(this.collection.collectionName);
    }
    return null;
  }

  async createCollection(collectionName: string) {
    this.database?.createCollection(collectionName);
  }

  async createMany<T extends Document>(documents: T[]) {
    if (this.collection !== null) {
      const createdResults = await this.collection.insertMany(documents);
      return createdResults;
    }
    return null;
  }

  async seedDB() {
    if (this.database !== null) {
      await this.dropDB();
      const seeds = await getSeeds();
      seeds.forEach(async (seed) => {
        this.setCollection(seed.collectionName);
        await this.createMany(seed.data as Document[]);
      });
    }
  }
}

export default new MongoDbService();
