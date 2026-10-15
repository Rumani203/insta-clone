let storyInterval = null;

// 1. Story Viewer: Uski profile image aur username modal me display karega
function openStory(username, imageUrl) {
    const modal = document.getElementById('story-modal');
    const avatar = document.getElementById('story-modal-avatar');
    const name = document.getElementById('story-modal-name');
    const storyImg = document.getElementById('story-modal-image');
    const progressBar = document.getElementById('story-progress');

    // Set user info & images
    avatar.src = imageUrl;
    name.textContent = username;
    storyImg.src = imageUrl;

    modal.classList.remove('hide');

    // 5 seconds progress bar timer
    let progress = 0;
    progressBar.style.width = '0%';

    clearInterval(storyInterval);
    storyInterval = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            closeStory();
        }
    }, 100);
}

function closeStory() {
    const modal = document.getElementById('story-modal');
    modal.classList.add('hide');
    clearInterval(storyInterval);
}

// 2. Real-time Profiles Search Logic
function searchProfiles() {
    const query = document.getElementById('feed-search').value.toLowerCase().trim();
    const resultsBox = document.getElementById('search-results-box');
    const cards = document.querySelectorAll('.post-card');

    if (!query) {
        resultsBox.innerHTML = '';
        resultsBox.classList.add('hide');
        // Reset feed cards visibility
        cards.forEach(card => card.style.display = 'block');
        return;
    }

    // Feed se available profiles aur posts ko collect karein
    let matchedProfiles = [];
    let seenUsernames = new Set();

    cards.forEach(card => {
        const username = card.getAttribute('data-username');
        const caption = card.getAttribute('data-caption');
        const avatar = card.querySelector('.post-avatar').src;

        if (username.includes(query) || caption.includes(query)) {
            card.style.display = 'block';

            if (!seenUsernames.has(username)) {
                seenUsernames.add(username);
                matchedProfiles.push({ username, avatar });
            }
        } else {
            card.style.display = 'none';
        }
    });

    // Suggestion box render karein
    if (matchedProfiles.length > 0) {
        resultsBox.classList.remove('hide');
        resultsBox.innerHTML = matchedProfiles.map(p => `
            <div class="search-result-profile" onclick="openStory('${p.username}', '${p.avatar}')">
                <div class="search-profile-info">
                    <img src="${p.avatar}" class="search-profile-img" alt="${p.username}">
                    <div>
                        <div class="search-profile-name">@${p.username}</div>
                        <div class="search-profile-tag">Tap to view story</div>
                    </div>
                </div>
                <button class="search-view-btn">View</button>
            </div>
        `).join('');
    } else {
        resultsBox.classList.remove('hide');
        resultsBox.innerHTML = `<div style="padding: 12px; text-align: center; color: #8e8e8e; font-size: 0.85rem;">No profiles found for "${query}"</div>`;
    }
}

function clearSearch() {
    const input = document.getElementById('feed-search');
    input.value = '';
    searchProfiles();
}

function toggleSearch() {
    const searchSection = document.getElementById('search-section');
    searchSection.classList.toggle('hide');
    if (!searchSection.classList.contains('hide')) {
        document.getElementById('feed-search').focus();
    } else {
        clearSearch();
    }
}

// 3. Dynamic Like Button & Counter
function toggleLike(btn) {
    btn.classList.toggle('liked');
    const icon = btn.querySelector('i');
    const postCard = btn.closest('.post-card');
    const countEl = postCard.querySelector('.likes-count');
    let currentCount = parseInt(countEl.getAttribute('data-count')) || 0;

    if (btn.classList.contains('liked')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        currentCount += 1;
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        currentCount = Math.max(0, currentCount - 1);
    }

    countEl.setAttribute('data-count', currentCount);
    countEl.textContent = `${currentCount} likes`;
}

// 4. Double Tap Photo to Like
function handleDoubleTap(container) {
    const heart = container.querySelector('.double-tap-heart');
    const postCard = container.closest('.post-card');
    const likeBtn = postCard.querySelector('.like-btn');

    heart.classList.add('pop');
    setTimeout(() => {
        heart.classList.remove('pop');
    }, 800);

    if (!likeBtn.classList.contains('liked')) {
        toggleLike(likeBtn);
    }
}

// 5. Bookmark/Save Post
function toggleSave(btn) {
    btn.classList.toggle('saved');
    const icon = btn.querySelector('i');

    if (btn.classList.contains('saved')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
    }
}

// 6. 3-Dots Options Menu
function toggleMenu(postId) {
    const menu = document.getElementById(`menu-${postId}`);
    document.querySelectorAll('.options-dropdown').forEach(m => {
        if (m !== menu) m.classList.remove('show');
    });
    menu.classList.toggle('show');
}

// 7. Comments Drawer
function openComments(username) {
    document.getElementById('comments-sheet').classList.remove('hide');
}

function closeComments() {
    document.getElementById('comments-sheet').classList.add('hide');
}

function postComment() {
    const input = document.getElementById('new-comment-input');
    const text = input.value.trim();
    if (!text) return;

    const list = document.getElementById('comments-list');
    const newDiv = document.createElement('div');
    newDiv.className = 'comment-item';
    newDiv.innerHTML = `<strong>you:</strong> ${text}`;
    list.appendChild(newDiv);
    input.value = '';
    list.scrollTop = list.scrollHeight;
}

// 8. Share Post
function sharePost(username) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        alert(`Link to @${username}'s post copied!`);
    } else {
        alert(`Sharing @${username}'s post!`);
    }
}

// 9. Reels & Profile Alert
function toggleReels() {
    alert('Reels feature: Coming in next update!');
}

function showProfile() {
    alert('Logged in as administrator profile.');
}

// Close Dropdowns on Click Outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.post-header')) {
        document.querySelectorAll('.options-dropdown').forEach(m => {
            m.classList.remove('show');
        });
    }
});