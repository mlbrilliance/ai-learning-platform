import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import { DocumentProcessor } from '../../lib/rag/documentProcessor.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let tempFiles: string[] = [];

  try {
    // Configure formidable to handle file uploads
    const form = formidable({
      keepExtensions: true,
      // Filter out non-PDF files
      filter: (part) => part.mimetype === 'application/pdf',
    });

    // Parse the form data
    const [fields, files] = await form.parse(req);
    
    const apiKey = fields.apiKey?.[0];
    const file = files.file?.[0];

    if (!apiKey) {
      return res.status(400).json({ error: 'HuggingFace API key is required' });
    }

    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    // Keep track of temporary file for cleanup
    tempFiles.push(file.filepath);

    // Initialize document processor
    const processor = new DocumentProcessor(apiKey);

    // Process the uploaded file
    const docs = await processor.loadPDF(file.filepath);
    const chunks = await processor.splitIntoChunks(docs);
    const vectors = await processor.vectorize(chunks);

    // Prepare the response data without sensitive information
    const responseData = {
      chunks: vectors.map(vec => ({
        content: vec.content,
        vector: vec.vector,
        metadata: vec.metadata
      }))
    };

    // Return the processing results
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error processing document:', error);
    return res.status(500).json({ 
      error: 'Failed to process document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  } finally {
    // Clean up all temporary files
    await Promise.all(
      tempFiles.map(filepath => 
        fs.unlink(filepath).catch(err => 
          console.error(`Failed to delete temporary file ${filepath}:`, err)
        )
      )
    );
  }
}
