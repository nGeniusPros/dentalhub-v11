const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '../dist/mcp/config');

try {
  console.log('Building database module...');
  // Run TypeScript compiler
  execSync('tsc -p tsconfig.db.json', { stdio: 'inherit' });

  console.log('Renaming output files to .cjs...');
  // Rename .js files to .cjs in the output directory
  fs.readdirSync(configDir).forEach(file => {
    if (path.extname(file) === '.js') {
      const oldPath = path.join(configDir, file);
      const newPath = path.join(configDir, path.basename(file, '.js') + '.cjs');
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed ${oldPath} to ${newPath}`);
    }
  });

  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
