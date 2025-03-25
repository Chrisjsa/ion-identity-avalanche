const fs = require('fs');
const path = require('path');

function copyABI() {
    const sourceABIPath = path.join(__dirname, '../artifacts/contracts/Identity.sol/Identity.json');
    const apiDir = path.join(__dirname, '../api/');
    const frontDir = path.join(__dirname, '../frontend/src/abis');
    const destinationApiABIPath = path.join(apiDir, 'IdentityABI.json');
    const destinationFrontABIPath = path.join(frontDir, 'IdentityABI.json');

    // Check if the source ABI file exists
    if (!fs.existsSync(sourceABIPath)) {
        console.error('Source ABI file not found:', sourceABIPath);
        return;
    }

    // Check if the api destination directory exists, and create it if not
    if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
        console.log('Created api destination directory:', apiDir);
    }

    // Check if the front destination directory exists, and create it if not
    if (!fs.existsSync(frontDir)) {
        fs.mkdirSync(frontDir, { recursive: true });
        console.log('Created frontend destination directory:', frontDir);
    }

    // Copy the ABI file to api
    fs.copyFileSync(sourceABIPath, destinationApiABIPath);
    console.log('ABI file copied to:', destinationApiABIPath);

    // Copy the ABI file to frontend
    fs.copyFileSync(sourceABIPath, destinationFrontABIPath);
    console.log('ABI file copied to:', destinationFrontABIPath);
}

copyABI();
