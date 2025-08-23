import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { statSync, existsSync } from 'fs';
import * as express from 'express';

async function bootstrap() {
  // Create NestJS app
  const app = await NestFactory.create(AppModule);
  
  // Set global prefix for API routes
  app.setGlobalPrefix('api');
  
  // Enable CORS
  app.enableCors();
  
  // Serve static files from the React app build directory
  const clientPath = join(__dirname, '..', '..', '..', 'dist');
  console.log('Looking for frontend files in:', clientPath);
 console.log('Frontend directory exists:', existsSync(clientPath));
  if (existsSync(clientPath) && statSync(clientPath).isDirectory()) {
    console.log('Frontend directory is accessible, setting up static file serving');
    app.use(express.static(clientPath));
    
    // Handle React routing, return all requests to React app
    app.use('*', (req, res) => {
      const filePath = join(clientPath, req.path);
      
      // If the file exists, serve it
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        res.sendFile(filePath);
      } else {
        // Otherwise, serve index.html for client-side routing
        res.sendFile(join(clientPath, 'index.html'));
      }
    });
  } else {
    console.log('Frontend directory not found or not accessible, skipping static file serving');
  }
  
  // Start server
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();