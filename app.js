document.addEventListener('DOMContentLoaded', () => {
    // Application State
    let state = {
        currentView: 'schools',
        navigationHistory: [],
        schools: [],
        teams: [],
        individuals: [],
        selectedSchool: null,
        selectedCategory: null,
        selectedSport: null,
        selectedYear: null,
        selectedTeam: null,
        selectedPlayer: null,
        selectedAthlete: null,
        currentImageIndex: 0,
        searchQuery: '',
        searchResults: {
            players: [],
            teams: []
        }
    };

    // DOM Elements
    const contentContainer = document.getElementById('content-container');
    const backButton = document.getElementById('back-button');
    const homeButton = document.getElementById('home-button');
    const loadingSpinner = document.getElementById('loading-spinner');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // Default Theme Colors (for resetting)
    let defaultTheme = {
        primary: '#00205B',
        secondary: '#EFBF04',
        accent: '#000000',
        backgroundGradient: 'linear-gradient(135deg, #00205B11 0%, #E0E0E0 100%)'
    };

    // Sport Icons Mapping - More comprehensive with generic terms for matching
    const sportIcons = {
        // Basketball
        "basketball": "fa-basketball-ball",
        "men's basketball": "fa-basketball-ball",
        "women's basketball": "fa-basketball-ball",
        "boys basketball": "fa-basketball-ball",
        "girls basketball": "fa-basketball-ball",
        
        // Football
        "football": "fa-football-ball",
        
        // Baseball/Softball
        "baseball": "fa-baseball-ball",
        "softball": "fa-baseball-ball",
        "women's softball": "fa-baseball-ball",
        "girls softball": "fa-baseball-ball",
        
        // Soccer
        "soccer": "fa-futbol",
        "men's soccer": "fa-futbol",
        "women's soccer": "fa-futbol",
        "boys soccer": "fa-futbol",
        "girls soccer": "fa-futbol",
        
        // Volleyball
        "volleyball": "fa-volleyball-ball",
        "women's volleyball": "fa-volleyball-ball",
        "girls volleyball": "fa-volleyball-ball",
        
        // Track & Field
        "track": "fa-running",
        "track & field": "fa-running",
        "track and field": "fa-running",
        "men's track": "fa-running",
        "women's track": "fa-running",
        "men's track & field": "fa-running",
        "women's track & field": "fa-running",
        
        // Wrestling
        "wrestling": "fa-user-ninja",
        
        // Swimming
        "swimming": "fa-swimmer",
        "men's swimming": "fa-swimmer",
        "women's swimming": "fa-swimmer",
        "boys swimming": "fa-swimmer",
        "girls swimming": "fa-swimmer",
        
        // Hockey
        "hockey": "fa-hockey-puck",
        "ice hockey": "fa-hockey-puck",
        "field hockey": "fa-hockey-stick",
        
        // Golf
        "golf": "fa-golf-ball",
        "men's golf": "fa-golf-ball",
        "women's golf": "fa-golf-ball",
        
        // Tennis
        "tennis": "fa-tennis-ball",
        "men's tennis": "fa-tennis-ball",
        "women's tennis": "fa-tennis-ball",
        
        // Cross Country
        "cross country": "fa-running",
        "men's cross country": "fa-running",
        "women's cross country": "fa-running",
        
        // Lacrosse
        "lacrosse": "fa-hockey-stick",
        "men's lacrosse": "fa-hockey-stick",
        "women's lacrosse": "fa-hockey-stick",
        
        // Cheerleading
        "cheer": "fa-bullhorn",
        "cheerleading": "fa-bullhorn",
        
        // Bowling
        "bowling": "fa-bowling-ball",
        
        // Chess
        "chess": "fa-chess",
        
        // Fishing
        "fishing": "fa-fish",
        
        // Skiing
        "skiing": "fa-skiing",
        "ski": "fa-skiing",
        
        // Archery
        "archery": "fa-bullseye",
        
        // Esports
        "esports": "fa-gamepad",
        "gaming": "fa-gamepad"
    };

    // Simplified Sport Keywords for SVG Fallback Logic
    const sportKeywords = {
        basketball: 'basketball',
        football: 'football',
        baseball: 'baseball',
        softball: 'baseball', // Use baseball icon for softball
        soccer: 'soccer',
        volleyball: 'volleyball',
        track: 'track', // Includes track & field, cross country
        wrestling: 'wrestling',
        swimming: 'swimming',
        hockey: 'hockey', // Includes ice & field
        golf: 'golf',
        tennis: 'tennis',
        lacrosse: 'lacrosse',
        cheer: 'cheer',
        bowling: 'bowling'
        // Add others if specific SVG elements are created
    };

    // Simple SVG paths/elements for sport overlays (using secondary color)
    const sportSvgElements = {
        basketball: '<circle cx="75" cy="75" r="10" fill="var(--secondary-color, #EFBF04)"/>',
        football: '<ellipse cx="75" cy="75" rx="12" ry="8" fill="var(--secondary-color, #EFBF04)"/>',
        baseball: '<circle cx="75" cy="75" r="8" fill="var(--secondary-color, #EFBF04)"><path d="M70,72 L75,77 M80,72 L75,77" stroke="#FFF" stroke-width="1"/></circle>',
        soccer: '<circle cx="75" cy="75" r="10" fill="none" stroke="var(--secondary-color, #EFBF04)" stroke-width="2"/><path d="M75,65 L75,85 M65,75 L85,75 M68,68 L82,82 M68,82 L82,68" stroke="var(--secondary-color, #EFBF04)" stroke-width="1"/>',
        volleyball: '<circle cx="75" cy="75" r="10" fill="var(--secondary-color, #EFBF04)"><path d="M70,70 Q75,65 80,70 M70,80 Q75,85 80,80" fill="none" stroke="#FFF" stroke-width="1"/></circle>',
        track: '<path d="M65,70 L75,80 L85,70" stroke="var(--secondary-color, #EFBF04)" stroke-width="2" fill="none"/>', // Simple arrow/chevron
        wrestling: '<path d="M65,70 Q75,65 85,70 M65,80 Q75,85 85,80" stroke="var(--secondary-color, #EFBF04)" stroke-width="2" fill="none"/>', // Simple curves
        swimming: '<path d="M65,72 Q75,70 85,72 M65,78 Q75,80 85,78" stroke="var(--secondary-color, #EFBF04)" stroke-width="2" fill="none"/>', // Simple waves
        hockey: '<path d="M65,70 L85,70 L75,85 Z" fill="var(--secondary-color, #EFBF04)"/>', // Simple stick shape
        golf: '<circle cx="75" cy="75" r="5" fill="var(--secondary-color, #EFBF04)"/>',
        tennis: '<circle cx="75" cy="75" r="8" fill="var(--secondary-color, #EFBF04)"/><line x1="70" y1="70" x2="80" y2="80" stroke="#FFF" stroke-width="1"/><line x1="70" y1="80" x2="80" y2="70" stroke="#FFF" stroke-width="1"/>',
        lacrosse: '<path d="M65,70 L85,70 L75,85 Z" fill="var(--secondary-color, #EFBF04)"/>', // Reuse hockey stick
        cheer: '<path d="M65,70 L70,85 L75,70 L80,85 L85,70" stroke="var(--secondary-color, #EFBF04)" stroke-width="2" fill="none"/>', // Pom-pom like
        bowling: '<circle cx="75" cy="75" r="10" fill="var(--secondary-color, #EFBF04)"><circle cx="72" cy="72" r="2" fill="#FFF"/><circle cx="78" cy="72" r="2" fill="#FFF"/><circle cx="75" cy="78" r="2" fill="#FFF"/></circle>'
    };

    // Refined SVG Fallback Images
    const svgFallbacks = {
        school: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <rect x="10" y="50" width="80" height="40" fill="var(--primary-color, #00205B)"/>
            <polygon points="50,10 10,50 90,50" fill="var(--primary-color, #00205B)"/>
            <rect x="40" y="70" width="20" height="20" fill="var(--secondary-color, #EFBF04)"/>
            <rect x="25" y="60" width="10" height="10" fill="#FFFFFF"/>
            <rect x="65" y="60" width="10" height="10" fill="#FFFFFF"/>
        </svg>`,
        
        // Male Silhouette (More defined shoulders/stance)
        player_male: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
  <defs>
    <!-- A skin-tone gradient for the head -->
    <linearGradient id="skinGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5cfa0"/>
      <stop offset="100%" stop-color="#e0a96d"/>
    </linearGradient>
    <!-- A gradient for the shirt using the primary theme color -->
    <linearGradient id="shirtGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--primary-color, #00205B)"/>
      <stop offset="100%" stop-color="#000033"/>
    </linearGradient>
    <!-- A gradient for the pants -->
    <linearGradient id="pantsGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#555"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <!-- A soft blur filter for subtle shadowing -->
    <filter id="softBlur" x="0" y="0" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
    </filter>
  </defs>
  <g filter="url(#softBlur)">
    <!-- Head with a refined circle and subtle detail for hair -->
    <circle cx="50" cy="20" r="10" fill="url(#skinGradient)"/>
    <path d="M40,18 Q50,10 60,18" fill="none" stroke="#333" stroke-width="0.8"/>
    <!-- Torso rendered with smooth curves and gradient shading -->
    <path d="M40,30 C40,40 60,40 60,30 L60,50 C60,60 40,60 40,50 Z" fill="url(#shirtGradient)"/>
    <!-- Arms with a gentle curve to indicate muscle tone -->
    <path d="M40,35 C30,40 30,50 40,55" fill="url(#skinGradient)"/>
    <path d="M60,35 C70,40 70,50 60,55" fill="url(#skinGradient)"/>
    <!-- Legs with defined shapes and darker gradient for contrast -->
    <path d="M45,50 L45,70 L50,70 L50,50 Z" fill="url(#pantsGradient)"/>
    <path d="M50,50 L50,70 L55,70 L55,50 Z" fill="url(#pantsGradient)"/>
    <!-- Placeholder for accessory overlay (to be replaced with a FontAwesome icon or its fallback) -->
    %SPORT_ICON%
  </g>
</svg>`,
        
        // Female Silhouette (Slightly different torso/stance)
        player_female: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
  <defs>
    <!-- A skin-tone gradient for the head -->
    <linearGradient id="skinGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5cfa0"/>
      <stop offset="100%" stop-color="#e0a96d"/>
    </linearGradient>
    <!-- A gradient for the shirt using the primary theme color -->
    <linearGradient id="shirtGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--primary-color, #00205B)"/>
      <stop offset="100%" stop-color="#000033"/>
    </linearGradient>
    <!-- A gradient for the pants -->
    <linearGradient id="pantsGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#555"/>
      <stop offset="100%" stop-color="#222"/>
    </linearGradient>
    <!-- A soft blur filter for subtle shadowing -->
    <filter id="softBlur" x="0" y="0" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
    </filter>
  </defs>
  <g filter="url(#softBlur)">
    <!-- Head with a refined circle and subtle detail for hair -->
    <circle cx="50" cy="20" r="10" fill="url(#skinGradient)"/>
    <path d="M40,18 Q50,10 60,18" fill="none" stroke="#333" stroke-width="0.8"/>
    <!-- Torso rendered with smooth curves and gradient shading -->
    <path d="M40,30 C40,40 60,40 60,30 L60,50 C60,60 40,60 40,50 Z" fill="url(#shirtGradient)"/>
    <!-- Arms with a gentle curve to indicate muscle tone -->
    <path d="M40,35 C30,40 30,50 40,55" fill="url(#skinGradient)"/>
    <path d="M60,35 C70,40 70,50 60,55" fill="url(#skinGradient)"/>
    <!-- Legs with defined shapes and darker gradient for contrast -->
    <path d="M45,50 L45,70 L50,70 L50,50 Z" fill="url(#pantsGradient)"/>
    <path d="M50,50 L50,70 L55,70 L55,50 Z" fill="url(#pantsGradient)"/>
    <!-- Placeholder for accessory overlay (to be replaced with a FontAwesome icon or its fallback) -->
    %SPORT_ICON%
  </g>
</svg>`,
        
        athlete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" fill="var(--primary-color, #00205B)">
            <circle cx="50" cy="25" r="15"/>
            <path d="M50,40 L50,80 M30,55 L70,55" stroke="var(--primary-color, #00205B)" stroke-width="8" fill="none"/>
            <path d="M25,95 L40,55 M75,95 L60,55" stroke="var(--primary-color, #00205B)" stroke-width="5" fill="none"/>
            <circle cx="50" cy="15" r="5" fill="var(--secondary-color, #EFBF04)"/>
        </svg>`,
        
        team: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" fill="var(--primary-color, #00205B)">
            <circle cx="30" cy="25" r="10"/>
            <circle cx="50" cy="20" r="10"/>
            <circle cx="70" cy="25" r="10"/>
            <path d="M30,35 L30,70 M20,45 L40,45" stroke="var(--primary-color, #00205B)" stroke-width="5" fill="none"/>
            <path d="M50,30 L50,70 M40,45 L60,45" stroke="var(--primary-color, #00205B)" stroke-width="5" fill="none"/>
            <path d="M70,35 L70,70 M60,45 L80,45" stroke="var(--primary-color, #00205B)" stroke-width="5" fill="none"/>
            <rect x="15" y="70" width="70" height="10" fill="var(--secondary-color, #EFBF04)"/>
        </svg>`,
        
        trophy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" fill="var(--secondary-color, #EFBF04)">
            <path d="M35,20 L65,20 L65,40 C65,50 70,55 75,55 L75,60 C65,60 65,70 65,70 L35,70 C35,70 35,60 25,60 L25,55 C30,55 35,50 35,40 Z" />
            <rect x="40" y="70" width="20" height="10"/>
            <rect x="30" y="80" width="40" height="5"/>
            <rect x="35" y="10" width="30" height="10" fill="var(--primary-color, #00205B)"/>
        </svg>`
    };

    // Initialize the application
    async function init() {
        console.log('Initializing app...');
        
        // Set up state
        state = {
            schools: [],
            teams: [],
            individuals: [],
            currentView: 'schools',
            navigationHistory: [],
            selectedSchool: null,
            selectedCategory: null,
            selectedSport: null,
            selectedYear: null,
            selectedTeam: null,
            selectedPlayer: null,
            selectedAthlete: null,
            currentImageIndex: 0,
            searchQuery: '',
            searchResults: {
                players: [],
                teams: []
            }
        };
        
        // Load default theme values
        defaultTheme = {
            primary: '#00205B',
            secondary: '#EFBF04',
            accent: '#000000',
            backgroundGradient: 'linear-gradient(135deg, #00205B11 0%, #E0E0E0 100%)'
        };
        
        try {
            showLoading(true);
            
            // Fetch data from API
            await fetchSchools();
            console.log('Schools fetched:', state.schools.length);
            
            await fetchTeams();
            console.log('Teams fetched:', state.teams.length);
            
            await fetchIndividuals();
            console.log('Individuals fetched:', state.individuals.length);
            
            // Clean up data - fix placeholder URLs to avoid 404 errors
            cleanupData();
            
            // Render initial view
            renderView('schools');
            
            // Set up event listeners
            setupEventListeners();
            setupImageFallbacks();
            
            showLoading(false);
        } catch (error) {
            console.error('Error during initialization:', error);
            contentContainer.innerHTML = `
                <div class="error-container">
                    <h2>Unable to Load Data</h2>
                    <p>There was a problem loading the trophy case data. Please try again later.</p>
                    <p>Error: ${error.message}</p>
                    <button class="btn" onclick="location.reload()">Retry</button>
                </div>
            `;
            showLoading(false);
        }
    }

    // Function to clean up data and fix placeholder URLs
    function cleanupData() {
        // Fix any placeholder_url values in schools
        state.schools.forEach(school => {
            if (school.media_url === 'placeholder_url' || !school.media_url) {
                school.media_url = ''; // Empty string will trigger fallback SVG
            }
        });
        
        // Fix any placeholder_url values in teams
        state.teams.forEach(team => {
            if (team.team_photo_url === 'placeholder_url' || !team.team_photo_url) {
                team.team_photo_url = ''; // Empty string will trigger fallback SVG
            }
            if (team.trophy_model_url === 'placeholder_url' || !team.trophy_model_url) {
                team.trophy_model_url = ''; // Empty string will trigger fallback
            }
        });
        
        // Fix any placeholder_url values in individuals
        state.individuals.forEach(individual => {
            if (individual.media_url === 'placeholder_url' || !individual.media_url) {
                individual.media_url = ''; // Empty string will trigger fallback SVG
            }
        });
    }

    // Data Fetching Functions
    async function fetchSchools() {
        try {
            // Get the API URL from environment or use default
            const apiBaseUrl = window.API_ENDPOINT || '';
            
            // Try both endpoints to see which works
            try {
                const response = await fetch(`${apiBaseUrl}/api/axios?type=schools`);
                if (!response.ok) throw new Error(`Axios endpoint responded with ${response.status}`);
                
                const data = await response.json();
                console.log('Axios schools response:', data);
                
                // Accept data in various formats
                if (data && data.data) {
                    state.schools = data.data;
                    return { data: data.data };
                } else if (Array.isArray(data)) {
                    state.schools = data;
                    return { data };
                }
                throw new Error('No valid data in axios response');
            } catch (axiosError) {
                console.error('Axios attempt failed:', axiosError);
                
                // Fallback to original endpoint
                const response = await fetch(`${apiBaseUrl}/api/schools`);
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                const data = await response.json();
                
                // Handle multiple response formats 
                if (data && data.data) {
                    state.schools = data.data;
                } else if (Array.isArray(data)) {
                    state.schools = data;
                } else {
                    state.schools = [];
                }
                
                return { data: state.schools };
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
            // Provide default empty array to avoid errors
            state.schools = [];
            return { data: [] };
        }
    }

    async function fetchTeams() {
        try {
            // Get the API URL from environment or use default
            const apiBaseUrl = window.API_ENDPOINT || '';
            
            // Try both endpoints to see which works
            try {
                const response = await fetch(`${apiBaseUrl}/api/axios?type=teams`);
                if (!response.ok) throw new Error(`Axios endpoint responded with ${response.status}`);
                
                const data = await response.json();
                console.log('Axios teams response:', data);
                
                // Accept data in various formats
                if (data && data.data) {
                    state.teams = data.data;
                    return { data: data.data };
                } else if (Array.isArray(data)) {
                    state.teams = data;
                    return { data };
                }
                throw new Error('No valid data in axios response');
            } catch (axiosError) {
                console.error('Axios attempt failed:', axiosError);
                
                // Fallback to original endpoint
                const response = await fetch(`${apiBaseUrl}/api/teams`);
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                const data = await response.json();
                
                // Handle multiple response formats
                if (data && data.data) {
                    state.teams = data.data;
                } else if (Array.isArray(data)) {
                    state.teams = data;
                } else {
                    state.teams = [];
                }
                
                return { data: state.teams };
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            // Provide default empty array to avoid errors
            state.teams = [];
            return { data: [] };
        }
    }

    async function fetchIndividuals() {
        try {
            // Get the API URL from environment or use default
            const apiBaseUrl = window.API_ENDPOINT || '';
            
            // Try both endpoints to see which works
            try {
                const response = await fetch(`${apiBaseUrl}/api/axios?type=individuals`);
                if (!response.ok) throw new Error(`Axios endpoint responded with ${response.status}`);
                
                const data = await response.json();
                console.log('Axios individuals response:', data);
                
                // Accept data in various formats
                if (data && data.data) {
                    state.individuals = data.data;
                    return { data: data.data };
                } else if (Array.isArray(data)) {
                    state.individuals = data;
                    return { data };
                }
                throw new Error('No valid data in axios response');
            } catch (axiosError) {
                console.error('Axios attempt failed:', axiosError);
                
                // Fallback to original endpoint
                const response = await fetch(`${apiBaseUrl}/api/individuals`);
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                const data = await response.json();
                
                // Handle multiple response formats
                if (data && data.data) {
                    state.individuals = data.data;
                } else if (Array.isArray(data)) {
                    state.individuals = data;
                } else {
                    state.individuals = [];
                }
                
                return { data: state.individuals };
            }
        } catch (error) {
            console.error('Error fetching individuals:', error);
            // Provide default empty array to avoid errors
            state.individuals = [];
            return { data: [] };
        }
    }

    // Navigation Functions
    function navigateToView(viewName, updateHistory = true) {
        if (updateHistory) {
            state.navigationHistory.push({
                view: state.currentView,
                state: { ...state }
            });
        }
        
        state.currentView = viewName;
        renderView(viewName);
    }

    function navigateBack() {
        if (state.navigationHistory.length > 0) {
            const previousState = state.navigationHistory.pop();
            Object.assign(state, previousState.state);
            state.currentView = previousState.view;
            renderView(state.currentView);
        }
    }

    function navigateHome() {
        state.navigationHistory = [];
        state.selectedSchool = null;
        state.selectedCategory = null;
        state.selectedSport = null;
        state.selectedYear = null;
        state.selectedTeam = null;
        state.selectedPlayer = null;
        state.selectedAthlete = null;
        state.currentView = 'schools';
        renderView('schools');
        resetThemeColors(); // Reset theme on navigating home
    }

    // Helper for updating theme based on school colors
    function updateThemeColors(school) {
        const root = document.documentElement;
        if (school && school.primary_color && school.secondary_color) {
            root.style.setProperty('--primary-color', school.primary_color);
            root.style.setProperty('--secondary-color', school.secondary_color);
            document.body.style.background = `linear-gradient(135deg, ${school.primary_color}22 0%, #E0E0E0 100%)`;
        } else {
            // If no school or colors missing, reset to defaults
            resetThemeColors();
        }
        
        // Force update on specific elements that might not inherit CSS vars correctly
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = school ? school.primary_color : defaultTheme.primary;
        }
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.style.borderColor = school ? school.secondary_color : defaultTheme.secondary;
        });
    }

    // Function to reset theme to defaults
    function resetThemeColors() {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', defaultTheme.primary);
        root.style.setProperty('--secondary-color', defaultTheme.secondary);
        document.body.style.background = defaultTheme.backgroundGradient;
        
        // Reset specific elements
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = defaultTheme.primary;
        }
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.style.borderColor = defaultTheme.secondary;
        });
        // Reset any dynamic title colors if needed
        const viewTitle = document.querySelector('.view-title');
        if (viewTitle) {
            viewTitle.style.color = defaultTheme.primary;
            viewTitle.style.borderBottomColor = defaultTheme.secondary;
        }
    }

    // View Rendering Functions
    function renderView(viewName) {
        // Clear the content container
        contentContainer.innerHTML = '';
        
        // Reset theme only if navigating back to schools view
        if (viewName === 'schools') {
            resetThemeColors();
        }
        
        // Render the appropriate view
        switch (viewName) {
            case 'schools':
                renderSchoolsView();
                // Resetting theme is handled above
                break;
            case 'categories':
                renderCategoriesView();
                updateThemeColors(state.selectedSchool);
                break;
            case 'sports':
                renderSportsView();
                updateThemeColors(state.selectedSchool);
                break;
            case 'years':
                renderYearsView();
                updateThemeColors(state.selectedSchool);
                break;
            case 'team-detail':
                renderTeamDetailView();
                updateThemeColors(state.selectedSchool);
                break;
            case 'player-detail':
                renderPlayerDetailView();
                updateThemeColors(state.selectedSchool);
                break;
            case 'd1-athletes':
                renderD1AthletesView();
                updateThemeColors(state.selectedSchool);
                break;
            case 'pro-athletes':
                renderProAthletesView();
                updateThemeColors(state.selectedSchool);
                break;
            case 'athlete-detail':
                renderAthleteDetailView();
                updateThemeColors(state.selectedSchool);
                break;
            case 'all-players':
                renderAllPlayersView();
                resetThemeColors(); // Use default colors for all players view
                break;
            case 'search-results':
                renderSearchResultsView();
                resetThemeColors(); // Use default colors for search results
                break;
            default:
                console.error('Unknown view:', viewName);
                renderSchoolsView(); // Fallback to schools view
                resetThemeColors();
        }

        // Update back button visibility
        backButton.style.display = state.navigationHistory.length > 0 ? 'flex' : 'none';
        
        // Set up image fallbacks for all images in the current view
        setTimeout(setupImageFallbacks, 100); // Small delay to ensure all images are in the DOM
    }

    // Helper to find sport icon based on sport name
    function getSportIcon(sportName) {
        if (!sportName) return 'fa-trophy';
        
        const lowercaseSport = sportName.toLowerCase().trim();
        
        // Check direct match first
        if (sportIcons[lowercaseSport]) {
            return sportIcons[lowercaseSport];
        }
        
        // If no direct match, search for partial matches (more specific first)
        const keywords = [
            'basketball', 'football', 'baseball', 'softball', 'soccer', 'volleyball',
            'track & field', 'track and field', 'track', 'wrestling', 'swimming',
            'ice hockey', 'field hockey', 'hockey', 'golf', 'tennis', 'cross country', 
            'lacrosse', 'cheerleading', 'cheer', 'bowling', 'chess', 'fishing', 
            'skiing', 'ski', 'archery', 'esports', 'gaming'
        ];
        
        for (const key of keywords) {
            if (lowercaseSport.includes(key) && sportIcons[key]) {
                return sportIcons[key];
            }
        }
        
        // Default to trophy if no specific match found
        return 'fa-trophy';
    }

    // Updated Helper to get appropriate SVG fallback based on context
    function getSvgFallback(type = 'player', gender = null, sportName = null) {
        let baseSvgTemplate = '';
        let sportIconElement = '';
        
        switch(type) {
            case 'school':
                baseSvgTemplate = svgFallbacks.school;
                break;
            case 'team':
                baseSvgTemplate = svgFallbacks.team;
                break;
            case 'trophy':
                baseSvgTemplate = svgFallbacks.trophy;
                break;
            case 'athlete':
                baseSvgTemplate = svgFallbacks.athlete; // Use generic athlete for now
                break;
            case 'player':
            default:
                // Basic gender selection
                baseSvgTemplate = (gender && gender.toLowerCase().startsWith('f')) ? svgFallbacks.player_female : svgFallbacks.player_male;
                
                // Determine sport keyword
                if (sportName) {
                    const lowerSport = sportName.toLowerCase();
                    for (const [keyword, sportKey] of Object.entries(sportKeywords)) {
                        if (lowerSport.includes(keyword)) {
                            sportIconElement = sportSvgElements[sportKey] || '';
                            break; // Use first match
                        }
                    }
                }
                break;
        }
        
        // Replace placeholder with sport icon element (if any)
        let baseSvg = baseSvgTemplate.replace('%SPORT_ICON%', sportIconElement);
        
        // Inject current theme colors into SVG
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || defaultTheme.primary;
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim() || defaultTheme.secondary;
        
        let finalSvg = baseSvg.replace(/var(--primary-color, #00205B)/g, primaryColor);
        finalSvg = finalSvg.replace(/var(--secondary-color, #EFBF04)/g, secondaryColor);
        
        return finalSvg;
    }

    // Schools View
    function renderSchoolsView() {
        const template = document.getElementById('schools-view-template');
        const clone = template.content.cloneNode(true);
        const schoolsGrid = clone.querySelector('#schools-grid');

        // Add "Browse Players" card first
        const browsePlayersCard = createBrowsePlayersCard();
        schoolsGrid.appendChild(browsePlayersCard);

        // Then add school cards
        state.schools.forEach(school => {
            const schoolCard = createSchoolCard(school);
            schoolsGrid.appendChild(schoolCard);
        });

        contentContainer.appendChild(clone);
    }

    // Create Browse Players Card
    function createBrowsePlayersCard() {
        const cardElement = document.createElement('div');
        cardElement.className = 'card school-card browse-players-card';
        
        const cardMedia = document.createElement('div');
        cardMedia.className = 'card-media';
        cardMedia.style.backgroundColor = defaultTheme.primary;
        
        // Create icon element
        const icon = document.createElement('i');
        icon.className = 'fas fa-users';
        icon.style.color = defaultTheme.secondary;
        cardMedia.appendChild(icon);
        
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        const cardTitle = document.createElement('h3');
        cardTitle.className = 'card-title';
        cardTitle.textContent = 'Browse Players';
        cardContent.appendChild(cardTitle);
        
        cardElement.appendChild(cardMedia);
        cardElement.appendChild(cardContent);
        
        // Add click event
        cardElement.addEventListener('click', () => {
            navigateToView('all-players');
        });
        
        return cardElement;
    }

    function createSchoolCard(school) {
        const template = document.getElementById('school-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.school-card');
        const cardMedia = clone.querySelector('.card-media');
        const cardImage = clone.querySelector('.card-image');
        const cardTitle = clone.querySelector('.card-title');
        
        // Set school card styles based on school colors (using defaults if needed)
        const primaryColor = school.primary_color || defaultTheme.primary;
        const secondaryColor = school.secondary_color || defaultTheme.secondary;
        
        cardElement.style.borderColor = primaryColor;
        cardMedia.style.backgroundColor = primaryColor; // Keep background for fallback case
        
        // Set image or fallback
        if (school.media_url) {
            cardImage.src = school.media_url;
            // Clear any potential SVG if image loads
            const existingSvg = cardMedia.querySelector('svg');
            if(existingSvg) existingSvg.remove();
            cardImage.style.display = 'block';
        } else {
            cardMedia.innerHTML = getSvgFallback('school');
            cardImage.style.display = 'none';
        }
        
        cardImage.alt = school.name;
        cardTitle.textContent = school.name;
        
        // Add click event
        cardElement.addEventListener('click', () => {
            state.selectedSchool = school;
            navigateToView('categories');
            updateThemeColors(school); // Update theme when school is selected
        });
        
        return clone;
    }

    // Categories View
    function renderCategoriesView() {
        const template = document.getElementById('categories-view-template');
        const clone = template.content.cloneNode(true);
        const title = clone.querySelector('.view-title');
        
        title.textContent = `${state.selectedSchool.name} - Select a Category`;
        // Theme colors are applied by renderView -> updateThemeColors
        
        // Apply school colors to cards dynamically
        const categoryCards = clone.querySelectorAll('.category-card');
        const primaryColor = state.selectedSchool.primary_color || defaultTheme.primary;
        const secondaryColor = state.selectedSchool.secondary_color || defaultTheme.secondary;
        
        categoryCards.forEach(card => {
            const cardMedia = card.querySelector('.card-media');
            // Use CSS variables for gradient if possible, or fallback to direct style
            cardMedia.style.background = `linear-gradient(135deg, ${primaryColor} 0%, #000000 100%)`; 
            card.querySelector('i').style.color = secondaryColor;
            
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                state.selectedCategory = category;
                
                if (category === 'sports') {
                    navigateToView('sports');
                } else if (category === 'd1-athletes') {
                    navigateToView('d1-athletes');
                } else if (category === 'pro-athletes') {
                    navigateToView('pro-athletes');
                }
            });
        });
        
        contentContainer.appendChild(clone);
    }

    // Sports View
    function renderSportsView() {
        const template = document.getElementById('sports-view-template');
        const clone = template.content.cloneNode(true);
        const title = clone.querySelector('.view-title');
        const sportsGrid = clone.querySelector('#sports-grid');
        
        title.textContent = `${state.selectedSchool.name} - Sports`;
        // Theme colors are applied by renderView -> updateThemeColors
        
        // Get unique sports for the selected school
        const sports = [...new Set(
            state.teams
                .filter(team => team.school_name === state.selectedSchool.name)
                .map(team => team.sport_name)
        )];
        
        if (sports.length === 0) {
            sportsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No sports teams found for this school.</p>';
        } else {
            sports.forEach(sport => {
                const sportCard = createSportCard(sport);
                sportsGrid.appendChild(sportCard);
            });
        }
        
        contentContainer.appendChild(clone);
    }

    function createSportCard(sport) {
        const template = document.getElementById('sport-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.sport-card');
        const cardMedia = clone.querySelector('.card-media');
        const iconElement = clone.querySelector('.card-media i');
        const titleElement = clone.querySelector('.card-title');
        
        // Set icon and title
        const sportIconClass = getSportIcon(sport);
        iconElement.className = 'fas'; // Reset classes first
        iconElement.classList.add(sportIconClass);
        titleElement.textContent = sport;
        
        // Apply school colors using CSS variables where possible
        cardMedia.style.backgroundColor = 'var(--primary-color)';
        iconElement.style.color = 'var(--secondary-color)';
        
        // Add click event
        cardElement.addEventListener('click', () => {
            state.selectedSport = sport;
            navigateToView('years');
        });
        
        return clone;
    }

    // Years View
    function renderYearsView() {
        const template = document.getElementById('years-view-template');
        const clone = template.content.cloneNode(true);
        const title = clone.querySelector('.view-title');
        const yearsGrid = clone.querySelector('#years-grid');
        
        title.textContent = `${state.selectedSchool.name} - ${state.selectedSport} Championships`;
        // Theme colors applied by updateThemeColors
        
        // Get teams for the selected school and sport
        const teams = state.teams.filter(team => 
            team.school_name === state.selectedSchool.name && 
            team.sport_name === state.selectedSport
        ).sort((a, b) => b.year - a.year); // Sort by year descending
        
        if (teams.length === 0) {
            yearsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No championship years found for this sport.</p>';
        } else {
            teams.forEach(team => {
                const yearCard = createYearCard(team);
                yearsGrid.appendChild(yearCard);
            });
        }
        
        contentContainer.appendChild(clone);
    }

    function createYearCard(team) {
        const template = document.getElementById('year-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.year-card');
        const titleElement = clone.querySelector('.card-title');
        const subtitleElement = clone.querySelector('.card-subtitle');
        
        titleElement.textContent = team.year;
        subtitleElement.textContent = team.achievement || 'Championship';
        
        // Apply school colors using CSS variables
        cardElement.style.background = `linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)`;
        titleElement.style.color = 'var(--secondary-color)';
        
        // Add click event
        cardElement.addEventListener('click', () => {
            state.selectedYear = team.year;
            state.selectedTeam = team;
            navigateToView('team-detail');
        });
        
        return clone;
    }

    // Team Detail View
    function renderTeamDetailView() {
        const template = document.getElementById('team-detail-template');
        const clone = template.content.cloneNode(true);
        
        // Apply school colors (relying on CSS variables set by updateThemeColors)
        const teamTitle = clone.querySelector('.team-title');
        teamTitle.textContent = `${state.selectedSchool.name} ${state.selectedSport} (${state.selectedYear})`;
        // teamTitle color set by .view-title style or specific CSS if needed
        
        const teamAchievement = clone.querySelector('.team-achievement');
        teamAchievement.textContent = state.selectedTeam.achievement || 'Championship';
        teamAchievement.style.backgroundColor = 'var(--primary-color)';
        teamAchievement.style.color = 'var(--secondary-color)';
        
        // Set team photo
        const teamPhoto = clone.querySelector('.team-photo');
        const teamMediaContainer = clone.querySelector('.team-media');
        
        // Clear previous content (image and SVG)
        teamMediaContainer.innerHTML = ''; 
        teamMediaContainer.appendChild(teamPhoto); // Re-add img tag
        
        if (state.selectedTeam.team_photo_url) {
            teamPhoto.src = state.selectedTeam.team_photo_url;
            teamPhoto.alt = `${state.selectedSchool.name} ${state.selectedSport} Team ${state.selectedYear}`;
            teamPhoto.style.display = 'block';
        } else {
            teamMediaContainer.innerHTML = getSvgFallback('team'); 
            teamPhoto.style.display = 'none';
        }
        
        // Handle trophy model
        const trophyContainer = clone.querySelector('.trophy-container');
        trophyContainer.innerHTML = ''; // Clear previous content
        
        if (state.selectedTeam.trophy_model_url) {
            // Use the trophy model template
            const modelTemplate = document.getElementById('trophy-model-template');
            const modelClone = modelTemplate.content.cloneNode(true);
            const modelViewer = modelClone.querySelector('model-viewer');
            modelViewer.src = state.selectedTeam.trophy_model_url;
            trophyContainer.appendChild(modelClone);

            // Add expand button functionality
            const expandBtn = trophyContainer.querySelector('.expand-trophy-btn');
            expandBtn.addEventListener('click', () => {
                const trophyModal = document.getElementById('trophy-fullscreen-modal');
                const modalViewer = document.getElementById('modal-trophy-viewer');
                modalViewer.src = state.selectedTeam.trophy_model_url;
                modalViewer.setAttribute('auto-rotate', ''); // Start rotation
                trophyModal.style.display = 'flex';
            });
        } else {
            // Use the trophy placeholder template
            const placeholderTemplate = document.getElementById('trophy-placeholder-template');
            const placeholderClone = placeholderTemplate.content.cloneNode(true);
            const placeholderDiv = placeholderClone.querySelector('.trophy-placeholder');
            placeholderDiv.insertAdjacentHTML('afterbegin', getSvgFallback('trophy')); // Add SVG
            trophyContainer.appendChild(placeholderClone);
        }
        
        // Get players for this team
        const players = state.individuals.filter(individual => 
            individual.school_name === state.selectedSchool.name && 
            individual.team_sport === state.selectedSport && 
            individual.team_year === state.selectedYear &&
            individual.type === 'player'
        );
        
        // Render player cards
        const rosterGrid = clone.querySelector('#roster-grid');
        if (players.length === 0) {
             rosterGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No players found for this team.</p>';
        } else {
            players.forEach(player => {
                const playerCard = createPlayerCard(player);
                rosterGrid.appendChild(playerCard);
            });
        }
        
        contentContainer.appendChild(clone);
    }

    // Updated Player Detail View for Unified Player Display
    function renderPlayerDetailView() {
        const template = document.getElementById('player-detail-template');
        const clone = template.content.cloneNode(true);
        
        const player = state.selectedPlayer;
        const playerInstances = player.instances;
        
        if (!playerInstances || playerInstances.length === 0) {
            contentContainer.innerHTML = '<div class="error-container"><p>Player data not available</p></div>';
            return;
        }
        
        // Sort instances to prioritize the current context if available
        let sortedInstances = [...playerInstances];
        
        // If we came from a team, prioritize that team's player instance
        if (player.fromTeam) {
            sortedInstances.sort((a, b) => {
                const aMatch = (a.school_name === player.fromTeam.school.name && 
                               a.team_sport === player.fromTeam.sport && 
                               a.team_year === player.fromTeam.year);
                               
                const bMatch = (b.school_name === player.fromTeam.school.name && 
                               b.team_sport === player.fromTeam.sport && 
                               b.team_year === player.fromTeam.year);
                               
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return 0;
            });
        }
        
        // Reset current image index
        state.currentImageIndex = 0;
        
        // Apply theme colors
        const playerNameTitle = clone.querySelector('.player-name');
        playerNameTitle.style.color = 'var(--primary-color)';
        playerNameTitle.textContent = player.name || 'Unknown Player';
        
        // Set up media carousel
        setupPlayerMediaCarousel(clone, sortedInstances);
        
        // Set up player details section
        const playerDetails = clone.querySelector('.player-details');
        renderPlayerDetails(playerDetails, sortedInstances);
        
        // Set up teams section
        const teamsContainer = clone.querySelector('.teams-container');
        renderPlayerTeams(teamsContainer, sortedInstances);
        
        // Set up stats sections
        const statsContainer = clone.querySelector('.player-stats-sections');
        renderPlayerStats(statsContainer, sortedInstances);
        
        contentContainer.appendChild(clone);
        
        // Set up event listeners for the carousel
        setupCarouselControls();
    }

    // Set up the player image carousel
    function setupPlayerMediaCarousel(container, playerInstances) {
        const mediaCarousel = container.querySelector('.player-media-carousel');
        const mediaContainer = mediaCarousel.querySelector('.player-media-container');
        const playerMedia = mediaContainer.querySelector('.player-media');
        const playerPhoto = playerMedia.querySelector('.player-photo');
        const mediaIndicator = mediaCarousel.querySelector('.media-indicator');
        
        // Clear existing content
        playerMedia.innerHTML = '';
        playerMedia.appendChild(playerPhoto);
        mediaIndicator.innerHTML = '';
        
        // Create media items for each player instance
        playerInstances.forEach((instance, index) => {
            // Create indicator dot
            const dot = document.createElement('div');
            dot.className = 'indicator-dot' + (index === 0 ? ' active' : '');
            mediaIndicator.appendChild(dot);
            
            // Only load the first image initially
            if (index === 0) {
                if (instance.media_url) {
                    playerPhoto.src = instance.media_url;
                    playerPhoto.alt = `${instance.name} - ${instance.team_sport || ''} ${instance.team_year || ''}`;
                    playerPhoto.style.display = 'block';
                } else {
                    const gender = instance.gender || (instance.name && (instance.name.toLowerCase().includes('women') || instance.name.toLowerCase().includes('girl')) ? 'female' : 'male');
                    playerMedia.innerHTML = getSvgFallback('player', gender, instance.team_sport);
                    playerPhoto.style.display = 'none';
                }
            }
        });
        
        // Hide navigation buttons if only one image
        const prevButton = mediaContainer.querySelector('.prev-btn');
        const nextButton = mediaContainer.querySelector('.next-btn');
        
        if (playerInstances.length <= 1) {
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
            mediaIndicator.style.display = 'none';
        }
    }

    // Set up carousel navigation controls
    function setupCarouselControls() {
        const prevButton = document.querySelector('.player-media-container .prev-btn');
        const nextButton = document.querySelector('.player-media-container .next-btn');
        const dots = document.querySelectorAll('.indicator-dot');
        
        if (!prevButton || !nextButton) return;
        
        prevButton.addEventListener('click', () => {
            navigatePlayerImages(-1);
        });
        
        nextButton.addEventListener('click', () => {
            navigatePlayerImages(1);
        });
        
        // Add click events to indicator dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                state.currentImageIndex = index;
                updatePlayerImage();
            });
        });
    }

    // Navigate between player images
    function navigatePlayerImages(direction) {
        const playerInstances = state.selectedPlayer.instances;
        if (!playerInstances || playerInstances.length <= 1) return;
        
        state.currentImageIndex += direction;
        
        // Loop around if needed
        if (state.currentImageIndex < 0) {
            state.currentImageIndex = playerInstances.length - 1;
        } else if (state.currentImageIndex >= playerInstances.length) {
            state.currentImageIndex = 0;
        }
        
        updatePlayerImage();
    }

    // Update the displayed player image
    function updatePlayerImage() {
        const playerInstances = state.selectedPlayer.instances;
        if (!playerInstances) return;
        
        const instance = playerInstances[state.currentImageIndex];
        if (!instance) return;
        
        const playerMedia = document.querySelector('.player-media');
        const playerPhoto = document.querySelector('.player-photo');
        
        // Update image
        if (instance.media_url) {
            playerMedia.innerHTML = '';
            playerMedia.appendChild(playerPhoto);
            playerPhoto.src = instance.media_url;
            playerPhoto.alt = `${instance.name} - ${instance.team_sport || ''} ${instance.team_year || ''}`;
            playerPhoto.style.display = 'block';
        } else {
            playerMedia.innerHTML = getSvgFallback('player', instance.gender, instance.team_sport);
            if (playerPhoto) playerPhoto.style.display = 'none';
        }
        
        // Update indicator dots
        const dots = document.querySelectorAll('.indicator-dot');
        dots.forEach((dot, index) => {
            dot.className = 'indicator-dot' + (index === state.currentImageIndex ? ' active' : '');
        });
    }

    // Render player details (unified view)
    function renderPlayerDetails(container, playerInstances) {
        container.innerHTML = ''; // Clear existing content
        
        // Always show the first (priority) instance details first
        const primaryInstance = playerInstances[0];
        
        // Add number and position if available
        if (primaryInstance.number || primaryInstance.position) {
            const detailItem = document.createElement('div');
            detailItem.className = 'player-detail-item';
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-user';
            detailItem.appendChild(icon);
            
            let detailText = '';
            if (primaryInstance.number) detailText += `#${primaryInstance.number} `;
            if (primaryInstance.position) detailText += primaryInstance.position;
            
            const span = document.createElement('span');
            span.textContent = detailText.trim();
            detailItem.appendChild(span);
            
            container.appendChild(detailItem);
        }
        
        // Add primary team/sport info
        const teamItem = document.createElement('div');
        teamItem.className = 'player-detail-item';
        
        const teamIcon = document.createElement('i');
        teamIcon.className = 'fas fa-trophy';
        teamItem.appendChild(teamIcon);
        
        const teamSpan = document.createElement('span');
        teamSpan.textContent = `${primaryInstance.school_name || ''} ${primaryInstance.team_sport || ''} ${primaryInstance.team_year || ''}`.trim();
        teamItem.appendChild(teamSpan);
        
        container.appendChild(teamItem);
        
        // Check if player is D1 or Pro athlete
        const d1Athletes = state.individuals.filter(
            ind => ind.type === 'd1_athlete' && ind.name === state.selectedPlayer.name
        );
        
        const proAthletes = state.individuals.filter(
            ind => ind.type === 'pro_athlete' && ind.name === state.selectedPlayer.name
        );
        
        if (d1Athletes.length > 0) {
            const d1Item = document.createElement('div');
            d1Item.className = 'player-detail-item';
            
            const d1Icon = document.createElement('i');
            d1Icon.className = 'fas fa-graduation-cap';
            d1Item.appendChild(d1Icon);
            
            const d1Span = document.createElement('span');
            d1Span.textContent = d1Athletes[0].college || 'D1 Athlete';
            d1Item.appendChild(d1Span);
            
            const d1Badge = document.createElement('span');
            d1Badge.className = 'player-detail-badge';
            d1Badge.textContent = 'D1';
            d1Item.appendChild(d1Badge);
            
            container.appendChild(d1Item);
        }
        
        if (proAthletes.length > 0) {
            const proItem = document.createElement('div');
            proItem.className = 'player-detail-item';
            
            const proIcon = document.createElement('i');
            proIcon.className = 'fas fa-medal';
            proItem.appendChild(proIcon);
            
            const proSpan = document.createElement('span');
            proSpan.textContent = proAthletes[0].professional_team || 'Professional Athlete';
            proItem.appendChild(proSpan);
            
            const proBadge = document.createElement('span');
            proBadge.className = 'player-detail-badge';
            proBadge.textContent = 'PRO';
            proItem.appendChild(proBadge);
            
            container.appendChild(proItem);
        }
    }

    // Render player teams section
    function renderPlayerTeams(container, playerInstances) {
        container.innerHTML = ''; // Clear existing content
        
        if (playerInstances.length <= 1) {
            // If only one team, don't show the teams section
            const parent = container.closest('.player-teams');
            if (parent) parent.style.display = 'none';
            return;
        }
        
        // Create a badge for each unique team
        const teams = [];
        playerInstances.forEach(instance => {
            // Create a unique key for each team
            const teamKey = `${instance.school_name}-${instance.team_sport}-${instance.team_year}`;
            if (!teams.some(t => t.key === teamKey)) {
                teams.push({
                    key: teamKey,
                    school: instance.school_name,
                    sport: instance.team_sport,
                    year: instance.team_year,
                    instance
                });
            }
        });
        
        // Create team badges
        teams.forEach(team => {
            const badge = document.createElement('div');
            badge.className = 'team-badge';
            
            const icon = document.createElement('i');
            icon.className = 'fas ' + getSportIcon(team.sport);
            badge.appendChild(icon);
            
            const text = document.createElement('span');
            text.textContent = `${team.school} ${team.sport} (${team.year})`;
            badge.appendChild(text);
            
            // Add click event to navigate to team
            badge.addEventListener('click', () => {
                // Find the team in state.teams
                const matchingTeam = state.teams.find(t => 
                    t.school_name === team.school && 
                    t.sport_name === team.sport &&
                    t.year === team.year
                );
                
                if (matchingTeam) {
                    // Find the school
                    const school = state.schools.find(s => s.name === team.school);
                    
                    if (school) {
                        state.selectedSchool = school;
                        state.selectedSport = team.sport;
                        state.selectedYear = team.year;
                        state.selectedTeam = matchingTeam;
                        navigateToView('team-detail');
                    }
                }
            });
            
            container.appendChild(badge);
        });
    }

    // Render player statistics sections
    function renderPlayerStats(container, playerInstances) {
        container.innerHTML = ''; // Clear existing content
        
        let statsFound = false;
        
        // Create a section for each team's stats
        playerInstances.forEach(instance => {
            // Check if this instance has any stats
            const hasStats = hasPlayerStats(instance);
            
            if (hasStats) {
                statsFound = true;
                
                // Create section
                const section = document.createElement('div');
                section.className = 'stats-section';
                
                // Create header
                const header = document.createElement('div');
                header.className = 'stats-section-header';
                
                const headerIcon = document.createElement('i');
                headerIcon.className = 'fas ' + getSportIcon(instance.team_sport);
                header.appendChild(headerIcon);
                
                const headerText = document.createElement('span');
                headerText.textContent = `${instance.team_sport} (${instance.team_year}) Statistics`;
                header.appendChild(headerText);
                
                section.appendChild(header);
                
                // Create stats grid
                const statsGrid = document.createElement('div');
                statsGrid.className = 'stats-grid';
                
                // Add stats
                addPlayerStats(statsGrid, instance);
                
                section.appendChild(statsGrid);
                container.appendChild(section);
            }
        });
        
        if (!statsFound) {
            const noStats = document.createElement('p');
            noStats.textContent = 'No statistics available for this player.';
            noStats.style.textAlign = 'center';
            container.appendChild(noStats);
        }
    }

    // Check if player has any stats
    function hasPlayerStats(player) {
        const statFields = [
            'assists', 'rebounds', 'points_per_game', 'passing_yards', 
            'touchdowns', 'completion_percentage', 'goals', 'saves', 
            'batting_average', 'home_runs', 'era', 'wins', 'losses', 'tackles'
        ];
        
        return statFields.some(field => player[field] !== null && player[field] !== undefined && player[field] !== '') || 
               (player.other_stat_name && player.other_stat_value);
    }

    // D1 Athletes View
    function renderD1AthletesView() {
        renderAthletesListView('d1_athlete', 'D1 Athletes');
    }

    // Pro Athletes View
    function renderProAthletesView() {
        renderAthletesListView('pro_athlete', 'Professional Athletes');
    }

    // Common function for rendering athletes lists
    function renderAthletesListView(athleteType, title) {
        const template = document.getElementById('athletes-list-template');
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.view-title').textContent = 
            `${state.selectedSchool.name} - ${title}`;
        // Theme colors applied by updateThemeColors
        
        const athletesGrid = clone.querySelector('#athletes-grid');
        
        // Get athletes of specified type for the selected school
        const athletes = state.individuals.filter(individual => 
            individual.school_name === state.selectedSchool.name && 
            individual.type === athleteType
        ).sort((a, b) => (a.name || '').localeCompare(b.name || '')); // Sort by name
        
        if (athletes.length === 0) {
            athletesGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No athletes found in this category for this school.</p>';
        } else {
            athletes.forEach(athlete => {
                const athleteCard = createAthleteCard(athlete);
                athletesGrid.appendChild(athleteCard);
            });
        }
        
        contentContainer.appendChild(clone);
    }

    function createAthleteCard(athlete) {
        const template = document.getElementById('athlete-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.athlete-card');
        const cardMedia = clone.querySelector('.card-media');
        const athleteImage = cardMedia.querySelector('.athlete-image');
        const athleteName = clone.querySelector('.card-title');
        const athleteGraduation = clone.querySelector('.athlete-graduation');
        const athleteSport = clone.querySelector('.athlete-sport');
        const athleteAffiliation = clone.querySelector('.athlete-affiliation');
        
        // Clear media container initially, except for the img tag
        cardMedia.innerHTML = ''; 
        cardMedia.appendChild(athleteImage);
        athleteImage.style.display = 'none'; // Hide image initially
        
        // Set image or fallback
        if (athlete.media_url) {
            athleteImage.src = athlete.media_url;
            athleteImage.style.display = 'block';
        } else {
            // Use SVG fallback - generic athlete for now, but could adapt like player
            cardMedia.innerHTML = getSvgFallback('athlete'); // Could add gender/sport here too if needed
        }
        
        athleteImage.alt = athlete.name || 'Athlete';
        athleteName.textContent = athlete.name || 'Unknown Athlete';
        
        athleteGraduation.textContent = athlete.graduation_year ? `Class of ${athlete.graduation_year}` : '';
        athleteGraduation.style.display = athlete.graduation_year ? 'block' : 'none';
        
        athleteSport.textContent = athlete.sport || '';
        athleteSport.style.display = athlete.sport ? 'block' : 'none';
        
        let affiliationText = '';
        if (athlete.type === 'd1_athlete' && athlete.college) {
            affiliationText = athlete.college;
        } else if (athlete.type === 'pro_athlete' && athlete.professional_team) {
            affiliationText = athlete.professional_team;
        }
        athleteAffiliation.textContent = affiliationText;
        athleteAffiliation.style.display = affiliationText ? 'block' : 'none';
        
        // Apply school colors using CSS variables
        cardElement.style.borderColor = 'var(--primary-color)';
        
        // Add click event
        cardElement.addEventListener('click', () => {
            state.selectedAthlete = athlete;
            navigateToView('athlete-detail');
        });
        
        return clone;
    }

    // Athlete Detail View
    function renderAthleteDetailView() {
        const template = document.getElementById('athlete-detail-template');
        const clone = template.content.cloneNode(true);
        
        const athlete = state.selectedAthlete;
        
        // Apply theme colors
        const athleteNameTitle = clone.querySelector('.athlete-name');
        athleteNameTitle.style.color = 'var(--primary-color)';
        const backgroundHeader = clone.querySelector('.athlete-background h3');
        backgroundHeader.style.color = 'var(--primary-color)';
        backgroundHeader.style.borderBottomColor = 'var(--secondary-color)';
        
        // Set athlete details
        const athletePhoto = clone.querySelector('.athlete-photo');
        const athleteMediaContainer = clone.querySelector('.athlete-media');
        athleteMediaContainer.style.borderColor = 'var(--secondary-color)';

        // Clear media container initially, except for the img tag
        athleteMediaContainer.innerHTML = ''; 
        athleteMediaContainer.appendChild(athletePhoto); 
        athletePhoto.style.display = 'none'; // Hide image initially
        
        if (athlete.media_url) {
            athletePhoto.src = athlete.media_url;
            athletePhoto.style.display = 'block';
        } else {
            athleteMediaContainer.innerHTML = getSvgFallback('athlete'); 
        }

        athleteNameTitle.textContent = athlete.name || 'Unknown Athlete';
        
        const gradElement = clone.querySelector('.athlete-graduation');
        gradElement.textContent = athlete.graduation_year ? `Class of ${athlete.graduation_year}` : '';
        gradElement.style.display = athlete.graduation_year ? 'block' : 'none';
        
        const sportElement = clone.querySelector('.athlete-sport');
        sportElement.textContent = athlete.sport || '';
        sportElement.style.display = athlete.sport ? 'block' : 'none';
        
        const affiliationElement = clone.querySelector('.athlete-affiliation');
        let affiliationText = '';
         if (athlete.type === 'd1_athlete' && athlete.college) {
            affiliationText = athlete.college;
        } else if (athlete.type === 'pro_athlete' && athlete.professional_team) {
            affiliationText = athlete.professional_team;
        }
        affiliationElement.textContent = affiliationText;
        affiliationElement.style.display = affiliationText ? 'block' : 'none';
        
        // Create athlete description
        const descriptionContainer = clone.querySelector('.athlete-description');
        descriptionContainer.innerHTML = ''; // Clear previous
        
        let descriptionText = athlete.description || ''; // Use provided description if available
        
        if (!descriptionText) { // Generate a basic description if none provided
             let baseDesc = `${athlete.name || 'This athlete'}`;
             if (athlete.graduation_year) baseDesc += ` graduated from ${state.selectedSchool.name} in ${athlete.graduation_year}.`;
             else baseDesc += ` attended ${state.selectedSchool.name}.`;

             if (athlete.type === 'd1_athlete') {
                 baseDesc += ` They ${athlete.college ? `compete(d) in ${athlete.sport || 'sports'} at ${athlete.college}` : 'competed at the Division 1 level'}.`;
             } else if (athlete.type === 'pro_athlete') {
                 baseDesc += ` They went on to play ${athlete.sport || 'sports'} professionally${athlete.professional_team ? ` for ${athlete.professional_team}` : ''}`;
             }
             descriptionText = baseDesc;
        }
        
        // Use textContent to prevent potential XSS from description field
        const descriptionPara = document.createElement('p');
        descriptionPara.textContent = descriptionText;
        descriptionContainer.appendChild(descriptionPara);
        
        contentContainer.appendChild(clone);
    }

    // Utility Functions
    function showLoading(show) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
        contentContainer.style.display = show ? 'none' : 'block';
    }
    
    // Updated Image Fallback Handler
    function setupImageFallbacks() {
        document.querySelectorAll('img').forEach(img => {
            // Skip if already processed, if src is missing, or if it's already a data URL (like the temp pixel)
            if (img.dataset.fallbackApplied || !img.src || img.src.startsWith('data:image')) {
                return;
            }

            // Define the error handler function once
            const errorHandler = function() {
                // Prevent infinite loops
                if (this.dataset.fallbackApplied) return;
                this.dataset.fallbackApplied = 'true';

                const alt = this.alt || '';
                const parentElement = this.parentNode;

                if (!parentElement) return; // Exit if no parent

                // Hide broken image
                this.style.display = 'none';

                // Don't add fallback if SVG already exists (e.g., from initial render)
                if (parentElement.querySelector('svg')) {
                    return;
                }

                let fallbackType = 'player';
                let gender = null;
                // Try to get sport context from state IF it's relevant
                let sport = (state.currentView === 'team-detail' || state.currentView === 'player-detail') ? state.selectedSport : null;

                // Determine fallback type based on class
                if (this.classList.contains('card-image')) fallbackType = 'school';
                if (this.classList.contains('team-photo')) fallbackType = 'team';
                if (this.classList.contains('player-image') || this.classList.contains('player-photo')) fallbackType = 'player';
                if (this.classList.contains('athlete-image') || this.classList.contains('athlete-photo')) fallbackType = 'athlete';

                // Infer gender if player
                if (fallbackType === 'player') {
                    if (alt.toLowerCase().includes('women') || alt.toLowerCase().includes('girl')) gender = 'female';
                    else gender = 'male';
                    // If sport context missing, could try to infer from alt text here
                    // if (!sport) { /* ... */ }
                } else if (fallbackType === 'athlete') {
                    // Could add gender/sport inference for athlete alt text too if needed
                }

                // Inject the appropriate SVG
                parentElement.insertAdjacentHTML('beforeend', getSvgFallback(fallbackType, gender, sport));
                parentElement.style.backgroundColor = 'var(--background-light)';

                // Remove the error handler after first trigger
                this.onerror = null;
            };

            // Assign the error handler
            img.onerror = errorHandler;

            // Check for already broken images (e.g., cached 404)
            // Use img.naturalWidth === 0 for a more reliable check than just !img.complete
            if (img.complete && img.naturalWidth === 0) {
                // If already complete but broken, manually trigger the handler
                errorHandler.call(img); // Call handler with img as `this`
            } else if (!img.complete) {
                // If not yet complete, the onerror handler will catch it if it fails
                // No immediate action needed here, just let the browser handle loading
            }
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Set up navigation buttons
        backButton.addEventListener('click', navigateBack);
        homeButton.addEventListener('click', navigateHome);
        
        // Set up search functionality
        setupSearchFunctionality();
        
        // Add trophy modal to body
        const trophyModal = document.createElement('div');
        trophyModal.className = 'trophy-modal';
        trophyModal.id = 'trophy-fullscreen-modal';
        trophyModal.innerHTML = `
            <div class="trophy-modal-content">
                <button class="close-modal-btn"><i class="fas fa-times"></i></button>
                <model-viewer id="modal-trophy-viewer" src="" alt="Championship Trophy Model" 
                            ar ar-modes="webxr scene-viewer quick-look" 
                            camera-controls touch-action="pan-y" 
                            auto-rotate shadow-intensity="1"
                            style="width: 100%; height: 100%; --mv-progress-mask: none;">
                </model-viewer>
            </div>
        `;
        document.body.appendChild(trophyModal);
        
        // Add close event to modal
        const closeModalBtn = trophyModal.querySelector('.close-modal-btn');
        closeModalBtn.addEventListener('click', () => {
            trophyModal.style.display = 'none';
            // Stop rotation when closing
            const modalViewer = document.getElementById('modal-trophy-viewer');
            if(modalViewer) modalViewer.removeAttribute('auto-rotate'); 
        });
    }

    // Search functionality
    function setupSearchFunctionality() {
        // Add event listeners for search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        searchButton.addEventListener('click', performSearch);
    }

    // Perform search
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;
        
        state.searchQuery = query;
        
        // Search for players
        const playerResults = searchPlayers(query);
        
        // Search for teams
        const teamResults = searchTeams(query);
        
        // Store results in state
        state.searchResults = {
            players: playerResults,
            teams: teamResults
        };
        
        // Navigate to search results view
        navigateToView('search-results');
    }

    // Search for players
    function searchPlayers(query) {
        // Get unique players
        const uniquePlayers = getUniquePlayers();
        
        // Filter players by name
        return uniquePlayers.filter(player => 
            player.name.toLowerCase().includes(query)
        );
    }

    // Search for teams
    function searchTeams(query) {
        return state.teams.filter(team => 
            team.school_name.toLowerCase().includes(query) ||
            team.sport_name.toLowerCase().includes(query) ||
            (team.achievement && team.achievement.toLowerCase().includes(query)) ||
            team.year.toString().includes(query)
        );
    }

    // Render search results
    function renderSearchResultsView() {
        const template = document.getElementById('search-results-template');
        const clone = template.content.cloneNode(true);
        
        const title = clone.querySelector('.view-title');
        title.textContent = `Search Results for "${state.searchQuery}"`;
        
        const playersGrid = clone.querySelector('.players-results-grid');
        const teamsGrid = clone.querySelector('.teams-results-grid');
        
        // Render player results
        if (state.searchResults.players.length === 0) {
            const playersSection = clone.querySelector('#players-results');
            playersSection.innerHTML = '<h3>Players</h3><p>No players found matching your search.</p>';
        } else {
            state.searchResults.players.forEach(player => {
                const playerCard = createPlayerCard(player, true);
                playersGrid.appendChild(playerCard);
            });
        }
        
        // Render team results
        if (state.searchResults.teams.length === 0) {
            const teamsSection = clone.querySelector('#teams-results');
            teamsSection.innerHTML = '<h3>Teams</h3><p>No teams found matching your search.</p>';
        } else {
            state.searchResults.teams.forEach(team => {
                const teamCard = createTeamSearchResultCard(team);
                teamsGrid.appendChild(teamCard);
            });
        }
        
        contentContainer.appendChild(clone);
    }

    // Create team card for search results
    function createTeamSearchResultCard(team) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card team-search-card';
        
        const cardMedia = document.createElement('div');
        cardMedia.className = 'card-media';
        
        // Create icon element
        const icon = document.createElement('i');
        icon.className = 'fas ' + getSportIcon(team.sport_name);
        icon.style.color = 'var(--secondary-color)';
        cardMedia.appendChild(icon);
        
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        const cardTitle = document.createElement('h3');
        cardTitle.className = 'card-title';
        cardTitle.textContent = `${team.school_name} ${team.sport_name}`;
        
        const cardSubtitle = document.createElement('p');
        cardSubtitle.className = 'card-subtitle';
        cardSubtitle.textContent = `${team.year} - ${team.achievement || 'Championship'}`;
        
        cardContent.appendChild(cardTitle);
        cardContent.appendChild(cardSubtitle);
        
        cardElement.appendChild(cardMedia);
        cardElement.appendChild(cardContent);
        
        // Add click event
        cardElement.addEventListener('click', () => {
            // Find the school
            const school = state.schools.find(s => s.name === team.school_name);
            
            if (school) {
                state.selectedSchool = school;
                state.selectedSport = team.sport_name;
                state.selectedYear = team.year;
                state.selectedTeam = team;
                navigateToView('team-detail');
            }
        });
        
        return cardElement;
    }

    // All Players View
    function renderAllPlayersView() {
        const template = document.getElementById('all-players-template');
        const clone = template.content.cloneNode(true);
        const playersGrid = clone.querySelector('#all-players-grid');
        
        // Get all unique players by name (combining duplicates)
        const uniquePlayers = getUniquePlayers();
        
        if (uniquePlayers.length === 0) {
            playersGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No players found.</p>';
        } else {
            uniquePlayers.forEach(player => {
                const playerCard = createPlayerCard(player);
                playersGrid.appendChild(playerCard);
            });
        }
        
        // Add filter functionality
        const filterInput = clone.querySelector('#players-filter');
        filterInput.addEventListener('input', (e) => {
            const filterValue = e.target.value.toLowerCase();
            const playerCards = playersGrid.querySelectorAll('.player-card');
            
            playerCards.forEach(card => {
                const playerName = card.querySelector('.card-title').textContent.toLowerCase();
                if (playerName.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
        
        contentContainer.appendChild(clone);
    }

    // Helper to get unique players by name (combining duplicates)
    function getUniquePlayers() {
        const playerMap = new Map();
        
        state.individuals.filter(individual => individual.type === 'player').forEach(player => {
            if (!player.name) return; // Skip players without names
            
            if (playerMap.has(player.name)) {
                // Add the current player's teams/info to the existing player
                const existingPlayer = playerMap.get(player.name);
                existingPlayer.instances.push(player);
            } else {
                // Create a new entry with the first instance
                playerMap.set(player.name, {
                    name: player.name,
                    instances: [player],
                    // Use the first instance's data for the card display
                    media_url: player.media_url,
                    position: player.position,
                    number: player.number,
                    gender: player.gender,
                    sport_name: player.team_sport,
                    school_name: player.school_name
                });
            }
        });
        
        return Array.from(playerMap.values());
    }

    // Updated Player Card Creation for Unified View
    function createPlayerCard(player, isSearch = false) {
        const template = document.getElementById('player-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.player-card');
        const cardMedia = clone.querySelector('.card-media');
        const playerImage = cardMedia.querySelector('.player-image'); // Find image inside media
        const playerName = clone.querySelector('.card-title');
        const playerPosition = clone.querySelector('.player-position');
        const playerNumber = clone.querySelector('.player-number');
        
        // Clear media container initially, except for the img tag
        cardMedia.innerHTML = ''; 
        cardMedia.appendChild(playerImage); 
        playerImage.style.display = 'none'; // Hide image initially
        
        // Is this a unified player with multiple instances or a single player?
        const displayPlayer = player.instances ? player.instances[0] : player;
        
        // Set image or fallback
        if (displayPlayer.media_url) {
            playerImage.src = displayPlayer.media_url;
            playerImage.style.display = 'block';
        } else {
            // Determine gender and sport for fallback
            const gender = displayPlayer.gender || (displayPlayer.name && (displayPlayer.name.toLowerCase().includes('women') || displayPlayer.name.toLowerCase().includes('girl')) ? 'female' : 'male');
            // Use selectedSport from state as context or the player's sport
            const sportContext = state.selectedSport || displayPlayer.team_sport || '';
            cardMedia.innerHTML = getSvgFallback('player', gender, sportContext); 
        }
        
        playerImage.alt = displayPlayer.name || 'Player';
        playerName.textContent = displayPlayer.name || 'Unknown Player';
        
        // For unified player cards, show additional info about multiple sports
        if (player.instances && player.instances.length > 1) {
            playerPosition.textContent = `${player.instances.length} Teams`;
            
            // Get unique sports
            const sports = [...new Set(player.instances.map(p => p.team_sport))].filter(Boolean);
            if (sports.length > 0) {
                playerNumber.textContent = sports.join(', ');
            } else {
                playerNumber.style.display = 'none';
            }
        } else {
            playerPosition.textContent = displayPlayer.position || '';
            playerNumber.textContent = displayPlayer.number ? `#${displayPlayer.number}` : '';
            
            // Hide empty elements
            if (!displayPlayer.position) playerPosition.style.display = 'none';
            if (!displayPlayer.number) playerNumber.style.display = 'none';
        }
        
        cardElement.style.borderColor = 'var(--primary-color)';
        
        cardElement.addEventListener('click', () => {
            if (player.instances) {
                // For unified player view, store all instances
                state.selectedPlayer = player;
            } else {
                // For single player, create a unified player object with one instance
                state.selectedPlayer = {
                    name: player.name,
                    instances: [player]
                };
            }
            
            // If we got here from a team, store that context
            if (state.currentView === 'team-detail') {
                state.selectedPlayer.fromTeam = {
                    school: state.selectedSchool,
                    sport: state.selectedSport,
                    year: state.selectedYear,
                    team: state.selectedTeam
                };
            }
            
            navigateToView('player-detail');
        });
        
        return clone;
    }

    // Initialize the application
    init();
});