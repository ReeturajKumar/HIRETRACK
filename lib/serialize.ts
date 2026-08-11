/**
 * Converts any MongoDB document (which may contain ObjectId, Date, Buffer, etc.)
 * into a plain JSON-serializable object safe to pass as Next.js Server → Client props.
 *
 * Uses JSON.parse(JSON.stringify()) which:
 *  - Calls ObjectId.toJSON() → 24-char hex string
 *  - Calls Date.toJSON()     → ISO string
 *  - Strips undefined fields
 */
export function serialize<T = Record<string, unknown>>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}

/** Serialize an array of MongoDB documents */
export function serializeArray<T = Record<string, unknown>>(docs: unknown[]): T[] {
  return JSON.parse(JSON.stringify(docs)) as T[];
}
