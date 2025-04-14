document.addEventListener('DOMContentLoaded', () => {
    // Application State
    const state = {
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
        selectedAthlete: null
    };

    // DOM Elements
    const contentContainer = document.getElementById('content-container');
    const backButton = document.getElementById('back-button');
    const homeButton = document.getElementById('home-button');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Default Theme Colors (for resetting)
    const defaultTheme = {
        primary: '#00205B',
        secondary: '#EFBF04',
        backgroundGradient: 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)'
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
        // Set up event listeners
        backButton.addEventListener('click', navigateBack);
        homeButton.addEventListener('click', navigateHome);
        
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

        // Load data and render initial view
        showLoading(true);
        
        // Set up loading states
        let schoolsLoaded = false;
        let teamsLoaded = false;
        let individualsLoaded = false;
        
        try {
            // Try to load schools data
            await fetchSchools();
            schoolsLoaded = true;
        } catch (error) {
            console.error('Error loading schools data:', error);
            // Initialize with empty array if fetch fails
            state.schools = [];
        }
        
        try {
            // Try to load teams data
            await fetchTeams();
            teamsLoaded = true;
        } catch (error) {
            console.error('Error loading teams data:', error);
            // Initialize with empty array if fetch fails
            state.teams = [];
        }
        
        try {
            // Try to load individuals data
            await fetchIndividuals();
            individualsLoaded = true;
        } catch (error) {
            console.error('Error loading individuals data:', error);
            // Initialize with empty array if fetch fails
            state.individuals = [];
        }
        
        showLoading(false);
        
        // If all data failed to load, show error message
        if (!schoolsLoaded && !teamsLoaded && !individualsLoaded) {
            contentContainer.innerHTML = `
                <div class="error-container">
                    <h2>Connection Error</h2>
                    <p>We're unable to connect to the data servers at this time.</p>
                    <p>Please check your internet connection and try again later.</p>
                    <button class="btn" onclick="location.reload()">Refresh</button>
                </div>
            `;
            return;
        }
        
        // If some data loaded but not schools, show a limited error message
        if (!schoolsLoaded) {
            contentContainer.innerHTML = `
                <div class="error-container">
                    <h2>School Data Unavailable</h2>
                    <p>We're unable to load school information at this time.</p>
                    <p>Some features may be limited until connectivity is restored.</p>
                    <button class="btn" onclick="location.reload()">Refresh</button>
                </div>
            `;
            return;
        }
        
        // If schools loaded but we have no data, show empty state
        if (state.schools.length === 0) {
            contentContainer.innerHTML = `
                <div class="error-container">
                    <h2>No Schools Available</h2>
                    <p>There are currently no schools in the database.</p>
                    <p>Please contact the administrator to add school data.</p>
                    <button class="btn" onclick="location.reload()">Refresh</button>
                </div>
            `;
            return;
        }
        
        // If we have schools data, render the schools view
        renderView('schools');
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
                
                if (data.success && Array.isArray(data.data)) {
                    state.schools = data.data;
                    return { data: data.data };
                }
                throw new Error('No valid data in axios response');
            } catch (axiosError) {
                console.error('Axios attempt failed:', axiosError);
                
                // Fallback to original endpoint
                const response = await fetch(`${apiBaseUrl}/api/schools`);
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                const data = await response.json();
                state.schools = data.data || [];
                return data;
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
            throw error;
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
                
                if (data.success && Array.isArray(data.data)) {
                    state.teams = data.data;
                    return { data: data.data };
                }
                throw new Error('No valid data in axios response');
            } catch (axiosError) {
                console.error('Axios attempt failed:', axiosError);
                
                // Fallback to original endpoint
                const response = await fetch(`${apiBaseUrl}/api/teams`);
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                const data = await response.json();
                state.teams = data.data || [];
                return data;
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
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
                
                if (data.success && Array.isArray(data.data)) {
                    state.individuals = data.data;
                    return { data: data.data };
                }
                throw new Error('No valid data in axios response');
            } catch (axiosError) {
                console.error('Axios attempt failed:', axiosError);
                
                // Fallback to original endpoint
                const response = await fetch(`${apiBaseUrl}/api/individuals`);
                if (!response.ok) throw new Error(`Server responded with ${response.status}`);
                const data = await response.json();
                state.individuals = data.data || [];
                return data;
            }
        } catch (error) {
            console.error('Error fetching individuals:', error);
            throw error;
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

        state.schools.forEach(school => {
            const schoolCard = createSchoolCard(school);
            schoolsGrid.appendChild(schoolCard);
        });

        contentContainer.appendChild(clone);
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

    function createPlayerCard(player) {
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
        
        // Set image or fallback
        if (player.media_url) {
            playerImage.src = player.media_url;
            playerImage.style.display = 'block';
        } else {
            // Determine gender and sport for fallback
            const gender = player.gender || (player.name && (player.name.toLowerCase().includes('women') || player.name.toLowerCase().includes('girl')) ? 'female' : 'male');
            // Use selectedSport from state as context
            cardMedia.innerHTML = getSvgFallback('player', gender, state.selectedSport); 
        }
        
        playerImage.alt = player.name || 'Player';
        playerName.textContent = player.name || 'Unknown Player';
        playerPosition.textContent = player.position || '';
        playerNumber.textContent = player.number ? `#${player.number}` : '';
        
        cardElement.style.borderColor = 'var(--primary-color)';
        
        cardElement.addEventListener('click', () => {
            state.selectedPlayer = player;
            navigateToView('player-detail');
        });
        
        return clone;
    }

    // Player Detail View
    function renderPlayerDetailView() {
        const template = document.getElementById('player-detail-template');
        const clone = template.content.cloneNode(true);
        
        const player = state.selectedPlayer;
        
        // Apply theme colors
        const playerNameTitle = clone.querySelector('.player-name');
        playerNameTitle.style.color = 'var(--primary-color)';
        const statsHeader = clone.querySelector('.player-stats h3');
        statsHeader.style.color = 'var(--primary-color)';
        statsHeader.style.borderBottomColor = 'var(--secondary-color)';
        
        // Set player details
        const playerPhoto = clone.querySelector('.player-photo');
        const playerMediaContainer = clone.querySelector('.player-media');
        playerMediaContainer.style.borderColor = 'var(--secondary-color)';
        
        // Clear media container initially, except for the img tag
        playerMediaContainer.innerHTML = ''; 
        playerMediaContainer.appendChild(playerPhoto); 
        playerPhoto.style.display = 'none'; // Hide image initially
        
        if (player.media_url) {
            playerPhoto.src = player.media_url;
            playerPhoto.style.display = 'block';
        } else {
             const gender = player.gender || (player.name && (player.name.toLowerCase().includes('women') || player.name.toLowerCase().includes('girl')) ? 'female' : 'male');
            playerMediaContainer.innerHTML = getSvgFallback('player', gender, state.selectedSport);
        }
        
        playerNameTitle.textContent = player.name || 'Unknown Player';
        
        const numberPosition = clone.querySelector('.player-number-position');
        let numPosText = '';
        if (player.number) numPosText += `#${player.number}`;
        if (player.position) numPosText += (numPosText ? ' - ' : '') + player.position;
        if (numPosText) {
            numberPosition.textContent = numPosText;
            numberPosition.style.display = 'block';
        } else {
            numberPosition.style.display = 'none';
        }
        
        clone.querySelector('.player-team').textContent = 
            `${state.selectedSchool.name} ${state.selectedSport} (${state.selectedYear})`;
        
        // Create stats cards
        const statsGrid = clone.querySelector('.stats-grid');
        let statsFound = false;
        
        // Check for common stats (case-insensitive keys if possible from data source)
        const checkStat = (key, label) => {
            if (player[key] !== null && player[key] !== undefined && player[key] !== '') {
                addStatCard(statsGrid, player[key], label);
                statsFound = true;
            }
        };

        checkStat('assists', 'Assists');
        checkStat('rebounds', 'Rebounds');
        checkStat('points_per_game', 'PPG');
        checkStat('passing_yards', 'Passing Yards');
        checkStat('touchdowns', 'Touchdowns');
        checkStat('completion_percentage', 'Completion %');
        checkStat('goals', 'Goals');
        checkStat('saves', 'Saves');
        checkStat('batting_average', 'Batting Avg');
        checkStat('home_runs', 'Home Runs');
        checkStat('era', 'ERA');
        checkStat('wins', 'Wins');
        checkStat('losses', 'Losses');
        checkStat('tackles', 'Tackles');
        
        // Check for other stats field
        if (player.other_stat_name && player.other_stat_value) {
            addStatCard(statsGrid, player.other_stat_value, player.other_stat_name);
            statsFound = true;
        }

        if (!statsFound) {
            statsGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No statistics available for this player.</p>';
        }
        
        contentContainer.appendChild(clone);
    }

    function addStatCard(container, value, label) {
        const statCard = document.createElement('div');
        statCard.className = 'stat-card';
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = value;
        statValue.style.color = 'var(--primary-color)'; // Use theme color
        
        const statLabel = document.createElement('div');
        statLabel.className = 'stat-label';
        statLabel.textContent = label;
        
        statCard.appendChild(statValue);
        statCard.appendChild(statLabel);
        container.appendChild(statCard);
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

    // Initialize the application
    init();
});