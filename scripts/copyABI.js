const fs = require('fs');
const path = require('path');

function copyABI() {
    const sourceABIPath = path.join(__dirname, '../artifacts/contracts/Identity.sol/Identity.json');
    const destinationDir = path.join(__dirname, '../frontend/src/abis');
    const destinationABIPath = path.join(destinationDir, 'IdentityABI.json');

    // Check if the source ABI file exists
    if (!fs.existsSync(sourceABIPath)) {
        console.error('Source ABI file not found:', sourceABIPath);
        return;
    }

    // Check if the destination directory exists, and create it if not
    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
        console.log('Created destination directory:', destinationDir);
    }

    // Copy the ABI file
    fs.copyFileSync(sourceABIPath, destinationABIPath);
    console.log('ABI file copied to:', destinationABIPath);
}

copyABI();
