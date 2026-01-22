const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, '..', 'src', 'integrations', 'supabase', 'client.ts');
console.log('Checking path:', p);
console.log('Exists:', fs.existsSync(p));
console.log('Stat:', fs.existsSync(p) ? fs.statSync(p) : 'N/A');
