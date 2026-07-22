export async function scrapeThemes(subreddits: string[] = ['all']): Promise<string[]> {
  const themes: string[] = [];
  for (let i = 0; i < subreddits.length; i++) {
    const sr = subreddits[i];
    try {
      const res = await fetch(`https://www.reddit.com/r/${sr}/hot.json?limit=15`, {
        headers: {
          'User-Agent': 'CascadeDevvitGame/1.0 (by /u/AgenticDaily)',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const posts = data.data?.children ?? [];
      for (const p of posts) {
        const title = p.data?.title;
        if (typeof title === 'string' && title.length >= 10 && title.length <= 100) {
          themes.push(title);
        }
      }
    } catch {
      themes.push(
        'space exploration',
        'retro gaming',
        'baking bread',
        'street art',
        ' DIY robotics',
        'mountain hiking',
        'jazz music',
        'ancient history'
      );
    }
    if (i < subreddits.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  return themes.slice(0, 15);
}
