const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { start } = require('../server.js'); // Import the start function

const prisma = new PrismaClient();
const SEED_NAME = 'initial-product-seed';

async function main() {
  try {
    console.log('Checking if database needs seeding...');
    
    // Check if this specific seed has been run before
    const seedMarker = await prisma.seedingHistory.findUnique({
      where: { seedName: SEED_NAME },
    });

    if (!seedMarker) {
      console.log('Database is not seeded. Running seed script...');
      
      // Execute the seed command as a child process
      const seedProcess = exec('npm run prisma:seed');

      // Log the output of the seed script
      seedProcess.stdout.on('data', (data) => {
        console.log(`[SEED] ${data}`);
      });
      seedProcess.stderr.on('data', (data) => {
        console.error(`[SEED ERROR] ${data}`);
      });

      // Wait for the seed process to finish
      await new Promise((resolve, reject) => {
        seedProcess.on('close', (code) => {
          if (code === 0) {
            console.log('Seed script finished successfully.');
            resolve();
          } else {
            reject(new Error(`Seed script exited with code ${code}`));
          }
        });
      });

      // Mark this seed as complete in the database
      await prisma.seedingHistory.create({
        data: { seedName: SEED_NAME },
      });
      console.log('Seeding marker created.');

    } else {
      console.log('Database is already seeded. Skipping...');
    }
  } catch (error) {
    console.error('An error occurred during the initialization check:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }

  // After checking/seeding, start the actual server
  console.log('Starting the application server...');
  start();
}

main();