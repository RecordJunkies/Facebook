document.addEventListener('DOMContentLoaded', async () => {
    const loadingEl = document.getElementById('loading');
    const snapshotEl = document.getElementById('snapshot');
    const featuredEl = document.getElementById('featured');
    const newsEl = document.getElementById('news');
    const lastUpdateEl = document.getElementById('last-update');

    try {
        loadingEl.style.display = 'block';
        snapshotEl.style.display = 'none';

        // Fetch RSS for news/updates (Record Junkies has a feed at /blog.rss or similar; adjust if needed)
        const rssUrl = 'https://www.recordjunkies.co.uk/blogs/news.atom'; // Assuming Atom/RSS endpoint; confirm via browser
        const response = await fetch(rssUrl);
        const text = await response.text();
        
        // Simple XML parser (for demo; use a lib like xml2js in production)
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        const items = xml.querySelectorAll('entry'); // For Atom; use 'item' for RSS

        newsEl.innerHTML = '';
        let featuredCount = 0;
        items.forEach((item, index) => {
            if (index >= 5) return; // Limit to top 5
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').getAttribute('href');
            const summary = item.querySelector('summary')?.textContent || 'New update from Record Junkies!';
            const img = item.querySelector('media\\:thumbnail')?.getAttribute('url') || ''; // Fallback to generic

            const div = document.createElement('div');
            div.className = 'item';
            div.innerHTML = `
                <img src="${img || 'https://via.placeholder.com/50?text=🎵'}" alt="">
                <div>
                    <h3>${title}</h3>
                    <p>${summary.substring(0, 100)}...</p>
                    <a href="${link}" target="_blank">Read more</a>
                </div>
            `;
            newsEl.appendChild(div);

            if (featuredCount < 3) {
                // Simulate featured (pull from news or hardcode top items)
                featuredEl.innerHTML += `<div class="item"><h3>Featured: ${title}</h3><p>${summary}</p></div>`;
                featuredCount++;
            }
        });

        // If no RSS, fallback to static snapshot (e.g., hardcoded top items from site scrape)
        if (items.length === 0) {
            newsEl.innerHTML = '<div class="item"><p>Check the site for latest drops—new indie vinyl in stock!</p></div>';
        }

        // Update timestamp
        lastUpdateEl.textContent = new Date().toLocaleString();

        loadingEl.style.display = 'none';
        snapshotEl.style.display = 'block';
    } catch (error) {
        console.error('Fetch error:', error);
        loadingEl.innerHTML = 'Offline? Showing cached snapshot. <br><small>Connect for updates.</small>';
        // Load from cache via service worker
        snapshotEl.style.display = 'block'; // Assume cached content
    }
});
