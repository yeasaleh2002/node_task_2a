const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize } = require('./models');
const routes = require('./routes');
const expressLayouts = require('express-ejs-layouts');

dotenv.config();

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Express layouts configuration
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.use('/api', routes);

// Auth route
app.get('/auth', (req, res) => {
    res.render('auth', {
        title: '2FA Authentication'
    });
});

// Payment route
app.get('/payment', (req, res) => {
    res.render('payment', {
        title: 'Payment',
        stripePublicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_51IWQUwH8oljXErmdg6L4MhsuB6tDdmumlHFfyNaopty2U27pmRcqMX1c868zn838lGQtU1eYV6bKRSQtMFWf36VT00aNsvnTOE'
    });
});

// Chat route
app.get('/chat', (req, res) => {
    // Mock messages - in a real app, these would come from a database
    const messages = [
        {
            user: 'John',
            text: 'Hello everyone!',
            time: '2 minutes ago',
            type: 'received'
        },
        {
            user: 'Sarah',
            text: 'Hi John! How are you?',
            time: '1 minute ago',
            type: 'received'
        }
    ];
    
    res.render('chat', {
        title: 'Chat Room',
        messages: messages
    });
});

app.get('/', async (req, res) => {
    try {
        const stats = {
            uploads: await sequelize.models.Photo.count(),
            users: await sequelize.models.User.count()
        };
        
        const latestPhoto = await sequelize.models.Photo.findOne({
            order: [['createdAt', 'DESC']]
        });

        res.render('index', { 
            title: 'Dashboard',
            latestImage: latestPhoto ? latestPhoto.url : null,
            stats
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        res.render('index', { 
            title: 'Dashboard',
            latestImage: null,
            stats: { uploads: 0, users: 0 }
        });
    }
});

app.get('/airport', (req, res) => {
    res.render('airport', { 
        title: 'Airport Search',
        apiKey: process.env.MAPS_API_KEY || ''
    });
});

app.get('/count', (req, res) => {
    res.render('count', { 
        title: 'Coin Counter'
    });
});

app.get('/export', async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/api/analytics/count');
        const data = await response.json();
        res.render('export', { 
            title: 'Export Analytics',
            analyticsCount: data.count
        });
    } catch (error) {
        res.render('export', { 
            title: 'Export Analytics',
            analyticsCount: 0
        });
    }
});

app.get('/photo', (req, res) => {
    res.render('photo', { 
        title: 'Photo Upload'
    });
});

app.get('/time', (req, res) => {
    const timezones = {
        london: 'Europe/London',
        est: 'America/New_York',
        nigeria: 'Africa/Lagos',
        bangladesh: 'Asia/Dhaka'
    };
    
    const times = {};
    const now = new Date();
    
    for (const [key, timezone] of Object.entries(timezones)) {
        times[key] = now.toLocaleTimeString('en-US', { 
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    
    res.render('time', { 
        title: 'World Time',
        times
    });
});

app.get('/top', async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/api/analytics/top');
        const topAnalytics = await response.json();
        res.render('top', { 
            title: 'Top Analytics',
            topAnalytics
        });
    } catch (error) {
        res.render('top', { 
            title: 'Top Analytics',
            topAnalytics: []
        });
    }
});

// Handle 404
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 3000;

// Database connection and server start
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});