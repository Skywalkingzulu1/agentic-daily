import devvit from 'devvit';

export type KV = ReturnType<typeof devvit.kv>;

export async function get(kv: KV, key: string) {
  return kv.get(key);
}

export async function set(kv: KV, key: string, value: any) {
  return kv.set(key, value);
}

export async function list(kv: KV, prefix: string) {
  const items = await kv.list(prefix);
  return items;
}
