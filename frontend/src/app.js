// DOM Elements
const adContent = document.getElementById('adContent');
const imageUpload = document.getElementById('imageUpload');
const generateAdBtn = document.getElementById('generateAd');
const adPreview = document.getElementById('adPreview');
const generateSuggestionBtn = document.getElementById('generateSuggestion');
const suggestionResult = document.getElementById('suggestionResult');
const postToLinkedInBtn = document.getElementById('postToLinkedIn');

// Company Profile Elements
const companyNameInput = document.getElementById('companyName');
const industryInput = document.getElementById('industry');
const websiteInput = document.getElementById('website');
const specialtiesInput = document.getElementById('specialties');
const saveProfileBtn = document.getElementById('saveProfile');
const exportProfileBtn = document.getElementById('exportProfile');
const importProfileBtn = document.getElementById('importProfile');
const importFileInput = document.getElementById('importFile');

// Analytics elements
const impressionsEl = document.getElementById('impressions');
const clicksEl = document.getElementById('clicks');
const engagementEl = document.getElementById('engagement');
const ctrEl = document.getElementById('ctr');
const activityLog = document.getElementById('activityLog');

// Mock data for analytics, posts, and company profile
let analyticsData = {
    impressions: 0,
    clicks: 0,
    engagement: 0,
    ctr: 0,
    activities: [],
    posts: [],
    companyProfile: {
        companyName: '',
        industry: '',
        website: '',
        specialties: []
    }
};

// Load saved data from localStorage
function loadData() {
    const savedData = localStorage.getItem('linkedinAdsData');
    if (savedData) {
        const data = JSON.parse(savedData);
        analyticsData = { ...analyticsData, ...data };
        updateAnalyticsUI();
        renderPosts('all');
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('linkedinAdsData', JSON.stringify(analyticsData));
}

// Update analytics UI
function updateAnalyticsUI() {
    impressionsEl.textContent = analyticsData.impressions.toLocaleString();
    clicksEl.textContent = analyticsData.clicks.toLocaleString();
    engagementEl.textContent = `${analyticsData.engagement}%`;
    ctrEl.textContent = `${analyticsData.ctr}%`;
    
    // Update activity log
    if (analyticsData.activities.length > 0) {
        activityLog.innerHTML = analyticsData.activities
            .map(activity => `<p class="text-sm py-1 border-b border-gray-100">${activity}</p>`)
            .join('');
    }
}

// Generate random analytics data
function generateAnalytics() {
    analyticsData.impressions += Math.floor(Math.random() * 1000);
    analyticsData.clicks += Math.floor(Math.random() * 50);
    analyticsData.engagement = (Math.random() * 5 + 1).toFixed(1);
    analyticsData.ctr = ((analyticsData.clicks / analyticsData.impressions) * 100).toFixed(2);
    
    // Add activity
    const activities = [
        `New ad generated at ${new Date().toLocaleTimeString()}`,
        `Ad performance updated`,
        `Engagement rate increased`,
        `New click recorded`,
        `Impression count updated`
    ];
    
    analyticsData.activities.unshift(activities[Math.floor(Math.random() * activities.length)]);
    if (analyticsData.activities.length > 5) analyticsData.activities.pop();
    
    saveData();
    updateAnalyticsUI();
}

// AI Suggestion Templates
const suggestions = [
    "Try creating a post about recent industry trends with an engaging question to boost engagement.",
    "Share a success story or case study from one of your recent projects.",
    "Post an infographic with key statistics about your industry.",
    "Ask your network for their thoughts on a relevant topic in your field.",
    "Share a behind-the-scenes look at your work process.",
    "Create a poll to engage your audience and gather insights.",
    "Share a valuable resource or tool that has helped you recently.",
    "Post a video tutorial or demonstration related to your expertise.",
    "Share a personal achievement or milestone and thank those who helped you.",
    "Create a post highlighting a common challenge and how to overcome it."
];

// Event Listeners
imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            adPreview.innerHTML = `
                <p>${adContent.value || 'Your ad preview'}</p>
                <img src="${event.target.result}" alt="Ad preview" class="mt-2 rounded">
            `;
        };
        reader.readAsDataURL(file);
    }
});

adContent.addEventListener('input', function() {
    if (adContent.value) {
        adPreview.innerHTML = `<p>${adContent.value}</p>`;
    } else {
        adPreview.innerHTML = '<p class="text-gray-500">Your ad preview will appear here</p>';
    }
});

generateAdBtn.addEventListener('click', function() {
    if (!adContent.value.trim()) {
        alert('Please enter some content for your ad');
        return;
    }
    
    // Simulate AI processing
    this.disabled = true;
    this.innerHTML = '<span class="spinner"></span> Generating...';
    
    setTimeout(() => {
        // Update preview with AI-enhanced content
        const enhancedContent = adContent.value + "\n\n#LinkedInAds #Marketing #Engagement";
        adPreview.innerHTML = `<p>${enhancedContent}</p>`;
        
        // Update analytics
        generateAnalytics();
        
        this.disabled = false;
        this.textContent = 'Generate Ad with AI';
        
        alert('Ad generated successfully!');
    }, 1500);
});

generateSuggestionBtn.addEventListener('click', function() {
    this.disabled = true;
    this.innerHTML = '<span class="spinner"></span> Thinking...';
    
    // Simulate AI thinking
    setTimeout(() => {
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        suggestionResult.innerHTML = `
            <div class="suggestion-item">
                <p class="font-medium mb-2">AI Suggestion:</p>
                <p class="bg-blue-50 p-3 rounded">${randomSuggestion}</p>
                <button id="useSuggestion" class="mt-3 text-sm text-blue-600 hover:text-blue-800">
                    Use this suggestion
                </button>
            </div>
        `;
        
        // Add event listener to the new button
        document.getElementById('useSuggestion')?.addEventListener('click', function() {
            adContent.value = randomSuggestion;
            adPreview.innerHTML = `<p>${randomSuggestion}</p>`;
            suggestionResult.innerHTML = '<p class="text-green-600">Suggestion applied to your ad!</p>';
        });
        
        this.disabled = false;
        this.textContent = 'Generate Suggestion';
    }, 1000);
});

// Save a new post
function savePost(status = 'published') {
    const newPost = {
        id: Date.now(),
        content: adContent.value,
        image: adPreview.querySelector('img')?.src || '',
        status: status,
        date: new Date().toISOString(),
        stats: {
            impressions: 0,
            clicks: 0,
            engagement: 0
        }
    };
    
    analyticsData.posts.unshift(newPost);
    saveData();
    renderPosts('all');
    
    // Clear the form
    adContent.value = '';
    imageUpload.value = '';
    adPreview.innerHTML = '<p class="text-gray-500">Your ad preview will appear here</p>';
    
    return newPost;
}

// Render posts based on status filter
function renderPosts(filter) {
    const postsList = document.getElementById('postsList');
    const noPostsMessage = document.getElementById('noPostsMessage');
    
    if (!analyticsData.posts || analyticsData.posts.length === 0) {
        noPostsMessage.style.display = 'block';
        postsList.innerHTML = '';
        return;
    }
    
    const filteredPosts = filter === 'all' 
        ? analyticsData.posts 
        : analyticsData.posts.filter(post => post.status === filter);
    
    if (filteredPosts.length === 0) {
        noPostsMessage.style.display = 'block';
        postsList.innerHTML = '';
        return;
    }
    
    noPostsMessage.style.display = 'none';
    
    postsList.innerHTML = filteredPosts.map(post => `
        <div class="border rounded-lg p-4 hover:shadow-md transition-shadow" data-id="${post.id}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="px-2 py-1 text-xs rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                            ${post.status === 'published' ? 'Published' : 'Scheduled'}
                        </span>
                        <span class="text-sm text-gray-500">${new Date(post.date).toLocaleString()}</span>
                    </div>
                    <p class="text-gray-800 mb-2">${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
                    ${post.image ? `<img src="${post.image}" alt="Post image" class="h-20 w-auto object-cover rounded mt-2">` : ''}
                </div>
                <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800 text-sm" onclick="editPost('${post.id}')">
                        Edit
                    </button>
                    <button class="text-red-600 hover:text-red-800 text-sm" onclick="deletePost('${post.id}')">
                        Delete
                    </button>
                </div>
            </div>
            ${post.status === 'published' ? `
            <div class="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
                <span>👁️ ${post.stats.impressions} impressions</span>
                <span>👆 ${post.stats.clicks} clicks</span>
                <span>💬 ${post.stats.engagement}% engagement</span>
            </div>` : ''}
        </div>
    `).join('');
}

// Edit post
function editPost(postId) {
    const post = analyticsData.posts.find(p => p.id.toString() === postId);
    if (post) {
        adContent.value = post.content;
        adPreview.innerHTML = post.image 
            ? `<p>${post.content}</p><img src="${post.image}" alt="Ad preview" class="mt-2 rounded">`
            : `<p>${post.content}</p>`;
        
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Delete post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        analyticsData.posts = analyticsData.posts.filter(p => p.id.toString() !== postId);
        saveData();
        renderPosts(document.querySelector('.tab-active').dataset.filter || 'all');
    }
}

// Post to LinkedIn
postToLinkedInBtn.addEventListener('click', function() {
    if (!adContent.value.trim()) {
        alert('Please create an ad first');
        return;
    }
    
    this.disabled = true;
    this.innerHTML = '<span class="spinner"></span> Posting...';
    
    setTimeout(() => {
        // Save the post
        const newPost = savePost('published');
        
        // Update analytics
        analyticsData.activities.unshift(`Posted to LinkedIn at ${new Date().toLocaleString()}`);
        if (analyticsData.activities.length > 5) analyticsData.activities.pop();
        
        // Generate some random stats for the new post
        const postIndex = analyticsData.posts.findIndex(p => p.id === newPost.id);
        if (postIndex !== -1) {
            analyticsData.posts[postIndex].stats = {
                impressions: Math.floor(Math.random() * 1000),
                clicks: Math.floor(Math.random() * 50),
                engagement: (Math.random() * 5 + 1).toFixed(1)
            };
        }
        
        saveData();
        updateAnalyticsUI();
        
        this.disabled = false;
        this.textContent = 'Post to LinkedIn';
        alert('Successfully posted to LinkedIn!');
    }, 2000);
});

// Schedule post
function schedulePost() {
    if (!adContent.value.trim()) {
        alert('Please create an ad first');
        return;
    }
    
    savePost('scheduled');
    alert('Post scheduled successfully!');
}

// Tab switching
function setupTabs() {
    const tabs = document.querySelectorAll('[id$="Tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab styling
            tabs.forEach(t => t.classList.remove('text-blue-600', 'border-blue-600'));
            tabs.forEach(t => t.classList.add('text-gray-500', 'hover:text-blue-600'));
            this.classList.remove('text-gray-500', 'hover:text-blue-600');
            this.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
            
            // Show appropriate posts
            const filter = this.id.replace('Tab', '').toLowerCase();
            renderPosts(filter);
        });
    });
}

// Add Schedule button next to Post to LinkedIn
const scheduleBtn = document.createElement('button');
scheduleBtn.textContent = 'Schedule Post';
scheduleBtn.className = 'w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 mt-2';
scheduleBtn.onclick = schedulePost;
document.querySelector('#postToLinkedIn').parentNode.appendChild(scheduleBtn);

// Save company profile
function saveCompanyProfile() {
    analyticsData.companyProfile = {
        companyName: companyNameInput.value,
        industry: industryInput.value,
        website: websiteInput.value,
        specialties: specialtiesInput.value.split(',').map(s => s.trim()).filter(Boolean)
    };
    saveData();
    
    // Show success message
    const originalText = saveProfileBtn.textContent;
    saveProfileBtn.textContent = 'Saved!';
    saveProfileBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    saveProfileBtn.classList.add('bg-green-600', 'hover:bg-green-700');
    
    setTimeout(() => {
        saveProfileBtn.textContent = originalText;
        saveProfileBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        saveProfileBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
    }, 2000);
}

// Load company profile into form
function loadCompanyProfile() {
    if (analyticsData.companyProfile) {
        const profile = analyticsData.companyProfile;
        companyNameInput.value = profile.companyName || '';
        industryInput.value = profile.industry || '';
        websiteInput.value = profile.website || '';
        specialtiesInput.value = Array.isArray(profile.specialties) 
            ? profile.specialties.join(', ') 
            : '';
    }
}

// Export company profile to JSON file
function exportCompanyProfile() {
    const profile = analyticsData.companyProfile;
    if (!profile.companyName) {
        alert('Please save your company profile first');
        return;
    }
    
    const dataStr = JSON.stringify(profile, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${profile.companyName.replace(/\s+/g, '-').toLowerCase()}-profile.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Import company profile from JSON file
function importCompanyProfile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const profile = JSON.parse(e.target.result);
            
            // Validate the imported profile
            if (profile && typeof profile === 'object') {
                analyticsData.companyProfile = {
                    companyName: profile.companyName || '',
                    industry: profile.industry || '',
                    website: profile.website || '',
                    specialties: Array.isArray(profile.specialties) 
                        ? profile.specialties 
                        : (profile.specialties || '').split(',').map(s => s.trim()).filter(Boolean)
                };
                
                saveData();
                loadCompanyProfile();
                
                // Show success message
                alert('Profile imported successfully!');
            } else {
                throw new Error('Invalid profile format');
            }
        } catch (error) {
            console.error('Error importing profile:', error);
            alert('Error importing profile. Please make sure the file is a valid JSON profile.');
        }
    };
    
    reader.onerror = function() {
        alert('Error reading file');
    };
    
    reader.readAsText(file);
}

// Initialize the app
function init() {
    loadData();
    setupTabs();
    loadCompanyProfile();
    
    // Event listeners for company profile
    saveProfileBtn.addEventListener('click', saveCompanyProfile);
    exportProfileBtn.addEventListener('click', exportCompanyProfile);
    importProfileBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importCompanyProfile(e.target.files[0]);
            // Reset the file input
            e.target.value = '';
        }
    });
    
    // Generate initial analytics data if none exists
    if (analyticsData.impressions === 0) {
        generateAnalytics();
    }
    
    // Add some sample posts if none exist
    if (analyticsData.posts.length === 0) {
        const samplePosts = [
            {
                id: Date.now() - 1000,
                content: 'Check out our latest product launch! We\'re excited to share this new innovation with you. #ProductLaunch #Innovation',
                image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
                status: 'published',
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                stats: {
                    impressions: 1245,
                    clicks: 89,
                    engagement: 4.2
                }
            },
            {
                id: Date.now() - 2000,
                content: 'We\'re hiring! Join our amazing team and help us build the future. #Hiring #Careers',
                status: 'published',
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                stats: {
                    impressions: 987,
                    clicks: 45,
                    engagement: 3.8
                }
            }
        ];
        
        analyticsData.posts = [...samplePosts, ...analyticsData.posts];
        saveData();
        renderPosts('all');
    }
}

// Start the app
init();
