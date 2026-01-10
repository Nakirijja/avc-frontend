// Temporary fix for build 
const fs = require('fs'); 
let content = fs.readFileSync('src/views/shop/Checkout.vue', 'utf8'); 
content = content.replace(/\/api\/placeholder/g, 'https://via.placeholder.com'); 
fs.writeFileSync('src/views/shop/Checkout.vue', content); 
console.log('Fixed Checkout.vue'); 
