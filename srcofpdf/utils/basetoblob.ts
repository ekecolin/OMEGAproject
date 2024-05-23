export default function base64ToBlob(base64: string, mimeType: string) {
  if (typeof base64 !== 'string') {
    console.error("Invalid input: base64 data is undefined or not a string.");
    return null; 
  }

  const binaryString = Buffer.from(base64, 'base64').toString('binary');

  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeType });
}
