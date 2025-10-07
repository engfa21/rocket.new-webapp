const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Video management storage (in production, use a proper database)
let videoDatabase = [
    {
        id: 1,
        title: "Advanced JavaScript Concepts",
        youtubeId: "dQw4w9WgXcQ",
        description: "Deep dive into advanced JavaScript concepts including closures, prototypes, and async programming.",
        price: 29.99,
        category: "tutorial",
        status: "published",
        type: "video",
        featured: true,
        views: 1250,
        purchases: 89,
        revenue: 2669.11,
        createdAt: "2025-01-15",
        isCurrent: true
    },
    {
        id: 2,
        title: "React Performance Optimization",
        youtubeId: "jNQXAC9IVRw",
        description: "Learn how to optimize React applications for better performance.",
        price: 39.99,
        category: "tutorial",
        status: "published",
        type: "video",
        featured: false,
        views: 890,
        purchases: 67,
        revenue: 2679.33,
        createdAt: "2025-01-20",
        isCurrent: false
    },
    {
        id: 3,
        title: "Node.js Microservices Live Workshop",
        youtubeId: "y6120QOlsfU",
        description: "Live coding session building microservices with Node.js.",
        price: 49.99,
        category: "tutorial",
        status: "published",
        type: "livestream",
        featured: true,
        views: 2100,
        purchases: 156,
        revenue: 7798.44,
        createdAt: "2025-01-10",
        isCurrent: false
    }
];

let currentVideo = videoDatabase[0]; // Default current video

// API Routes

// Get all videos
app.get('/api/videos', (req, res) => {
    res.json({
        success: true,
        data: videoDatabase,
        currentVideo: currentVideo
    });
});

// Get current video (what users see)
app.get('/api/current-video', (req, res) => {
    res.json({
        success: true,
        data: currentVideo
    });
});

// Set current video (admin only)
app.post('/api/set-current-video', (req, res) => {
    const { videoId, adminKey } = req.body;
    
    // Simple admin authentication (in production, use proper auth)
    if (adminKey !== 'admin123') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    
    const video = videoDatabase.find(v => v.id === videoId);
    if (!video) {
        return res.status(404).json({
            success: false,
            message: 'Video not found'
        });
    }
    
    // Update current video
    videoDatabase.forEach(v => v.isCurrent = false);
    video.isCurrent = true;
    currentVideo = video;
    
    res.json({
        success: true,
        message: 'Current video updated successfully',
        data: currentVideo
    });
});

// Add new video (admin only)
app.post('/api/videos', (req, res) => {
    const { adminKey, ...videoData } = req.body;
    
    // Simple admin authentication
    if (adminKey !== 'admin123') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    
    // Extract YouTube ID from URL if needed
    const youtubeId = extractYouTubeId(videoData.youtubeUrl || videoData.youtubeId);
    if (!youtubeId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid YouTube URL or ID'
        });
    }
    
    const newVideo = {
        id: Math.max(...videoDatabase.map(v => v.id)) + 1,
        title: videoData.title,
        youtubeId: youtubeId,
        description: videoData.description,
        price: parseFloat(videoData.price) || 0,
        category: videoData.category,
        status: videoData.status || 'draft',
        type: videoData.type || 'video',
        featured: videoData.featured || false,
        isCurrent: videoData.isCurrent || false,
        views: 0,
        purchases: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    // If set as current, update current video
    if (newVideo.isCurrent) {
        videoDatabase.forEach(v => v.isCurrent = false);
        currentVideo = newVideo;
    }
    
    videoDatabase.unshift(newVideo);
    
    res.json({
        success: true,
        message: 'Video added successfully',
        data: newVideo
    });
});

// Update video (admin only)
app.put('/api/videos/:id', (req, res) => {
    const { adminKey, ...videoData } = req.body;
    const videoId = parseInt(req.params.id);
    
    // Simple admin authentication
    if (adminKey !== 'admin123') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    
    const videoIndex = videoDatabase.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Video not found'
        });
    }
    
    // Extract YouTube ID from URL if needed
    if (videoData.youtubeUrl) {
        const youtubeId = extractYouTubeId(videoData.youtubeUrl);
        if (!youtubeId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid YouTube URL or ID'
            });
        }
        videoData.youtubeId = youtubeId;
    }
    
    // Update video
    videoDatabase[videoIndex] = { ...videoDatabase[videoIndex], ...videoData };
    
    // If set as current, update current video
    if (videoData.isCurrent) {
        videoDatabase.forEach(v => v.isCurrent = false);
        videoDatabase[videoIndex].isCurrent = true;
        currentVideo = videoDatabase[videoIndex];
    }
    
    res.json({
        success: true,
        message: 'Video updated successfully',
        data: videoDatabase[videoIndex]
    });
});

// Delete video (admin only)
app.delete('/api/videos/:id', (req, res) => {
    const { adminKey } = req.body;
    const videoId = parseInt(req.params.id);
    
    // Simple admin authentication
    if (adminKey !== 'admin123') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    
    const videoIndex = videoDatabase.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Video not found'
        });
    }
    
    const deletedVideo = videoDatabase[videoIndex];
    const wasCurrent = deletedVideo.isCurrent;
    
    videoDatabase.splice(videoIndex, 1);
    
    // If we deleted the current video, set another one as current
    if (wasCurrent && videoDatabase.length > 0) {
        const fallback = videoDatabase.find(v => v.status === 'published') || videoDatabase[0];
        fallback.isCurrent = true;
        currentVideo = fallback;
    }
    
    res.json({
        success: true,
        message: 'Video deleted successfully',
        currentVideo: currentVideo
    });
});

// Start live stream (admin only)
app.post('/api/go-live', (req, res) => {
    const { adminKey, title, youtubeUrl, description } = req.body;
    
    // Simple admin authentication
    if (adminKey !== 'admin123') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    
    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
        return res.status(400).json({
            success: false,
            message: 'Invalid YouTube live stream URL or ID'
        });
    }
    
    const liveStream = {
        id: Math.max(...videoDatabase.map(v => v.id)) + 1,
        title: title,
        youtubeId: youtubeId,
        description: description,
        price: 0,
        category: 'livestream',
        status: 'published',
        type: 'livestream',
        featured: true,
        isCurrent: true,
        views: 0,
        purchases: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0],
        isLive: true,
        startedAt: new Date().toISOString()
    };
    
    // Set all videos as not current
    videoDatabase.forEach(v => v.isCurrent = false);
    
    // Add live stream
    videoDatabase.unshift(liveStream);
    currentVideo = liveStream;
    
    res.json({
        success: true,
        message: 'Live stream started successfully',
        data: liveStream
    });
});

// Stop live stream (admin only)
app.post('/api/stop-live', (req, res) => {
    const { adminKey } = req.body;
    
    // Simple admin authentication
    if (adminKey !== 'admin123') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    
    // Find current live stream
    const liveStream = videoDatabase.find(v => v.isCurrent && v.type === 'livestream');
    if (liveStream) {
        liveStream.isCurrent = false;
        liveStream.isLive = false;
        liveStream.endedAt = new Date().toISOString();
        
        // Set fallback video as current
        const fallback = videoDatabase.find(v => v.status === 'published' && v.type === 'video');
        if (fallback) {
            fallback.isCurrent = true;
            currentVideo = fallback;
        }
    }
    
    res.json({
        success: true,
        message: 'Live stream ended',
        currentVideo: currentVideo
    });
});

// Get analytics (admin only)
app.get('/api/analytics', (req, res) => {
    const { adminKey } = req.query;
    
    // Simple admin authentication
    if (adminKey !== 'admin123') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized access'
        });
    }
    
    const stats = {
        totalVideos: videoDatabase.length,
        publishedVideos: videoDatabase.filter(v => v.status === 'published').length,
        liveStreams: videoDatabase.filter(v => v.type === 'livestream').length,
        totalViews: videoDatabase.reduce((sum, v) => sum + v.views, 0),
        totalRevenue: videoDatabase.reduce((sum, v) => sum + v.revenue, 0),
        currentViewers: Math.floor(Math.random() * 2000) + 1000, // Simulated
        recentVideos: videoDatabase.slice(0, 5)
    };
    
    res.json({
        success: true,
        data: stats
    });
});

// Utility function to extract YouTube ID
function extractYouTubeId(url) {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
        return match[2];
    } else if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) {
        return url;
    }
    
    return null;
}

// Serve static files
app.use(express.static('.'));

// Serve main pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/admin_video_management.html'));
});

app.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/video_player.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'StreamPay Pro API is running',
        timestamp: new Date().toISOString(),
        currentVideo: currentVideo?.title || 'None'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 StreamPay Pro Server Started!');
    console.log('==================================');
    console.log(`🌐 Server running on http://localhost:${PORT}`);
    console.log(`📺 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`▶️  Video Player: http://localhost:${PORT}/player`);
    console.log(`⚡ API Health: http://localhost:${PORT}/api/health`);
    console.log('==================================');
    console.log('✅ YouTube-style video management ready!');
    console.log(`🎬 Current Video: ${currentVideo.title}`);
    console.log(`📊 Total Videos: ${videoDatabase.length}`);
});

module.exports = app;