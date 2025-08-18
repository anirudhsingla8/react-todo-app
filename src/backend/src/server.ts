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
  const clientPath = join(__dirname, '..', '..', 'dist');
  if (existsSync(clientPath) && statSync(clientPath).isDirectory()) {
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
  }
  
  // Start server
  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();