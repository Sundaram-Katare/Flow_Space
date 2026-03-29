import crypto from 'crypto';

function generateCodeFromName(name) {
  const hash = crypto.createHash('sha256').update(name).digest('hex');
  const numeric = BigInt('0x' + hash).toString().slice(0, 10);
//   console.log(typeof(numeric));
  return numeric;
}

// console.log(generateCodeFromName("My Workspace")); // Example usage

export default generateCodeFromName;