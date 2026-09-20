import { Injectable, OnModuleInit } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { EmbeddingService } from './embedding.service';

@Injectable()
export class RagService implements OnModuleInit {

  private readonly client = new QdrantClient({
    url: process.env.QDRANT_URL,
  });

  private readonly collection =
    process.env.QDRANT_COLLECTION || 'documents';

  constructor(
    private readonly embeddingService: EmbeddingService,
  ) {}

  async onModuleInit() {
    const collections = await this.client.getCollections();

    const exists = collections.collections.some(
      c => c.name === this.collection,
    );

    if (!exists) {
      await this.client.createCollection(this.collection, {
        vectors: {
          size: 1536,
          distance: 'Cosine',
        },
      });
    }
  }

  async addDocument(
    id: number,
    text: string,
    filename: string,
  ) {

    const vector =
      await this.embeddingService.createEmbedding(text);

    await this.client.upsert(this.collection, {
      wait: true,

      points: [
        {
          id,

          vector,

          payload: {
            text,
            filename,
          },
        },
      ],
    });
  }


  async search(query: string) {

    const vector =
        await this.embeddingService
        .createEmbedding(query);

    const results =
        await this.client.search(
        this.collection,
        {
            vector,
            limit: 5,
            with_payload: true,
        },
        );

    return results.map(result => ({
        score: result.score,
        text: result.payload?.text,
        filename: result.payload?.filename,
    }));
    }
  
}