/**
 * @fileoverview Test PDF Generator
 * Creates a sample PDF document about Artificial Intelligence and Machine Learning
 * for testing the document processing pipeline. The generated PDF includes:
 * - A title
 * - Multiple sections with different content types
 * - Lists and structured content
 * 
 * This provides a realistic document for testing chunking and vectorization.
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Set up path handling for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new PDF document
const doc = new PDFDocument();

// Set up the output stream
const outputPath = path.join(__dirname, '../samples/test.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Add the main title with centered alignment
doc.fontSize(20).text('Introduction to Artificial Intelligence and Machine Learning', { 
  align: 'center' 
});
doc.moveDown();

// Add the main content with proper formatting and structure
doc.fontSize(12).text(`
Artificial Intelligence (AI) represents one of the most transformative technologies of our time. At its core, AI refers to the simulation of human intelligence in machines programmed to think and learn like humans. The field encompasses everything from basic rule-based systems to complex neural networks that can process and analyze vast amounts of data.

Machine Learning, a subset of AI, focuses on the development of computer programs that can access data and use it to learn for themselves. The learning process begins with observations or data, such as examples, direct experience, or instruction, to look for patterns in data and make better decisions in the future based on the examples we provide.

Deep Learning, a more specialized subset of machine learning, uses layered neural networks to simulate human decision-making. These neural networks can automatically learn representations from data such as images, video, or text, without introducing hand-coded rules or human domain knowledge.

Key Applications of AI:
1. Natural Language Processing (NLP)
   - Machine Translation
   - Sentiment Analysis
   - Text Generation

2. Computer Vision
   - Image Recognition
   - Object Detection
   - Facial Recognition

3. Robotics
   - Autonomous Navigation
   - Manufacturing Automation
   - Human-Robot Interaction

The future of AI holds immense potential, from solving complex scientific problems to enhancing everyday human experiences. As we continue to develop more sophisticated algorithms and gather more data, the capabilities of AI systems will only grow, leading to new breakthroughs in fields like healthcare, climate science, and space exploration.
`);

// Finalize the PDF document
doc.end();
