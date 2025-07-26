import { env } from '$env/dynamic/private';
import { Buffer } from "node:buffer";

globalThis.Buffer = Buffer;

function base64ToBytes(base64) {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	return bytes;
}

async function getKeyFromEnv() {
	const base64 = env.KEY;
	const keyBytes = base64ToBytes(base64);
	return await crypto.subtle.importKey(
		'raw',
		keyBytes,
		{ name: 'AES-GCM' },
		false,
		['encrypt', 'decrypt']
	);
}

export async function encrypt(text) {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const key = await getKeyFromEnv();
	const encoded = new TextEncoder().encode(text);

	const cipherBuffer = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv },
		key,
		encoded
	);

	const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
	combined.set(iv);
	combined.set(new Uint8Array(cipherBuffer), iv.length);

	return Buffer.from(combined).toString('base64'); // use Buffer instead of btoa
}

export async function decrypt(encrypted) {
	const combined = new Uint8Array(Buffer.from(encrypted, 'base64')); // use Buffer instead of atob
	const iv = combined.slice(0, 12);
	const data = combined.slice(12);
	const key = await getKeyFromEnv();

	const plainBuffer = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv },
		key,
		data
	);

	return new TextDecoder().decode(plainBuffer);
}
