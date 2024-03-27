import hash from "hash.js";

function _sha256(buf: Buffer) {
	return Buffer.from(hash.sha256().update(buf).digest("hex"), "hex");
}

export function createBrfcid(params: { title: string; author: string; version: string }) {
	const content = `${params.title.trim()}${params.author.trim()}${params.version.trim()}`;
	const res = _sha256(_sha256(Buffer.from(content)))
		.reverse()
		.toString("hex")
		.substring(0, 12);
	return res;
}
