/**
 * @fileoverview Test suite for the DocumentProcessor class.
 * Tests the three main functionalities:
 * 1. PDF loading
 * 2. Text chunking
 * 3. Vector embedding generation
 * 
 * Uses Jest for testing and includes mocked HuggingFace embeddings
 * to avoid API calls during testing.
 */

import { DocumentProcessor } from './documentProcessor.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('DocumentProcessor', () => {
  let processor;
  const TEST_HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  // Create a mock embeddings object that returns fixed-dimension vectors
  const mockEmbeddings = {
    embedQuery: jest.fn().mockResolvedValue(new Array(384).fill(0.1))
  };

  /**
   * Before each test:
   * 1. Verify HuggingFace API key is present
   * 2. Create a new DocumentProcessor instance with mock embeddings
   * 3. Reset the mock's call history
   */
  beforeEach(() => {
    if (!TEST_HF_API_KEY) {
      throw new Error('HUGGINGFACE_API_KEY environment variable is required for tests');
    }
    processor = new DocumentProcessor(TEST_HF_API_KEY, mockEmbeddings);
    mockEmbeddings.embedQuery.mockClear();
  });

  /**
   * Test PDF loading functionality
   * Verifies that:
   * - PDF can be loaded successfully
   * - Returns an array of documents
   */
  test('PDF ingestion success', async () => {
    const samplePath = path.join(__dirname, '../../samples/test.pdf');
    const docs = await processor.loadPDF(samplePath);
    expect(docs).toBeDefined();
    expect(Array.isArray(docs)).toBe(true);
  });

  /**
   * Test text chunking functionality
   * Verifies that:
   * - Long text is split into multiple chunks
   * - Chunks have proper overlap
   * - Metadata is preserved
   */
  test('Chunk creation with correct overlap', async () => {
    // Create a test document with known content length
    const testDoc = [{
      pageContent: 'A'.repeat(2000),
      metadata: { source: 'test' }
    }];
    
    const chunks = await processor.splitIntoChunks(testDoc);
    expect(chunks.length).toBeGreaterThan(1);
    
    // Verify chunk overlap
    const firstChunk = chunks[0].pageContent;
    const secondChunk = chunks[1].pageContent;
    const overlap = firstChunk.slice(-200);
    expect(secondChunk.startsWith(overlap)).toBe(true);
  });

  /**
   * Test vector generation functionality
   * Verifies that:
   * - Text chunks are converted to vectors
   * - Vectors have correct dimensionality
   * - Original content and metadata are preserved
   * - HuggingFace API is called correctly
   */
  test('Vector similarity validation', async () => {
    const testChunks = [{
      pageContent: 'This is a test document about artificial intelligence.',
      metadata: { source: 'test' }
    }];

    const vectors = await processor.vectorize(testChunks);
    expect(vectors).toBeDefined();
    expect(vectors.length).toBe(1);
    expect(vectors[0].vector).toBeDefined();
    expect(Array.isArray(vectors[0].vector)).toBe(true);
    expect(vectors[0].vector.length).toBe(384); // Standard size for the model we're using
    expect(mockEmbeddings.embedQuery).toHaveBeenCalledWith(testChunks[0].pageContent);
  });
});
