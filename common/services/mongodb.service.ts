import { Collection, Db, Document, MongoClient } from 'mongodb';

const URL = 'mongodb://localhost:27017';
const DATABASE_NAME = 'api-db';

class MongoService {
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

  async setCollection(collectionName: string) {
    if (this.database === null) {
      // First call to setCollection. The connection hast not been set yet.
      await this.connectWithRetry();
    }
    this.collection = this.database!.collection<Document>(collectionName);
  }

  async connectWithRetry() {
    console.log('Attempting MongoDB connection (will retry if needed)');
    try {
      this.connection = await MongoClient.connect(this.url);
      this.database = await this.connection.db(this.databaseName);
      console.log('Connected to database', this.databaseName);
    } catch (err) {
      const retrySeconds = 5;
      this.count += 1;
      console.log(
        `MongoDB connection unsuccessful (will retry #${this.count} after ${retrySeconds} seconds):`,
        err
      );
      setTimeout(this.connectWithRetry, retrySeconds * 1000);
    }
  }

  async close() {
    if (this.connection != null) {
      this.connection.close();
    }
  }

  async create<T extends Document>(document: T) {
    if (this.collection !== null) {
      const createdResult = await this.collection.insertOne(document);
      return createdResult;
    }
    return null;
  }

  async readOne(queryDocument: Partial<Document>) {
    if (this.collection !== null) {
      const foundDocument = this.collection.findOne(queryDocument);
      return foundDocument;
    }
    return null;
  }

  async readMany(queryDocument: Partial<Document>) {
    console.log('this.collection', this.collection);
    if (this.collection !== null) {
      const cursor = await this.collection.find(queryDocument);
      const foundDocuments = await cursor.toArray();
      console.log({ foundDocuments });
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
      const deletedResult = await this.collection?.deleteOne(queryDocument);
      return deletedResult;
    }
    return null;
  }
}

export default new MongoService();