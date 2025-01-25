/**
 * @fileoverview Example PDF Processing Script
 * Demonstrates the complete document processing pipeline by:
 * 1. Loading a sample PDF
 * 2. Splitting it into chunks
 * 3. Generating vector embeddings
 * 4. Displaying the results
 * 
 * This script serves as both a usage example and a verification
 * tool for the document processing pipeline.
 */

import { DocumentProcessor } from '../lib/rag/documentProcessor.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
dotenv.config();

// Set up path handling for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Main execution function that demonstrates the document processing pipeline
 */
async function main() {
    // Verify and retrieve the HuggingFace API key
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    if (!hfApiKey) {
        console.error('Please set HUGGINGFACE_API_KEY in your .env file');
        process.exit(1);
    }

    // Initialize the document processor
    const processor = new DocumentProcessor(hfApiKey);
    const pdfPath = join(__dirname, '../samples/test.pdf');

    try {
        // Step 1: Load and parse the PDF
        console.log('Loading PDF...');
        const docs = await processor.loadPDF(pdfPath);
        console.log(`Loaded ${docs.length} pages from PDF`);

        // Step 2: Split the document into chunks
        console.log('\nSplitting into chunks...');
        const chunks = await processor.splitIntoChunks(docs);
        console.log(`Created ${chunks.length} chunks`);
        
        // Print first chunk for verification
        console.log('\nFirst chunk content:', chunks[0].pageContent.substring(0, 150) + '...');

        // Step 3: Generate vector embeddings
        console.log('\nGenerating vectors...');
        const vectors = await processor.vectorize(chunks);
        console.log(`Generated vectors for ${vectors.length} chunks`);

        // Display sample results
        console.log('\nSample of processed content:');
        vectors.slice(0, 2).forEach((vec, i) => {
            console.log(`\nChunk ${i + 1}:`);
            console.log('Content:', vec.content.substring(0, 150) + '...');
            console.log('Vector dimension:', vec.vector.length);
            console.log('Metadata:', vec.metadata);
        });
    } catch (error) {
        console.error('Error processing PDF:', error);
        if (error.response) {
            console.error('API Response:', error.response.data);
        }
    }
}

// Execute the main function
main();
