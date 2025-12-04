// Twiki - Educational Doom Scrolling App
// Uses Wikipedia API for facts and OpenAI for engaging content generation

class TwikiApp {
    constructor() {
        this.feed = document.getElementById('feed');
        this.loading = document.getElementById('loading');
        this.configModal = document.getElementById('config-modal');
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.model = localStorage.getItem('openai_model') || 'gpt-5-mini';
        
        // Content tone settings (0-100 scale)
        this.toneSettings = JSON.parse(localStorage.getItem('tone_settings')) || {
            clickbait: 50,    // How sensational/clickbaity the headlines are
            ragebait: 20,     // How provocative/controversial the content is
            shocking: 40,     // How surprising/jaw-dropping the facts are
            darkness: 10      // How emotionally dark/heavy the content is
        };
        
        this.currentTab = 'foryou';
        this.currentTopic = null;
        this.isLoading = false;
        this.postCount = 0;
        this.likedPosts = new Set(JSON.parse(localStorage.getItem('liked_posts') || '[]'));
        this.bookmarkedPosts = new Set(JSON.parse(localStorage.getItem('bookmarked_posts') || '[]'));
        
        // Post style templates for variety
        this.postStyles = [
            'viral_fact', 'hot_take', 'thread', 'meme', 'til', 
            'comparison', 'question', 'myth_buster', 'quote', 'timeline'
        ];
        
        // Track recently used topics to avoid repetition
        this.recentTopics = JSON.parse(localStorage.getItem('recent_topics') || '[]');
        this.maxRecentTopics = 100;
        
        // Massively expanded topics for random exploration
        this.randomTopics = [
            // Science & Physics
            'Quantum entanglement', 'String theory', 'Dark matter', 'Antimatter', 'Superconductivity',
            'Particle physics', 'Nuclear fusion', 'Thermodynamics', 'Electromagnetism', 'Relativity',
            'Higgs boson', 'Neutrino', 'Photon', 'Electron', 'Quark',
            
            // Space & Astronomy
            'Black holes', 'Neutron stars', 'Pulsar', 'Quasar', 'Supernova',
            'Andromeda Galaxy', 'Milky Way', 'Jupiter', 'Saturn rings', 'Mars exploration',
            'Voyager program', 'James Webb telescope', 'Exoplanet', 'Asteroid belt', 'Kuiper belt',
            'Big Bang', 'Cosmic microwave background', 'Dark energy', 'Nebula', 'Binary star',
            
            // Ancient History
            'Ancient Rome', 'Roman Empire', 'Julius Caesar', 'Cleopatra', 'Alexander the Great',
            'Ancient Greece', 'Sparta', 'Athens', 'Parthenon', 'Olympic Games ancient',
            'Egyptian pyramids', 'Tutankhamun', 'Nefertiti', 'Hieroglyphics', 'Valley of the Kings',
            'Mesopotamia', 'Babylon', 'Sumerian civilization', 'Hammurabi', 'Cuneiform',
            'Persian Empire', 'Cyrus the Great', 'Persepolis', 'Achaemenid Empire',
            'Han dynasty', 'Qin Shi Huang', 'Terracotta Army', 'Great Wall of China',
            'Mayan civilization', 'Aztec Empire', 'Inca Empire', 'Machu Picchu', 'Teotihuacan',
            'Viking Age', 'Norse mythology', 'Ragnar Lothbrok', 'Leif Erikson',
            
            // Medieval & Renaissance
            'Medieval Europe', 'Crusades', 'Knights Templar', 'Black Death', 'Feudalism',
            'Byzantine Empire', 'Ottoman Empire', 'Suleiman the Magnificent', 'Constantinople',
            'Renaissance', 'Leonardo da Vinci', 'Michelangelo', 'Sistine Chapel', 'Mona Lisa',
            'Gutenberg printing press', 'Marco Polo', 'Silk Road', 'Genghis Khan', 'Mongol Empire',
            
            // Modern History
            'French Revolution', 'Napoleon Bonaparte', 'Industrial Revolution', 'Victorian era',
            'American Revolution', 'Civil War United States', 'Abraham Lincoln',
            'World War I', 'World War II', 'D-Day', 'Pearl Harbor', 'Holocaust',
            'Cold War', 'Space Race', 'Moon landing', 'Berlin Wall', 'Soviet Union',
            
            // Biology & Nature
            'DNA', 'CRISPR', 'Genetics', 'Evolution', 'Natural selection',
            'Human brain', 'Neurons', 'Consciousness', 'Memory', 'Sleep science',
            'Photosynthesis', 'Cell biology', 'Mitochondria', 'Bacteria', 'Virus',
            'Dinosaurs', 'Tyrannosaurus rex', 'Velociraptor', 'Extinction event', 'Fossils',
            'Deep sea creatures', 'Bioluminescence', 'Giant squid', 'Coral reef', 'Great Barrier Reef',
            'Rainforest', 'Amazon rainforest', 'Biodiversity', 'Endangered species', 'Conservation',
            'Octopus intelligence', 'Dolphin', 'Whale', 'Elephant memory', 'Crow intelligence',
            
            // Geography & Earth Science
            'Volcanoes', 'Earthquakes', 'Plate tectonics', 'Ring of Fire', 'Yellowstone supervolcano',
            'Ocean currents', 'Mariana Trench', 'Atlantic Ocean', 'Pacific Ocean', 'Arctic',
            'Antarctica', 'Mount Everest', 'Grand Canyon', 'Amazon River', 'Nile River',
            'Sahara Desert', 'Gobi Desert', 'Tundra', 'Climate change', 'Ice age',
            
            // Technology & Computing
            'Artificial intelligence', 'Machine learning', 'Neural networks', 'ChatGPT history',
            'Internet history', 'World Wide Web', 'Tim Berners-Lee', 'Alan Turing', 'Enigma machine',
            'Cryptography', 'Blockchain', 'Quantum computing', 'Cybersecurity', 'Hacking',
            'Video game history', 'Nintendo', 'PlayStation history', 'Virtual reality',
            
            // Medicine & Health
            'Vaccines', 'Antibiotics', 'Penicillin', 'Surgery history', 'Anesthesia',
            'Human heart', 'Blood types', 'Immune system', 'Cancer research', 'Stem cells',
            'Epidemics history', 'Spanish flu', 'Smallpox', 'Polio', 'Malaria',
            
            // Psychology & Mind
            'Psychology', 'Sigmund Freud', 'Carl Jung', 'Cognitive bias', 'Optical illusions',
            'Dreams', 'Déjà vu', 'Synesthesia', 'Placebo effect', 'Stockholm syndrome',
            'Personality types', 'Introversion', 'Emotional intelligence', 'Meditation',
            
            // Philosophy & Religion
            'Philosophy', 'Socrates', 'Plato', 'Aristotle', 'Stoicism',
            'Buddhism', 'Hinduism', 'Islam history', 'Christianity history', 'Judaism',
            'Greek mythology', 'Roman mythology', 'Egyptian mythology', 'Norse gods',
            'Ethics', 'Existentialism', 'Nihilism', 'Utilitarianism', 'Free will',
            
            // Arts & Culture
            'Renaissance art', 'Impressionism', 'Pablo Picasso', 'Vincent van Gogh', 'Surrealism',
            'Architecture history', 'Gothic architecture', 'Art Deco', 'Bauhaus',
            'Classical music', 'Ludwig van Beethoven', 'Wolfgang Amadeus Mozart', 'Johann Sebastian Bach',
            'Jazz history', 'Rock and roll history', 'Hip hop history', 'The Beatles',
            'Film history', 'Hollywood', 'Animation history', 'Studio Ghibli',
            'Theatre history', 'William Shakespeare', 'Broadway', 'Opera',
            
            // Literature
            'Ancient literature', 'Homer Iliad', 'Odyssey', 'Epic of Gilgamesh',
            'Jane Austen', 'Charles Dickens', 'Mark Twain', 'Edgar Allan Poe',
            'Science fiction history', 'Fantasy literature', 'Mystery fiction',
            
            // Economics & Society
            'Economics', 'Capitalism', 'Communism', 'Great Depression', 'Stock market crash 1929',
            'Globalization', 'Trade history', 'Silk Road trade', 'East India Company',
            'Labor movement', 'Suffrage movement', 'Civil rights movement',
            
            // Sports & Games
            'Olympic Games history', 'FIFA World Cup', 'Super Bowl', 'Basketball history',
            'Baseball history', 'Tennis history', 'Golf history', 'Formula One',
            'Chess history', 'Poker history', 'Board games history', 'Martial arts',
            
            // Food & Cuisine
            'Coffee history', 'Tea history', 'Chocolate history', 'Wine history', 'Beer history',
            'Sushi', 'Pizza history', 'Spice trade', 'French cuisine', 'Italian cuisine',
            'Fermentation', 'Bread history', 'Sugar history', 'Salt history',
            
            // Inventions & Discoveries
            'Wheel invention', 'Fire discovery', 'Compass invention', 'Telescope invention',
            'Microscope invention', 'Steam engine', 'Light bulb', 'Telephone invention',
            'Radio invention', 'Television history', 'Airplane invention', 'Wright brothers',
            'Automobile history', 'Henry Ford', 'Rocket science', 'Nuclear power',
            
            // Mysteries & Unexplained
            'Bermuda Triangle', 'Stonehenge', 'Nazca Lines', 'Easter Island statues',
            'Atlantis', 'Loch Ness Monster', 'Area 51', 'Roswell incident',
            'Voynich manuscript', 'Antikythera mechanism', 'Sailing stones', 'Ball lightning',
            
            // Famous People
            'Albert Einstein', 'Isaac Newton', 'Nikola Tesla', 'Thomas Edison', 'Marie Curie',
            'Charles Darwin', 'Galileo Galilei', 'Copernicus', 'Stephen Hawking',
            'Winston Churchill', 'Franklin D. Roosevelt', 'Mahatma Gandhi', 'Nelson Mandela',
            'Queen Victoria', 'Catherine the Great', 'Elizabeth I', 'Louis XIV',
            'Sigmund Freud', 'Florence Nightingale', 'Ada Lovelace', 'Amelia Earhart',

            // Pop Culture & Internet
            'Viral videos', 'Internet memes history', 'Social media evolution', 'Streaming wars',
            'Influencer culture', 'Fandom culture', 'Cosplay', 'Esports', 'K-pop history',
            'Anime history', 'Manga history', 'Comic book history', 'Marvel Cinematic Universe',
            'Star Wars cultural impact', 'Harry Potter phenomenon', 'Game of Thrones cultural impact',
            
            // Urban Legends & Folklore
            'Bigfoot', 'Chupacabra', 'Mothman', 'Jersey Devil', 'Slender Man',
            'Bloody Mary folklore', 'Hookman', 'Vanishing hitchhiker', 'Black-eyed children',
            'Polybius game', 'Sewer alligator', 'Razor blades in candy',
            
            // Weird Science & Oddities
            'Spontaneous human combustion', 'Dancing Plague of 1518', 'Emu War', 'Great Molasses Flood',
            'Rain of animals', 'Exploding head syndrome', 'Foreign accent syndrome', 'Cotard delusion',
            'Capgras delusion', 'Fregoli delusion', 'Paris syndrome', 'Stendhal syndrome',
            'Voynich manuscript', 'Mary Celeste', 'Dyatlov Pass incident', 'Tunguska event'
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadConfig();
        this.loadInitialFeed();
        this.setupInfiniteScroll();
    }
    
    setupEventListeners() {
        // Config modal
        document.getElementById('config-btn').addEventListener('click', () => this.openConfigModal());
        document.getElementById('close-modal').addEventListener('click', () => this.closeConfigModal());
        document.getElementById('save-config').addEventListener('click', () => this.saveConfig());
        
        // Close modal on outside click
        this.configModal.addEventListener('click', (e) => {
            if (e.target === this.configModal) this.closeConfigModal();
        });
        
        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Topic tags
        document.querySelectorAll('.topic-tag').forEach(tag => {
            tag.addEventListener('click', (e) => this.selectTopic(e.target.dataset.topic));
        });
        
        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => this.refreshFeed());
        
        // Search
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchTopic(e.target.value);
        });
        
        // Tone sliders - live update display
        ['clickbait', 'ragebait', 'shocking', 'darkness'].forEach(name => {
            document.getElementById(`${name}-slider`).addEventListener('input', () => {
                this.updateSliderDisplays();
            });
        });
        
        // Mobile navigation
        this.setupMobileNavigation();
    }
    
    setupMobileNavigation() {
        // Mobile config button
        const mobileConfigBtn = document.getElementById('mobile-config-btn');
        if (mobileConfigBtn) {
            mobileConfigBtn.addEventListener('click', () => this.openConfigModal());
        }
        
        // Mobile search
        const mobileSearchBtn = document.getElementById('mobile-search-btn');
        const mobileSearchOverlay = document.getElementById('mobile-search-overlay');
        const mobileSearchClose = document.getElementById('mobile-search-close');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        
        if (mobileSearchBtn && mobileSearchOverlay) {
            mobileSearchBtn.addEventListener('click', () => {
                mobileSearchOverlay.classList.add('active');
                mobileSearchInput?.focus();
            });
            
            mobileSearchClose?.addEventListener('click', () => {
                mobileSearchOverlay.classList.remove('active');
            });
            
            mobileSearchInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                    this.searchTopic(e.target.value);
                    mobileSearchOverlay.classList.remove('active');
                    e.target.value = '';
                }
            });
        }
        
        // Mobile topic tags
        document.querySelectorAll('.mobile-topic').forEach(tag => {
            tag.addEventListener('click', (e) => {
                this.selectTopic(e.target.dataset.topic);
                mobileSearchOverlay?.classList.remove('active');
            });
        });
        
        // Mobile bottom navigation
        const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = item.dataset.tab;
                
                // Handle refresh button
                if (item.id === 'mobile-nav-refresh') {
                    this.refreshFeed();
                    return;
                }
                
                // Update active state
                mobileNavItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Switch tab
                if (tab) {
                    this.switchTab(tab);
                    
                    // Also update desktop tabs
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    const desktopTab = document.querySelector(`.tab[data-tab="${tab}"]`);
                    if (desktopTab) desktopTab.classList.add('active');
                }
            });
        });
    }
    
    loadConfig() {
        document.getElementById('api-key').value = this.apiKey;
        document.getElementById('model-select').value = this.model;
        
        // Load tone settings
        document.getElementById('clickbait-slider').value = this.toneSettings.clickbait;
        document.getElementById('ragebait-slider').value = this.toneSettings.ragebait;
        document.getElementById('shocking-slider').value = this.toneSettings.shocking;
        document.getElementById('darkness-slider').value = this.toneSettings.darkness;
        
        this.updateSliderDisplays();
    }
    
    updateSliderDisplays() {
        const sliders = ['clickbait', 'ragebait', 'shocking', 'darkness'];
        sliders.forEach(name => {
            const slider = document.getElementById(`${name}-slider`);
            const value = parseInt(slider.value);
            document.getElementById(`${name}-value`).textContent = `${value}%`;
            
            // Update slider group class for color
            const group = slider.closest('.slider-group');
            group.classList.remove('low', 'medium', 'high');
            if (value <= 33) group.classList.add('low');
            else if (value <= 66) group.classList.add('medium');
            else group.classList.add('high');
        });
    }
    
    openConfigModal() {
        this.configModal.classList.add('active');
    }
    
    closeConfigModal() {
        this.configModal.classList.remove('active');
    }
    
    saveConfig() {
        this.apiKey = document.getElementById('api-key').value.trim();
        this.model = document.getElementById('model-select').value;
        
        // Save tone settings
        this.toneSettings = {
            clickbait: parseInt(document.getElementById('clickbait-slider').value),
            ragebait: parseInt(document.getElementById('ragebait-slider').value),
            shocking: parseInt(document.getElementById('shocking-slider').value),
            darkness: parseInt(document.getElementById('darkness-slider').value)
        };
        
        localStorage.setItem('openai_api_key', this.apiKey);
        localStorage.setItem('openai_model', this.model);
        localStorage.setItem('tone_settings', JSON.stringify(this.toneSettings));
        
        this.showToast('Configuration saved!', 'success');
        this.closeConfigModal();
        
        // Reload feed if it was empty due to missing API key
        if (this.feed.children.length === 0) {
            this.loadInitialFeed();
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
    
    switchTab(tab) {
        this.currentTab = tab;
        this.currentTopic = null;
        
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        const desktopTab = document.querySelector(`.tab[data-tab="${tab}"]`);
        if (desktopTab) desktopTab.classList.add('active');
        
        // Sync mobile navigation
        document.querySelectorAll('.mobile-nav-item').forEach(nav => {
            nav.classList.remove('active');
            if (nav.dataset.tab === tab) nav.classList.add('active');
        });
        // If no tab matched (e.g., "foryou"), highlight home
        if (tab === 'foryou') {
            const homeNav = document.getElementById('mobile-nav-home');
            if (homeNav) homeNav.classList.add('active');
        }
        
        document.querySelectorAll('.topic-tag').forEach(t => t.classList.remove('active'));
        
        this.refreshFeed();
    }
    
    selectTopic(topic) {
        this.currentTopic = topic;
        
        document.querySelectorAll('.topic-tag').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-topic="${topic}"]`).classList.add('active');
        
        this.refreshFeed();
    }
    
    searchTopic(query) {
        if (query.trim()) {
            this.currentTopic = query.trim();
            this.refreshFeed();
        }
    }
    
    refreshFeed() {
        this.feed.innerHTML = '';
        this.postCount = 0;
        // Keep recent topics to avoid repetition across refreshes
        this.loadInitialFeed();
    }
    
    async loadInitialFeed() {
        await this.loadMorePosts(5);
    }
    
    setupInfiniteScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isLoading) {
                    this.loadMorePosts(3);
                }
            });
        }, { threshold: 0.1 });
        
        // Create scroll trigger element
        const trigger = document.createElement('div');
        trigger.className = 'scroll-trigger';
        trigger.id = 'scroll-trigger';
        this.feed.after(trigger);
        observer.observe(trigger);
    }
    
    async loadMorePosts(count) {
        if (this.isLoading) return;
        
        if (!this.apiKey) {
            this.showNoApiKeyMessage();
            return;
        }
        
        this.isLoading = true;
        this.loading.classList.add('active');
        
        try {
            for (let i = 0; i < count; i++) {
                const wikiData = await this.fetchWikipediaContent();
                if (wikiData) {
                    const post = await this.generatePost(wikiData);
                    if (post) {
                        this.renderPost(post, wikiData);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            this.showToast('Error loading posts. Check your API key.', 'error');
        }
        
        this.isLoading = false;
        this.loading.classList.remove('active');
    }
    
    showNoApiKeyMessage() {
        this.feed.innerHTML = `
            <div class="post" style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 16px;">🔑</div>
                <h3 style="margin-bottom: 12px;">OpenAI API Key Required</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    To generate engaging posts from Wikipedia content, please add your OpenAI API key.
                </p>
                <button onclick="app.openConfigModal()" style="
                    padding: 12px 24px;
                    background-color: var(--accent-color);
                    border: none;
                    border-radius: 30px;
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                ">Add API Key</button>
            </div>
        `;
    }
    
    async fetchWikipediaContent() {
        let searchTerm;
        
        // Handle memes tab - use funny/meme-friendly topics
        if (this.currentTab === 'memes' || this.currentTopic === 'Memes') {
            const memeTopics = [
                // Relatable daily life
                'Procrastination', 'Coffee', 'Sleep deprivation', 'Monday', 'Friday',
                'Alarm clock', 'Snooze button', 'Morning routine', 'Bedtime', 'Napping',
                'Traffic', 'Public transportation', 'Commute', 'Parking', 'Road rage',
                'Meetings', 'Email', 'Zoom fatigue', 'Work from home', 'Office politics',
                'Grocery shopping', 'Laundry', 'Cooking', 'Cleaning', 'Dishes',
                'Taxes', 'Bills', 'Budgeting', 'Paycheck', 'Shopping',
                
                // Technology struggles
                'Wifi', 'Battery life', 'Autocorrect', 'Passwords', 'Software updates',
                'Loading screen', 'Buffering', 'Blue screen of death', 'Tech support',
                'Smartphone addiction', 'Notification', 'Browser tabs', 'Cloud storage',
                'Printer problems', 'USB direction', 'Tangled headphones', 'Charging cable',
                
                // Social & relationships
                'Introvert', 'Extrovert', 'Social anxiety', 'Small talk', 'Awkward silence',
                'Friendship', 'Dating', 'Texting etiquette', 'Read receipts', 'Group chat',
                'Party', 'FOMO', 'Social media', 'Selfie', 'Photobomb',
                
                // Food & drink
                'Pizza', 'Tacos', 'Sushi', 'Fast food', 'Midnight snack',
                'Diet', 'Calories', 'Salad', 'Dessert', 'Food coma',
                'Coffee addiction', 'Energy drinks', 'Water reminder', 'Cooking fails',
                
                // Animals
                'Cats', 'Dogs', 'Cat behavior', 'Dog behavior', 'Pet ownership',
                'Birds', 'Squirrels', 'Raccoons', 'Ducks', 'Pigeons',
                
                // Pop culture references
                'Meme culture', 'Internet culture', 'Video games', 'Netflix', 'Streaming',
                'Binge watching', 'Spoilers', 'Fan theory', 'Nostalgia', 'Childhood',
                
                // Education & work
                'Homework', 'Procrastination', 'All-nighter', 'Group project', 'Deadline',
                'Resume', 'Job interview', 'First day', 'Imposter syndrome', 'Burnout',
                
                // Miscellaneous fun
                'Dinosaurs', 'Ancient Egypt', 'Vikings', 'Pirates', 'Ninjas',
                'Robots', 'Aliens', 'Time travel', 'Parallel universe', 'Simulation theory',
                'Conspiracy theories', 'Flat Earth', 'Bermuda Triangle', 'Area 51',
                'Horoscopes', 'Superstition', 'Luck', 'Murphy\'s law', 'Irony',
                
                // Seasons & weather
                'Summer', 'Winter', 'Rain', 'Snow', 'Humidity',
                'Air conditioning', 'Heating', 'Weather forecast', 'Umbrella',
                
                // Health & fitness
                'Exercise', 'Gym', 'New Year resolution', 'Step counter', 'Stretching',
                'Back pain', 'Headache', 'Allergies', 'Common cold', 'Doctor visit',
                
                // Time & aging
                'Aging', 'Birthday', 'Memory', 'Nostalgia', 'Time flies',
                'Childhood memories', 'Adulting', 'Quarter life crisis', 'Midlife crisis'
            ];
            searchTerm = this.getUniqueRandomTopic(memeTopics);
        } else if (this.currentTopic) {
            // For user-selected topics, search for related articles instead of just the topic itself
            searchTerm = await this.getRelatedArticle(this.currentTopic);
        } else if (this.currentTab === 'random') {
            // Get truly random article from Wikipedia
            const randomUrl = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
            try {
                const response = await fetch(randomUrl);
                const data = await response.json();
                // Track this topic
                this.trackRecentTopic(data.title);
                return {
                    title: data.title,
                    extract: data.extract,
                    url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
                    thumbnail: data.thumbnail?.source
                };
            } catch (e) {
                console.log('Random article fetch failed');
            }
        } else if (this.currentTab === 'trending') {
            // Use "On this day" or featured content
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const onThisDayUrl = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}`;
            
            try {
                const response = await fetch(onThisDayUrl);
                const data = await response.json();
                if (data.events && data.events.length > 0) {
                    // Get a random event we haven't shown recently
                    const availableEvents = data.events.filter(e => 
                        e.pages?.[0] && !this.recentTopics.includes(e.pages[0].title)
                    );
                    const events = availableEvents.length > 0 ? availableEvents : data.events;
                    const event = events[Math.floor(Math.random() * events.length)];
                    const page = event.pages?.[0];
                    if (page) {
                        this.trackRecentTopic(page.title);
                        return {
                            title: page.title,
                            extract: page.extract || event.text,
                            url: page.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
                            thumbnail: page.thumbnail?.source,
                            year: event.year,
                            isOnThisDay: true
                        };
                    }
                }
            } catch (e) {
                console.log('On this day fetch failed, falling back to random');
            }
            searchTerm = this.getUniqueRandomTopic(this.randomTopics);
        } else {
            // For You - mix of random topics, avoiding recent ones
            searchTerm = this.getUniqueRandomTopic(this.randomTopics);
        }
        
        // Search Wikipedia with the term
        return await this.searchWikipedia(searchTerm);
    }
    
    // Get a random topic we haven't used recently
    getUniqueRandomTopic(topicList) {
        // Filter out recently used topics
        const availableTopics = topicList.filter(t => !this.recentTopics.includes(t));
        
        // If we've used most topics, use any topic
        const topics = availableTopics.length > 5 ? availableTopics : topicList;
        const topic = topics[Math.floor(Math.random() * topics.length)];
        
        this.trackRecentTopic(topic);
        return topic;
    }
    
    // Track recently used topics
    trackRecentTopic(topic) {
        if (!this.recentTopics.includes(topic)) {
            this.recentTopics.push(topic);
            if (this.recentTopics.length > this.maxRecentTopics) {
                this.recentTopics.shift();
            }
            localStorage.setItem('recent_topics', JSON.stringify(this.recentTopics));
        }
    }
    
    // Get a related article for a topic to add variety
    async getRelatedArticle(topic) {
        try {
            // Search for articles related to the topic
            const searchApiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=20&format=json&origin=*`;
            const response = await fetch(searchApiUrl);
            const data = await response.json();
            
            if (data.query?.search?.length > 0) {
                // Filter out recently used articles
                const availableResults = data.query.search.filter(r => 
                    !this.recentTopics.includes(r.title)
                );
                
                const results = availableResults.length > 0 ? availableResults : data.query.search;
                // Pick a random result from the search results
                const randomIndex = Math.floor(Math.random() * results.length);
                const selectedTitle = results[randomIndex].title;
                this.trackRecentTopic(selectedTitle);
                return selectedTitle;
            }
        } catch (e) {
            console.log('Related article search failed');
        }
        
        this.trackRecentTopic(topic);
        return topic;
    }
    
    // Search Wikipedia for an article
    async searchWikipedia(searchTerm) {
        const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`;
        
        try {
            const response = await fetch(searchUrl);
            if (!response.ok) {
                // Try search API instead
                const searchApiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&origin=*`;
                const searchResponse = await fetch(searchApiUrl);
                const searchData = await searchResponse.json();
                
                if (searchData.query?.search?.[0]) {
                    const title = searchData.query.search[0].title;
                    const summaryResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
                    const summaryData = await summaryResponse.json();
                    return {
                        title: summaryData.title,
                        extract: summaryData.extract,
                        url: summaryData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
                        thumbnail: summaryData.thumbnail?.source
                    };
                }
            }
            
            const data = await response.json();
            return {
                title: data.title,
                extract: data.extract,
                url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}`,
                thumbnail: data.thumbnail?.source
            };
        } catch (error) {
            console.error('Wikipedia fetch error:', error);
            return null;
        }
    }
    
    async generatePost(wikiData) {
        // Validate input
        if (!wikiData || !wikiData.extract || !wikiData.title) {
            console.warn('Invalid wikiData:', wikiData);
            return null;
        }
        
        // Force meme style for memes tab/topic
        const isMemeMode = this.currentTab === 'memes' || this.currentTopic === 'Memes';
        
        let style;
        if (isMemeMode) {
            const memeStyles = ['meme_shitpost', 'meme_surreal', 'meme_rant', 'meme_galaxy_brain', 'meme_existential'];
            style = memeStyles[Math.floor(Math.random() * memeStyles.length)];
        } else {
            style = this.postStyles[Math.floor(Math.random() * this.postStyles.length)];
        }
        
        const stylePrompts = {
            viral_fact: "Create a viral, mind-blowing fact tweet that will make people go 'Wait, WHAT?!' Use dramatic language, build suspense, and end with a punchline that makes people want to share immediately.",
            hot_take: "Create a spicy, thought-provoking hot take or controversial-sounding (but factually accurate) opinion. Challenge the status quo or a common belief about this topic. Make people want to argue in the replies.",
            thread: "Create the first tweet of what would be a fascinating thread. Start with a hook like 'A thread 🧵' or 'Here's the story of...' and make people desperate to read more. Tease a crazy detail that comes later.",
            meme: "Create an UNHINGED, chronically online Twitter/X or Reddit shitpost. This needs to feel like it was written by someone who hasn't slept in 3 days and just discovered this fact at 4am. Use internet slang appropriately (fr, no cap, skull emoji, etc.) but keep it readable.",
            til: "Create a 'Today I Learned' (TIL) style tweet that shares a genuinely surprising fact in a conversational way. Frame it as a personal discovery that blew your mind.",
            comparison: "Create a tweet that makes a surprising comparison or puts something in perspective (like 'X is older than Y' or 'X is bigger than Y'). Use a concrete analogy that makes the scale or time difference feel real.",
            question: "Create a rhetorical question tweet that makes people think, followed by a mind-blowing answer or fact. Engage the reader directly: 'Did you know...?' or 'Have you ever wondered...?'",
            myth_buster: "Create a myth-busting tweet that corrects a common misconception. Start with 'Actually...' or 'Stop believing that...' and aggressively (but politely) correct the record with the truth.",
            quote: "If there's a relevant quote, create a tweet featuring it. Otherwise, create an insightful observation about the topic that sounds like a profound quote. Make it Pinterest-worthy but for Twitter.",
            timeline: "Create a tweet that puts historical events in perspective. Connect two seemingly unrelated events that happened at the same time, or show how short/long a time period really was. 'Cleopatra lived closer to the iPhone than the Pyramids' style.",
            meme_shitpost: "Create a low-effort, chaotic shitpost. Use lowercase, minimal punctuation, and internet slang (fr, ong, skull emoji). Be aggressively casual and dismissive or overly hyped about a mundane detail. DO NOT start with 'Just found out'.",
            meme_surreal: "Create a surreal, disjointed tweet that feels like a fever dream. Mix the factual information with bizarre, non-sequitur imagery. Make the reader question reality.",
            meme_rant: "Write an unhinged, all-caps rant about this topic. Act like this specific fact is ruining your life or is the key to a global conspiracy. Use excessive punctuation (!!! ???). Scream into the void.",
            meme_galaxy_brain: "Connect this topic to something completely unrelated in a 'galaxy brain' way. Make a wild philosophical leap that barely makes sense but sounds profound if you're high. Use the 🤯 emoji.",
            meme_existential: "Use this fact to trigger an existential crisis. Start normal and spiral into dread about the nature of existence, time, or consciousness. End with 'we are dust' energy."
        };
        
        // Build tone instructions based on user settings
        const toneInstructions = this.buildToneInstructions();
        
        // Get current date for context
        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const prompt = `TOPIC: ${wikiData.title}

SOURCE MATERIAL:
${wikiData.extract}

STYLE: ${stylePrompts[style] || stylePrompts.viral_fact}

TONE SETTINGS:
${toneInstructions}

Create a single tweet (max 280 characters) based on the source material above. Use 1-3 emojis and 1-2 hashtags. Be accurate to the source - do not invent facts. Sound like a real person, not a textbook.

Respond with ONLY the tweet text, nothing else.`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { 
                            role: 'system', 
                            content: `You are a viral social media content creator. Create engaging tweets based on facts provided. Today is ${dateString}. Always respond with just the tweet text.`
                        },
                        { role: 'user', content: prompt }
                    ],
                    max_completion_tokens: 200
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }
            
            const data = await response.json();
            const text = data.choices?.[0]?.message?.content?.trim();
            
            // Validate we got actual content
            if (!text || text.length < 10) {
                console.warn('Empty or too short response from API:', text);
                return null;
            }
            
            return {
                text: text,
                style: style,
                id: `post_${Date.now()}_${this.postCount++}`
            };
        } catch (error) {
            console.error('OpenAI API error:', error);
            this.showToast(`API Error: ${error.message}`, 'error');
            return null;
        }
    }
    
    renderPost(post, wikiData) {
        const postElement = document.createElement('article');
        postElement.className = 'post';
        postElement.dataset.id = post.id;
        
        const avatar = this.getAvatarEmoji(wikiData.title);
        const handle = this.generateHandle(wikiData.title);
        const timeAgo = this.getRandomTimeAgo();
        const styleLabel = this.getStyleLabel(post.style);
        
        // Format post text with hashtags highlighted
        const formattedText = post.text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
        
        // Generate random engagement numbers
        const likes = Math.floor(Math.random() * 50000) + 100;
        const reposts = Math.floor(Math.random() * likes * 0.3);
        const replies = Math.floor(Math.random() * likes * 0.1);
        const views = likes * (Math.floor(Math.random() * 20) + 5);
        
        const isLiked = this.likedPosts.has(post.id);
        const isBookmarked = this.bookmarkedPosts.has(post.id);
        
        postElement.innerHTML = `
            <div class="post-header">
                <div class="post-avatar">${avatar}</div>
                <div class="post-content">
                    <div class="post-meta">
                        <span class="post-author">Wiki${this.capitalizeFirst(handle)}</span>
                        <svg class="verified-badge" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/></svg>
                        <span class="post-handle">@wiki_${handle}</span>
                        <span class="post-time">· ${timeAgo}</span>
                        <span class="post-type ${post.style}">${styleLabel}</span>
                    </div>
                    <p class="post-text">${formattedText}</p>
                    ${wikiData.thumbnail ? `<img src="${wikiData.thumbnail}" alt="${wikiData.title}" class="post-image" loading="lazy">` : ''}
                    <a href="${wikiData.url}" target="_blank" class="post-source">
                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                        Read more on Wikipedia
                    </a>
                    <div class="post-actions">
                        <button class="action-btn reply" title="Reply">
                            <svg viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/></svg>
                            <span>${this.formatNumber(replies)}</span>
                        </button>
                        <button class="action-btn repost" title="Repost">
                            <svg viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/></svg>
                            <span>${this.formatNumber(reposts)}</span>
                        </button>
                        <button class="action-btn like ${isLiked ? 'active' : ''}" title="Like" data-id="${post.id}">
                            <svg viewBox="0 0 24 24"><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/></svg>
                            <span>${this.formatNumber(likes)}</span>
                        </button>
                        <button class="action-btn views" title="Views">
                            <svg viewBox="0 0 24 24"><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"/></svg>
                            <span>${this.formatNumber(views)}</span>
                        </button>
                        <button class="action-btn bookmark ${isBookmarked ? 'active' : ''}" title="Bookmark" data-id="${post.id}">
                            <svg viewBox="0 0 24 24"><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/></svg>
                        </button>
                        <button class="action-btn share" title="Share">
                            <svg viewBox="0 0 24 24"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners for actions
        this.addPostEventListeners(postElement, post.id);
        
        this.feed.appendChild(postElement);
    }
    
    addPostEventListeners(postElement, postId) {
        const likeBtn = postElement.querySelector('.action-btn.like');
        const bookmarkBtn = postElement.querySelector('.action-btn.bookmark');
        const shareBtn = postElement.querySelector('.action-btn.share');
        
        likeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLike(postId, likeBtn);
        });
        
        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleBookmark(postId, bookmarkBtn);
        });
        
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.sharePost(postElement);
        });
    }
    
    toggleLike(postId, btn) {
        if (this.likedPosts.has(postId)) {
            this.likedPosts.delete(postId);
            btn.classList.remove('active');
        } else {
            this.likedPosts.add(postId);
            btn.classList.add('active');
        }
        localStorage.setItem('liked_posts', JSON.stringify([...this.likedPosts]));
    }
    
    toggleBookmark(postId, btn) {
        if (this.bookmarkedPosts.has(postId)) {
            this.bookmarkedPosts.delete(postId);
            btn.classList.remove('active');
            this.showToast('Removed from bookmarks');
        } else {
            this.bookmarkedPosts.add(postId);
            btn.classList.add('active');
            this.showToast('Added to bookmarks', 'success');
        }
        localStorage.setItem('bookmarked_posts', JSON.stringify([...this.bookmarkedPosts]));
    }
    
    sharePost(postElement) {
        const text = postElement.querySelector('.post-text').textContent;
        const sourceLink = postElement.querySelector('.post-source').href;
        
        if (navigator.share) {
            navigator.share({
                title: 'Check out this fact from Twiki!',
                text: text,
                url: sourceLink
            });
        } else {
            navigator.clipboard.writeText(`${text}\n\nSource: ${sourceLink}`);
            this.showToast('Copied to clipboard!', 'success');
        }
    }
    
    getAvatarEmoji(title) {
        const categories = {
            science: ['🔬', '🧪', '⚗️', '🔭', '🧬'],
            space: ['🚀', '🌟', '🌙', '☄️', '🛸'],
            history: ['📜', '🏛️', '⚔️', '👑', '🗿'],
            nature: ['🌿', '🌺', '🦋', '🌊', '🏔️'],
            animal: ['🦁', '🐘', '🦈', '🦅', '🐙'],
            tech: ['💻', '🤖', '📱', '⚡', '🔋'],
            art: ['🎨', '🎭', '🎬', '📷', '✨'],
            music: ['🎵', '🎸', '🎹', '🎺', '🎻'],
            food: ['🍕', '🍜', '🍰', '🍷', '🌮'],
            sports: ['⚽', '🏀', '🎾', '🏆', '🥇'],
            philosophy: ['🤔', '💭', '📚', '🧠', '💡']
        };
        
        const titleLower = title.toLowerCase();
        
        for (const [category, emojis] of Object.entries(categories)) {
            if (titleLower.includes(category) || 
                (category === 'animal' && /animal|species|mammal|bird|fish|insect/.test(titleLower)) ||
                (category === 'space' && /space|planet|star|galaxy|universe|moon|asteroid/.test(titleLower)) ||
                (category === 'history' && /war|ancient|century|empire|king|queen|dynasty/.test(titleLower)) ||
                (category === 'science' && /physics|chemistry|biology|scientist|experiment|theory/.test(titleLower)) ||
                (category === 'nature' && /plant|tree|flower|ocean|mountain|forest|river/.test(titleLower)) ||
                (category === 'tech' && /computer|software|internet|digital|electronic|robot/.test(titleLower))) {
                return emojis[Math.floor(Math.random() * emojis.length)];
            }
        }
        
        const allEmojis = Object.values(categories).flat();
        return allEmojis[Math.floor(Math.random() * allEmojis.length)];
    }
    
    generateHandle(title) {
        const words = title.toLowerCase().split(/\s+/).slice(0, 2);
        return words.join('_').replace(/[^a-z0-9_]/g, '');
    }
    
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    getRandomTimeAgo() {
        const times = ['1m', '2m', '5m', '10m', '15m', '30m', '1h', '2h', '3h', '5h', '8h', '12h', '1d', '2d'];
        return times[Math.floor(Math.random() * times.length)];
    }
    
    getStyleLabel(style) {
        const labels = {
            viral_fact: '🔥 FACT',
            hot_take: '🌶️ TAKE',
            thread: '🧵 THREAD',
            meme: '😂 MEME',
            til: '💡 TIL',
            comparison: '⚖️ VS',
            question: '❓ Q&A',
            myth_buster: '🔍 MYTH',
            quote: '💬 QUOTE',
            timeline: '📅 TIME'
        };
        return labels[style] || 'FACT';
    }
    
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
    
    buildToneInstructions() {
        const { clickbait, ragebait, shocking, darkness } = this.toneSettings;
        
        let instructions = [];
        
        // Clickbait level
        if (clickbait <= 20) {
            instructions.push(`- Clickbait Level: ${clickbait}% - Be straightforward and factual. Avoid sensationalism. Use plain, honest language.`);
        } else if (clickbait <= 50) {
            instructions.push(`- Clickbait Level: ${clickbait}% - Moderately engaging. Use some curiosity gaps but stay mostly informative.`);
        } else if (clickbait <= 80) {
            instructions.push(`- Clickbait Level: ${clickbait}% - Make it attention-grabbing! Use phrases like "You won't believe...", "This changes everything...", create urgency and curiosity.`);
        } else {
            instructions.push(`- Clickbait Level: ${clickbait}% - MAXIMUM clickbait energy! Use ALL CAPS for emphasis, cliffhangers, dramatic reveals, "BREAKING:", "NOBODY is talking about this...", make them NEED to know more!`);
        }
        
        // Ragebait level
        if (ragebait <= 20) {
            instructions.push(`- Ragebait Level: ${ragebait}% - Keep it neutral and balanced. Avoid controversy. Be diplomatic.`);
        } else if (ragebait <= 50) {
            instructions.push(`- Ragebait Level: ${ragebait}% - Slightly provocative. Include mild hot takes or contrarian viewpoints that might spark friendly debate.`);
        } else if (ragebait <= 80) {
            instructions.push(`- Ragebait Level: ${ragebait}% - Be provocative! Challenge popular beliefs, use phrases like "unpopular opinion", "I don't care what anyone says", pick a side strongly.`);
        } else {
            instructions.push(`- Ragebait Level: ${ragebait}% - MAXIMUM controversy! Take the spiciest possible take. Be deliberately polarizing. Use confrontational language like "If you disagree you're wrong", "This will make people mad but...", "Wake up people!"`);
        }
        
        // Shocking level
        if (shocking <= 20) {
            instructions.push(`- Shock Factor: ${shocking}% - Present information calmly. Understated and matter-of-fact.`);
        } else if (shocking <= 50) {
            instructions.push(`- Shock Factor: ${shocking}% - Moderately surprising. Highlight the interesting aspects but don't oversell.`);
        } else if (shocking <= 80) {
            instructions.push(`- Shock Factor: ${shocking}% - Make jaws DROP! Emphasize the most mind-blowing aspects. Use "Wait, WHAT?!", "I'm still processing this...", "This broke my brain..."`);
        } else {
            instructions.push(`- Shock Factor: ${shocking}% - ABSOLUTELY UNHINGED shock value! Act like you just discovered the most earth-shattering information ever. "I can't sleep after learning this", "WHY isn't this taught in schools?!", "This changes EVERYTHING we thought we knew!"`);
        }
        
        // Darkness/emotional depth level
        if (darkness <= 20) {
            instructions.push(`- Emotional Depth: ${darkness}% - Keep it light and fun! Focus on uplifting, amusing, or wonder-inducing aspects.`);
        } else if (darkness <= 50) {
            instructions.push(`- Emotional Depth: ${darkness}% - Balance light and serious. Include some thought-provoking elements but don't get too heavy.`);
        } else if (darkness <= 80) {
            instructions.push(`- Emotional Depth: ${darkness}% - Go deeper emotionally. Touch on existential themes, mortality, human suffering, or philosophical weight. Make people feel something profound.`);
        } else {
            instructions.push(`- Emotional Depth: ${darkness}% - MAXIMUM emotional weight. Focus on the darkest, most haunting aspects. Existential dread, tragic ironies, the fleeting nature of existence, things that keep you up at night. Melancholic and profound.`);
        }
        
        return instructions.join('\n');
    }
}

// Initialize app
const app = new TwikiApp();
