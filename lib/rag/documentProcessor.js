/**
 * @fileoverview Document Processing Pipeline implementation for the AI Learning Platform.
 * This module provides functionality to process PDF documents through three main stages:
 * 1. PDF loading and text extraction
 * 2. Intelligent text chunking with overlap
 * 3. Document vectorization using HuggingFace embeddings
 */

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";

/**
 * DocumentProcessor class handles the end-to-end processing of PDF documents.
 * It provides methods for loading PDFs, splitting them into chunks, and generating
 * vector embeddings for use in AI applications.
 */
export class DocumentProcessor {
  /**
   * Creates a new DocumentProcessor instance.
   * @param {string} hfApiKey - HuggingFace API key for accessing embedding models
   * @param {Object} [embeddings] - Optional custom embeddings instance for testing
   */
  constructor(hfApiKey, embeddings = null) {
    this.hfApiKey = hfApiKey;
    // Initialize embeddings with either provided instance or create new one
    this.embeddings = embeddings || new HuggingFaceInferenceEmbeddings({
      apiKey: hfApiKey,
      model: "sentence-transformers/all-mpnet-base-v2"
    });
  }

  /**
   * Loads and processes a PDF file.
   * @param {string} filePath - Path to the PDF file
   * @returns {Promise<Array>} Array of document objects containing text and metadata
   * @throws {Error} If file loading or processing fails
   */
  async loadPDF(filePath) {
    try {
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();
      return docs;
    } catch (error) {
      console.error("Error loading PDF:", error);
      throw error;
    }
  }

  /**
   * Splits documents into smaller chunks with overlap for better context preservation.
   * @param {Array} documents - Array of document objects to split
   * @param {Object} [options] - Optional configuration for chunking
   * @param {number} [options.chunkSize=1000] - Size of each chunk in characters
   * @param {number} [options.chunkOverlap=200] - Number of characters to overlap between chunks
   * @returns {Promise<Array>} Array of chunk objects with text and metadata
   * @throws {Error} If chunking process fails
   */
  async splitIntoChunks(documents, options = {}) {
    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: options.chunkSize || 1000,
        chunkOverlap: options.chunkOverlap || 200
      });

      const chunks = await splitter.splitDocuments(documents);
      return chunks;
    } catch (error) {
      console.error("Error splitting into chunks:", error);
      throw error;
    }
  }

  /**
   * Generates vector embeddings for text chunks using HuggingFace's model.
   * @param {Array} chunks - Array of text chunks to vectorize
   * @returns {Promise<Array>} Array of objects containing original content, vector embeddings, and metadata
   * @throws {Error} If vectorization process fails
   */
  async vectorize(chunks) {
    try {
      const vectors = await Promise.all(
        chunks.map(async (chunk) => {
          const vector = await this.embeddings.embedQuery(chunk.pageContent);
          return {
            content: chunk.pageContent,
            vector,
            metadata: chunk.metadata
          };
        })
      );
      return vectors;
    } catch (error) {
      console.error("Error during vectorization:", error);
      throw error;
    }
  }
}

export default DocumentProcessor;
