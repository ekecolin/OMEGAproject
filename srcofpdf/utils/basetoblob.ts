// Passing audio as base64 - can also send the translated text in api

// https://saturncloud.io/blog/creating-a-blob-from-a-base64-string-in-javascript/ - Convert a Base64-encoded string to a Blob object. Useful for handling binary data (files) in web apps
export default function base64ToBlob(base64: string, mimeType: string) {
  if (typeof base64 !== 'string') {
    console.error("Invalid input: base64 data is undefined or not a string.");
    return null; // Or throw new Error("Invalid input: base64 data is undefined or not a string.");
  }

  // Decode the base64 string into a binary string.
  const binaryString = Buffer.from(base64, 'base64').toString('binary');

  // Create an ArrayBuffer with the same length as the binary string.
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  // Create a Uint8Array as a view for the ArrayBuffer. Uint8Array represents an array of 8-bit unsigned integers.
  const uint8Array = new Uint8Array(arrayBuffer);

  // Iterate over each character in the binary string and assign its char code to the corresponding index in Uint8Array.
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeType });
}
