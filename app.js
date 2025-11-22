document.addEventListener('DOMContentLoaded', async () => {
    const loading = document.getElementById('loading');
    const snapshot = document.getElementById('snapshot');
    const featured = document.getElementById('featured');
    const news = document.getElementById('news');
    const lastUpdate = document.getElementById('last-update');

    try {
        const blogUrl = 'https://www.recordjunkies.co.uk/blogs/news';
        const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(blogUrl)}`;
        const res = await fetch(proxy);
        const html = await res.text();

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const posts = doc.querySelectorAll('.blog__item');

        news.innerHTML = '';
        featured.innerHTML = '';

        let count = 0;
        for (const post of posts) {
            if (count >= 5) break;

            const titleEl = post.querySelector('.blog__title, h3, h2');
            const linkEl = post.querySelector('a');
            const descEl = post.querySelector('.blog__excerpt, p');
            const imgEl = post.querySelector('img');

            const title = titleEl?.innerText.trim() || 'New update';
            const link = linkEl?.href?.startsWith('http') ? linkEl.href : 'https://www.recordjunkies.co.uk' + linkEl?.href;
            const desc = descEl?.innerText.trim().substring(0, 120) || 'Fresh stock just landed!';
            const img = imgEl?.src || 'https://via.placeholder.com/60?text=VINYL';

            const item = `
                <div class="item">
                    <img src="${img}" alt="">
                    <div>
                        <h3>${title}</h3>
                        <p>${desc}...</p>
                        <a href="${link}" target="_blank">Read more →</a>
                    </div>
                </div>`;
            
            news.innerHTML += item;
            if (count < 3) featured.innerHTML += `<div class="item"><h3>Featured: ${title}</h3><p>${desc}...</p></div>`;
            count++;
        }

        if (count === 0) {
            news.innerHTML = '<div class="item"><p>New arrivals dropping all the time – tap Browse All!</p></div>';
        }

        lastUpdate.textContent = new Date().toLocaleString();
        loading.style.display = 'none';
        snapshot.style.display = 'block';

    } catch (e) {
        loading.innerHTML = 'Offline – showing last visit<br><small>Connect for fresh updates</small>';
        snapshot.style.display = 'block';
    }
});
