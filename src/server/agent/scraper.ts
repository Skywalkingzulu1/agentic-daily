export async function scrapeThemes(subreddits: string[] = ['all', 'popular']) {
  const themes: string[] = [];
  for (const sr of subreddits) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sr}/hot.json?limit=25`);
      const data = await res.json();
      const posts = data.data?.children ?? [];
      for (const p of posts) {
        const title = p.data?.title;
        if (title && title.length > 10 && title.length < 120) {
          themes.push(title);
        }
      }
    } catch {
      // fallback to static themes if Reddit is rate-limited
      themes.push('space exploration', 'pets', 'retro gaming', 'baking bread', 'urban gardening');
    }
  }
  return themes.slice(0, 15);
}
