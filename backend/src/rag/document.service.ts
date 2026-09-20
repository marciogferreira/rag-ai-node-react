import { Injectable } from '@nestjs/common';
import * as mammoth from 'mammoth';
import { RagService } from './rag.service';

@Injectable()
export class DocumentService {

  constructor(
    private readonly ragService: RagService,
  ) {}

  async processDocument(
    file: Express.Multer.File,
  ) {

    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    const text = result.value;

    const chunks = this.chunkText(text, 1000);

    for (let i = 0; i < chunks.length; i++) {

      await this.ragService.addDocument(
        Date.now() + i,
        chunks[i],
        file.originalname,
      );
    }

    return {
      filename: file.originalname,
      chunks: chunks.length,
    };
  }

  private chunkText(
    text: string,
    size: number,
  ): string[] {

    const chunks: string[] = [];

    for (
      let i = 0;
      i < text.length;
      i += size
    ) {
      chunks.push(
        text.substring(i, i + size),
      );
    }

    return chunks;
  }
}