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
        "lacrosse": "fa-lacrosse-stick",
        "men's lacrosse": "fa-lacrosse-stick",
        "women's lacrosse": "fa-lacrosse-stick",
        
        // Cheerleading
        "cheer": "fa-smile",
        "cheerleading": "fa-smile",
        
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

    // SVG Fallback Images
    const svgFallbacks = {
        school: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <rect x="10" y="50" width="80" height="40" fill="#00205B"/>
            <polygon points="50,10 10,50 90,50" fill="#00205B"/>
            <rect x="40" y="70" width="20" height="20" fill="#EFBF04"/>
            <rect x="25" y="60" width="10" height="10" fill="#FFFFFF"/>
            <rect x="65" y="60" width="10" height="10" fill="#FFFFFF"/>
        </svg>`,
        
        // Default player silhouette - more natural looking
        player: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="25" r="15" fill="#00205B"/>
            <path d="M50,40 L50,75 M30,55 L70,55" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M35,75 L30,110 M65,75 L70,110" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,110 L40,110 M60,110 L70,110" stroke="#00205B" stroke-width="5" fill="none"/>
        </svg>`,
        
        // Male default silhouette
        playerMale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M40,30 L60,30" stroke="#00205B" stroke-width="3" fill="none"/>
            <path d="M50,37 L50,75 M35,55 L65,55" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M35,75 L30,110 M65,75 L70,110" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,110 L40,110 M60,110 L70,110" stroke="#00205B" stroke-width="5" fill="none"/>
        </svg>`,
        
        // Female default silhouette
        playerFemale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M40,20 Q50,10 60,20" stroke="#00205B" stroke-width="3" fill="none"/>
            <path d="M50,37 L50,75 M35,55 L65,55" stroke="#00205B" stroke-width="7" fill="none"/>
            <path d="M50,75 Q35,95 30,110 M50,75 Q65,95 70,110" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,110 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
        </svg>`,
        
        // Basketball player - male
        basketballMale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M50,37 L50,65 M35,55 L65,55" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M35,65 L30,100 M65,65 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <circle cx="80" cy="55" r="10" fill="none" stroke="#EFBF04" stroke-width="2"/>
            <path d="M80,45 L80,65 M70,55 L90,55" stroke="#EFBF04" stroke-width="2"/>
        </svg>`,
        
        // Basketball player - female
        basketballFemale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M40,20 Q50,10 60,20" stroke="#00205B" stroke-width="3" fill="none"/>
            <path d="M50,37 L50,65 M35,55 L65,55" stroke="#00205B" stroke-width="7" fill="none"/>
            <path d="M50,65 Q35,85 30,100 M50,65 Q65,85 70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <circle cx="80" cy="55" r="10" fill="none" stroke="#EFBF04" stroke-width="2"/>
            <path d="M80,45 L80,65 M70,55 L90,55" stroke="#EFBF04" stroke-width="2"/>
        </svg>`,
        
        // Football player
        footballPlayer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <rect x="40" y="12" width="20" height="25" rx="10" fill="#00205B"/>
            <path d="M35,25 L65,25" stroke="#EFBF04" stroke-width="2"/>
            <rect x="38" y="37" width="24" height="5" fill="#00205B"/>
            <path d="M50,42 L50,75 M35,55 L65,55" stroke="#00205B" stroke-width="10" fill="none"/>
            <path d="M35,75 L30,110 M65,75 L70,110" stroke="#00205B" stroke-width="6" fill="none"/>
            <path d="M30,110 L40,110 M60,110 L70,110" stroke="#00205B" stroke-width="5" fill="none"/>
        </svg>`,
        
        // Baseball/Softball player - male
        baseballMale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M50,37 L50,65 M35,55 L65,55" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M35,65 L30,100 M65,65 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M65,55 L90,40" stroke="#EFBF04" stroke-width="3" fill="none"/>
            <ellipse cx="90" cy="35" rx="5" ry="8" fill="#EFBF04" transform="rotate(-30, 90, 35)"/>
        </svg>`,
        
        // Baseball/Softball player - female
        baseballFemale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M40,20 Q50,10 60,20" stroke="#00205B" stroke-width="3" fill="none"/>
            <path d="M50,37 L50,65 M35,55 L65,55" stroke="#00205B" stroke-width="7" fill="none"/>
            <path d="M50,65 Q35,85 30,100 M50,65 Q65,85 70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M65,55 L90,40" stroke="#EFBF04" stroke-width="3" fill="none"/>
            <ellipse cx="90" cy="35" rx="5" ry="8" fill="#EFBF04" transform="rotate(-30, 90, 35)"/>
        </svg>`,
        
        // Soccer player - male
        soccerMale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M50,37 L50,65 M35,55 L65,55" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M35,65 L30,100 M65,65 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <circle cx="85" cy="105" r="8" fill="none" stroke="#EFBF04" stroke-width="2"/>
            <path d="M81,101 L89,109 M89,101 L81,109" stroke="#EFBF04" stroke-width="1"/>
        </svg>`,
        
        // Soccer player - female
        soccerFemale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M40,20 Q50,10 60,20" stroke="#00205B" stroke-width="3" fill="none"/>
            <path d="M50,37 L50,65 M35,55 L65,55" stroke="#00205B" stroke-width="7" fill="none"/>
            <path d="M50,65 Q35,85 30,100 M50,65 Q65,85 70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <circle cx="85" cy="105" r="8" fill="none" stroke="#EFBF04" stroke-width="2"/>
            <path d="M81,101 L89,109 M89,101 L81,109" stroke="#EFBF04" stroke-width="1"/>
        </svg>`,
        
        // Track / Cross Country - male
        trackMale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M50,37 L60,80 M35,55 L62,45" stroke="#00205B" stroke-width="6" fill="none"/>
            <path d="M60,80 L70,110 M45,90 L35,110" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,110 L40,110 M65,110 L75,110" stroke="#00205B" stroke-width="5" fill="none"/>
        </svg>`,
        
        // Track / Cross Country - female
        trackFemale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M40,20 Q50,10 60,20" stroke="#00205B" stroke-width="3" fill="none"/>
            <path d="M50,37 L60,80 M35,55 L62,45" stroke="#00205B" stroke-width="6" fill="none"/>
            <path d="M60,80 L70,110 M45,90 L35,110" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,110 L40,110 M65,110 L75,110" stroke="#00205B" stroke-width="5" fill="none"/>
        </svg>`,
        
        // Volleyball - female (primary)
        volleyballFemale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M40,20 Q50,10 60,20" stroke="#00205B" stroke-width="3" fill="none"/>
            <path d="M50,37 L50,60 M35,48 L65,48" stroke="#00205B" stroke-width="7" fill="none"/>
            <path d="M50,60 Q35,80 30,100 M50,60 Q65,80 70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <circle cx="75" cy="40" r="10" fill="none" stroke="#EFBF04" stroke-width="2"/>
            <path d="M70,35 L80,45 M80,35 L70,45" stroke="#EFBF04" stroke-width="1"/>
        </svg>`,
        
        // Volleyball - male
        volleyballMale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M50,37 L50,60 M35,48 L65,48" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M35,60 L30,100 M65,60 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <circle cx="75" cy="40" r="10" fill="none" stroke="#EFBF04" stroke-width="2"/>
            <path d="M70,35 L80,45 M80,35 L70,45" stroke="#EFBF04" stroke-width="1"/>
        </svg>`,
        
        // Wrestling - primary male
        wrestlingPlayer: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M45,22 L55,22" stroke="#EFBF04" stroke-width="2"/>
            <path d="M50,37 L50,60 M32,48 L68,48" stroke="#00205B" stroke-width="10" fill="none"/>
            <path d="M32,60 L30,100 M68,60 L70,100" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="6" fill="none"/>
        </svg>`,
        
        // Swimming - male
        swimmingMale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M50,37 L50,75 M30,60 L70,60" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M30,60 L20,45 M70,60 L80,45" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M35,75 L30,100 M65,75 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M35,35 L65,35" stroke="#EFBF04" stroke-width="2"/>
        </svg>`,
        
        // Swimming - female
        swimmingFemale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="22" r="15" fill="#00205B"/>
            <path d="M40,20 Q50,10 60,20" stroke="#00205B" stroke-width="3" fill="none"/>
            <path d="M50,37 L50,75 M30,60 L70,60" stroke="#00205B" stroke-width="7" fill="none"/>
            <path d="M30,60 L20,45 M70,60 L80,45" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M50,75 Q35,85 30,100 M50,75 Q65,85 70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M30,100 L40,110 M60,110 L70,100" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M35,35 L65,35" stroke="#EFBF04" stroke-width="2"/>
        </svg>`,
        
        athlete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="50" cy="25" r="15" fill="#00205B"/>
            <path d="M50,40 L50,80 M30,55 L70,55" stroke="#00205B" stroke-width="8" fill="none"/>
            <path d="M25,95 L40,55 M75,95 L60,55" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M25,95 L30,110 M75,95 L70,110" stroke="#00205B" stroke-width="4" fill="none"/>
            <circle cx="65" cy="15" r="8" fill="#EFBF04"/>
            <path d="M65,10 L65,20 M60,15 L70,15" stroke="#00205B" stroke-width="2"/>
        </svg>`,
        
        team: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <circle cx="30" cy="25" r="10" fill="#00205B"/>
            <circle cx="50" cy="20" r="10" fill="#00205B"/>
            <circle cx="70" cy="25" r="10" fill="#00205B"/>
            <path d="M30,35 L30,70 M20,45 L40,45" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M50,30 L50,70 M40,45 L60,45" stroke="#00205B" stroke-width="5" fill="none"/>
            <path d="M70,35 L70,70 M60,45 L80,45" stroke="#00205B" stroke-width="5" fill="none"/>
            <rect x="15" y="70" width="70" height="10" fill="#EFBF04"/>
            <path d="M50,70 L50,80" stroke="#00205B" stroke-width="1"/>
        </svg>`,
        
        trophy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            <path d="M35,20 L65,20 L65,40 C65,50 70,55 75,55 L75,60 C65,60 65,70 65,70 L35,70 C35,70 35,60 25,60 L25,55 C30,55 35,50 35,40 Z" fill="#EFBF04"/>
            <rect x="40" y="70" width="20" height="10" fill="#EFBF04"/>
            <rect x="30" y="80" width="40" height="5" fill="#EFBF04"/>
            <rect x="35" y="10" width="30" height="10" fill="#00205B"/>
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
        trophyModal.innerHTML = `
            <div class="trophy-modal-content">
                <button class="close-modal-btn"><i class="fas fa-times"></i></button>
                <iframe class="modal-trophy-model" src="" frameborder="0"></iframe>
            </div>
        `;
        document.body.appendChild(trophyModal);
        
        // Add close event to modal
        const closeModalBtn = trophyModal.querySelector('.close-modal-btn');
        closeModalBtn.addEventListener('click', () => {
            trophyModal.style.display = 'none';
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
            // Try both endpoints to see which works
            try {
                const response = await fetch('/api/axios?type=schools');
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
                const response = await fetch('/api/schools');
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
            // Try both endpoints to see which works
            try {
                const response = await fetch('/api/axios?type=teams');
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
                const response = await fetch('/api/teams');
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
            // Try both endpoints to see which works
            try {
                const response = await fetch('/api/axios?type=individuals');
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
                const response = await fetch('/api/individuals');
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
    }

    // Helper for updating theme based on school colors
    function updateThemeColors(school) {
        // Reset to defaults if no school is selected
        if (!school) {
            document.documentElement.style.setProperty('--primary-color', '#00205B');
            document.documentElement.style.setProperty('--secondary-color', '#EFBF04');
            
            const header = document.querySelector('header');
            if (header) header.style.backgroundColor = '';
            
            const navButtons = document.querySelectorAll('.nav-button');
            navButtons.forEach(button => button.style.borderColor = '');
            
            document.body.style.background = '';
            
            const viewTitle = document.querySelector('.view-title');
            if (viewTitle) {
                viewTitle.style.color = '';
                viewTitle.style.borderBottomColor = '';
            }
            return;
        }
        
        // Update CSS variables for the whole site
        document.documentElement.style.setProperty('--primary-color', school.primary_color || '#00205B');
        document.documentElement.style.setProperty('--secondary-color', school.secondary_color || '#EFBF04');
        
        // Update header colors
        const header = document.querySelector('header');
        if (header) {
            header.style.backgroundColor = school.primary_color || '#00205B';
        }
        
        // Update buttons colors
        const navButtons = document.querySelectorAll('.nav-button');
        navButtons.forEach(button => {
            button.style.borderColor = school.secondary_color || '#EFBF04';
        });
        
        // Update body background
        document.body.style.background = `linear-gradient(135deg, ${school.primary_color}22 0%, #E0E0E0 100%)`;
        
        // Update view title colors
        const viewTitle = document.querySelector('.view-title');
        if (viewTitle) {
            viewTitle.style.color = school.primary_color || '#00205B';
            viewTitle.style.borderBottomColor = school.secondary_color || '#EFBF04';
        }
    }

    // Helper function to handle grid item count for proper centering
    function handleFewGridItems(grid, items) {
        if (!grid) return;
        
        // If there are 2 or fewer items, add the 'few-items' class
        if (items.length <= 2) {
            grid.classList.add('few-items');
        } else {
            grid.classList.remove('few-items');
        }
    }

    // View Rendering Functions
    function renderView(viewName) {
        // Clear the content container
        contentContainer.innerHTML = '';
        
        // Render the appropriate view
        switch (viewName) {
            case 'schools':
                renderSchoolsView();
                // Reset theme colors to default
                updateThemeColors(null);
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
                updateThemeColors(null);
        }

        // Update back button visibility
        backButton.style.display = state.navigationHistory.length > 0 ? 'flex' : 'none';
        
        // Set up image fallbacks for all images in the current view
        setTimeout(setupImageFallbacks, 100); // Small delay to ensure all images are in the DOM
    }

    // Helper to find sport icon based on sport name
    function getSportIcon(sportName) {
        if (!sportName) return 'fa-trophy';
        
        const lowercaseSport = sportName.toLowerCase();
        
        // Check direct match first
        if (sportIcons[lowercaseSport]) {
            return sportIcons[lowercaseSport];
        }
        
        // If no direct match, search for partial matches
        for (const [key, icon] of Object.entries(sportIcons)) {
            if (lowercaseSport.includes(key)) {
                return icon;
            }
        }
        
        // Default to trophy if no match found
        return 'fa-trophy';
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
        
        // Handle grid with few items
        handleFewGridItems(schoolsGrid, state.schools);

        contentContainer.appendChild(clone);
    }

    function createSchoolCard(school) {
        const template = document.getElementById('school-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.school-card');
        const cardMedia = clone.querySelector('.card-media');
        const cardImage = clone.querySelector('.card-image');
        const cardTitle = clone.querySelector('.card-title');
        
        // Set school card styles based on school colors
        cardElement.style.borderColor = school.primary_color || '#00205B';
        cardMedia.style.backgroundColor = school.primary_color || '#00205B';
        
        // Set image or fallback
        if (school.media_url) {
            cardImage.src = school.media_url;
        } else {
            // Use SVG fallback
            cardMedia.innerHTML = svgFallbacks.school;
            cardImage.style.display = 'none';
        }
        
        cardImage.alt = school.name;
        cardTitle.textContent = school.name;
        
        // Add click event
        cardElement.addEventListener('click', () => {
            state.selectedSchool = school;
            navigateToView('categories');
        });
        
        return clone;
    }

    // Categories View
    function renderCategoriesView() {
        const template = document.getElementById('categories-view-template');
        const clone = template.content.cloneNode(true);
        const title = clone.querySelector('.view-title');
        
        title.textContent = `${state.selectedSchool.name} - Select a Category`;
        
        // Apply school colors to cards
        const categoryCards = clone.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const cardMedia = card.querySelector('.card-media');
            cardMedia.style.backgroundColor = state.selectedSchool.primary_color || '#00205B';
            card.querySelector('i').style.color = state.selectedSchool.secondary_color || '#EFBF04';
            
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
        title.style.color = state.selectedSchool.primary_color || '#00205B';
        title.style.borderBottomColor = state.selectedSchool.secondary_color || '#EFBF04';
        
        // Get unique sports for the selected school
        const sports = [...new Set(
            state.teams
                .filter(team => team.school_name === state.selectedSchool.name)
                .map(team => team.sport_name)
        )];
        
        sports.forEach(sport => {
            const sportCard = createSportCard(sport);
            sportsGrid.appendChild(sportCard);
        });
        
        // Handle grid with few items
        handleFewGridItems(sportsGrid, sports);
        
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
        iconElement.classList.add(sportIconClass);
        titleElement.textContent = sport;
        
        // Apply school colors
        cardMedia.style.backgroundColor = state.selectedSchool.primary_color || '#00205B';
        iconElement.style.color = state.selectedSchool.secondary_color || '#EFBF04';
        
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
        
        // Get teams for the selected school and sport
        const teams = state.teams.filter(team => 
            team.school_name === state.selectedSchool.name && 
            team.sport_name === state.selectedSport
        );
        
        teams.forEach(team => {
            const yearCard = createYearCard(team);
            yearsGrid.appendChild(yearCard);
        });
        
        // Handle grid with few items
        handleFewGridItems(yearsGrid, teams);
        
        contentContainer.appendChild(clone);
    }

    function createYearCard(team) {
        const template = document.getElementById('year-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.year-card');
        const titleElement = clone.querySelector('.card-title');
        const subtitleElement = clone.querySelector('.card-subtitle');
        
        titleElement.textContent = team.year;
        subtitleElement.textContent = team.achievement;
        
        // Apply school colors
        cardElement.style.backgroundColor = state.selectedSchool.primary_color || '#00205B';
        titleElement.style.color = state.selectedSchool.secondary_color || '#EFBF04';
        
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
        
        // Apply school colors
        const teamTitle = clone.querySelector('.team-title');
        teamTitle.textContent = `${state.selectedSchool.name} ${state.selectedSport} (${state.selectedYear})`;
        teamTitle.style.color = state.selectedSchool.primary_color || '#00205B';
        
        const teamAchievement = clone.querySelector('.team-achievement');
        teamAchievement.textContent = state.selectedTeam.achievement;
        teamAchievement.style.backgroundColor = state.selectedSchool.primary_color || '#00205B';
        teamAchievement.style.color = state.selectedSchool.secondary_color || '#EFBF04';
        
        // Set team photo
        const teamPhoto = clone.querySelector('.team-photo');
        const teamMedia = clone.querySelector('.team-media');
        
        if (state.selectedTeam.team_photo_url) {
            teamPhoto.src = state.selectedTeam.team_photo_url;
            teamPhoto.alt = `${state.selectedSchool.name} ${state.selectedSport} Team ${state.selectedYear}`;
        } else {
            // Use SVG fallback for team
            teamMedia.innerHTML = svgFallbacks.team;
            teamPhoto.style.display = 'none';
        }
        
        // Handle trophy model
        const trophyContainer = clone.querySelector('.trophy-container');
        
        // Check if we have a trophy model URL
        if (state.selectedTeam.trophy_model_url) {
            // Replace placeholder with actual 3D model viewer
            trophyContainer.innerHTML = `
                <h3>Championship Trophy</h3>
                <div class="trophy-model-container">
                    <button class="expand-trophy-btn"><i class="fas fa-expand"></i></button>
                    <iframe class="trophy-model" src="https://modelviewer.dev/shared/glft-viewer.html#load=${encodeURIComponent(state.selectedTeam.trophy_model_url)}" frameborder="0" allowfullscreen></iframe>
                </div>
            `;
            
            // Add expand button functionality
            const expandBtn = trophyContainer.querySelector('.expand-trophy-btn');
            expandBtn.addEventListener('click', () => {
                const trophyModal = document.querySelector('.trophy-modal');
                const modalIframe = trophyModal.querySelector('.modal-trophy-model');
                modalIframe.src = `https://modelviewer.dev/shared/glft-viewer.html#load=${encodeURIComponent(state.selectedTeam.trophy_model_url)}`;
                trophyModal.style.display = 'flex';
            });
        } else {
            // Use the trophy placeholder with SVG
            trophyContainer.innerHTML = `
                <h3>Championship Trophy</h3>
                <div class="trophy-placeholder">
                    ${svgFallbacks.trophy}
                    <p>3D Trophy Model not available</p>
                </div>
            `;
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
        players.forEach(player => {
            const playerCard = createPlayerCard(player);
            rosterGrid.appendChild(playerCard);
        });
        
        // Handle grid with few items
        handleFewGridItems(rosterGrid, players);
        
        contentContainer.appendChild(clone);
    }

    function createPlayerCard(player) {
        const template = document.getElementById('player-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.player-card');
        const cardMedia = clone.querySelector('.card-media');
        const playerImage = clone.querySelector('.player-image');
        const playerName = clone.querySelector('.card-title');
        const playerPosition = clone.querySelector('.player-position');
        const playerNumber = clone.querySelector('.player-number');
        
        // Set image or fallback
        if (player.media_url) {
            playerImage.src = player.media_url;
        } else {
            // Use SVG fallback
            cardMedia.innerHTML = svgFallbacks.player;
            playerImage.style.display = 'none';
        }
        
        playerImage.alt = player.name;
        playerName.textContent = player.name;
        playerPosition.textContent = player.position || '';
        playerNumber.textContent = player.number ? `#${player.number}` : '';
        
        // Apply school colors
        cardElement.style.borderColor = state.selectedSchool.primary_color || '#00205B';
        
        // Add click event
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
        
        // Set player details
        clone.querySelector('.player-photo').src = player.media_url || '/placeholder-player.png';
        clone.querySelector('.player-name').textContent = player.name;
        
        const numberPosition = clone.querySelector('.player-number-position');
        if (player.number && player.position) {
            numberPosition.textContent = `#${player.number} - ${player.position}`;
        } else if (player.number) {
            numberPosition.textContent = `#${player.number}`;
        } else if (player.position) {
            numberPosition.textContent = player.position;
        } else {
            numberPosition.style.display = 'none';
        }
        
        clone.querySelector('.player-team').textContent = 
            `${state.selectedSchool.name} ${state.selectedSport} (${state.selectedYear})`;
        
        // Create stats cards
        const statsGrid = clone.querySelector('.stats-grid');
        
        // Check for basketball stats
        if (player.assists) {
            addStatCard(statsGrid, player.assists, 'Assists');
        }
        if (player.rebounds) {
            addStatCard(statsGrid, player.rebounds, 'Rebounds');
        }
        if (player.points_per_game) {
            addStatCard(statsGrid, player.points_per_game, 'PPG');
        }
        
        // Check for football stats
        if (player.passing_yards) {
            addStatCard(statsGrid, player.passing_yards, 'Passing Yards');
        }
        if (player.touchdowns) {
            addStatCard(statsGrid, player.touchdowns, 'Touchdowns');
        }
        if (player.completion_percentage) {
            addStatCard(statsGrid, player.completion_percentage, 'Completion %');
        }
        
        // Check for other stats
        if (player.other_stat_name && player.other_stat_value) {
            addStatCard(statsGrid, player.other_stat_value, player.other_stat_name);
        }
        
        contentContainer.appendChild(clone);
    }

    function addStatCard(container, value, label) {
        const statCard = document.createElement('div');
        statCard.className = 'stat-card';
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = value;
        
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
        
        const athletesGrid = clone.querySelector('#athletes-grid');
        
        // Get athletes of specified type for the selected school
        const athletes = state.individuals.filter(individual => 
            individual.school_name === state.selectedSchool.name && 
            individual.type === athleteType
        );
        
        athletes.forEach(athlete => {
            const athleteCard = createAthleteCard(athlete);
            athletesGrid.appendChild(athleteCard);
        });
        
        // Handle grid with few items
        handleFewGridItems(athletesGrid, athletes);
        
        contentContainer.appendChild(clone);
    }

    function createAthleteCard(athlete) {
        const template = document.getElementById('athlete-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.athlete-card');
        const cardMedia = clone.querySelector('.card-media');
        const athleteImage = clone.querySelector('.athlete-image');
        const athleteName = clone.querySelector('.card-title');
        const athleteGraduation = clone.querySelector('.athlete-graduation');
        const athleteSport = clone.querySelector('.athlete-sport');
        const athleteAffiliation = clone.querySelector('.athlete-affiliation');
        
        // Set image or fallback
        if (athlete.media_url) {
            athleteImage.src = athlete.media_url;
        } else {
            // Use SVG fallback
            cardMedia.innerHTML = svgFallbacks.athlete;
            athleteImage.style.display = 'none';
        }
        
        athleteImage.alt = athlete.name;
        athleteName.textContent = athlete.name;
        
        if (athlete.graduation_year) {
            athleteGraduation.textContent = `Class of ${athlete.graduation_year}`;
        } else {
            athleteGraduation.style.display = 'none';
        }
        
        if (athlete.sport) {
            athleteSport.textContent = athlete.sport;
        } else {
            athleteSport.style.display = 'none';
        }
        
        if (athlete.type === 'd1_athlete' && athlete.college) {
            athleteAffiliation.textContent = athlete.college;
        } else if (athlete.type === 'pro_athlete' && athlete.professional_team) {
            athleteAffiliation.textContent = athlete.professional_team;
        } else {
            athleteAffiliation.style.display = 'none';
        }
        
        // Apply school colors
        cardElement.style.borderColor = state.selectedSchool.primary_color || '#00205B';
        
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
        
        // Set athlete details
        clone.querySelector('.athlete-photo').src = athlete.media_url || '/placeholder-athlete.png';
        clone.querySelector('.athlete-name').textContent = athlete.name;
        
        if (athlete.graduation_year) {
            clone.querySelector('.athlete-graduation').textContent = `Class of ${athlete.graduation_year}`;
        } else {
            clone.querySelector('.athlete-graduation').style.display = 'none';
        }
        
        if (athlete.sport) {
            clone.querySelector('.athlete-sport').textContent = athlete.sport;
        } else {
            clone.querySelector('.athlete-sport').style.display = 'none';
        }
        
        if (athlete.type === 'd1_athlete' && athlete.college) {
            clone.querySelector('.athlete-affiliation').textContent = athlete.college;
        } else if (athlete.type === 'pro_athlete' && athlete.professional_team) {
            clone.querySelector('.athlete-affiliation').textContent = athlete.professional_team;
        } else {
            clone.querySelector('.athlete-affiliation').style.display = 'none';
        }
        
        // Create athlete description
        const descriptionContainer = clone.querySelector('.athlete-description');
        
        // Build description based on available data
        let description = document.createElement('p');
        
        if (athlete.type === 'd1_athlete') {
            description.textContent = `${athlete.name} is a Division 1 athlete from ${state.selectedSchool.name} who graduated in ${athlete.graduation_year}. They currently compete in ${athlete.sport} at ${athlete.college}.`;
        } else if (athlete.type === 'pro_athlete') {
            description.textContent = `${athlete.name} is a professional athlete who graduated from ${state.selectedSchool.name} in ${athlete.graduation_year}. They play ${athlete.sport} professionally for ${athlete.professional_team}.`;
        }
        
        descriptionContainer.appendChild(description);
        
        contentContainer.appendChild(clone);
    }

    // Utility Functions
    function showLoading(show) {
        loadingSpinner.style.display = show ? 'flex' : 'none';
        contentContainer.style.display = show ? 'none' : 'block';
    }
    
    // Handle image loading errors by providing fallbacks
    function setupImageFallbacks() {
        document.querySelectorAll('img').forEach(img => {
            img.onerror = function() {
                const alt = this.alt || '';
                const parentElement = this.parentNode;
                
                // Remove the image
                this.style.display = 'none';
                
                // Determine appropriate fallback based on image type
                if (alt.includes('School') || this.classList.contains('card-image')) {
                    if (!parentElement.querySelector('svg')) {
                        parentElement.innerHTML += svgFallbacks.school;
                    }
                } else if (alt.includes('Team') || this.classList.contains('team-photo')) {
                    if (!parentElement.querySelector('svg')) {
                        parentElement.innerHTML += svgFallbacks.team;
                    }
                } else if (alt.includes('Player') || this.classList.contains('player-image') || this.classList.contains('player-photo')) {
                    if (!parentElement.querySelector('svg')) {
                        // Choose sport-specific silhouette if possible
                        const sportSpecificSVG = getSportSpecificPlayerSVG();
                        parentElement.innerHTML += sportSpecificSVG;
                    }
                } else if (alt.includes('Athlete') || this.classList.contains('athlete-image') || this.classList.contains('athlete-photo')) {
                    if (!parentElement.querySelector('svg')) {
                        parentElement.innerHTML += svgFallbacks.athlete;
                    }
                } else {
                    if (!parentElement.querySelector('svg')) {
                        parentElement.innerHTML += svgFallbacks.trophy;
                    }
                }
                
                // Remove onerror to prevent potential loops
                this.onerror = null;
            };
        });
    }

    // Helper function to get sport-specific player SVG
    function getSportSpecificPlayerSVG() {
        // Default to generic player
        if (!state.selectedSport) return svgFallbacks.player;
        
        const sportName = state.selectedSport.toLowerCase();
        
        // Check if it's a women's/girls team to determine gender
        const isFemale = sportName.includes('women') || 
                        sportName.includes('girls') || 
                        sportName.includes('female') ||
                        sportName.includes('volleyball'); // Default volleyball to female
                        
        // Now determine which sport
        if (sportName.includes('basketball')) {
            return isFemale ? svgFallbacks.basketballFemale : svgFallbacks.basketballMale;
        } else if (sportName.includes('football')) {
            return svgFallbacks.footballPlayer;
        } else if (sportName.includes('baseball') || sportName.includes('softball')) {
            return isFemale ? svgFallbacks.baseballFemale : svgFallbacks.baseballMale;
        } else if (sportName.includes('soccer')) {
            return isFemale ? svgFallbacks.soccerFemale : svgFallbacks.soccerMale;
        } else if (sportName.includes('track') || sportName.includes('cross country')) {
            return isFemale ? svgFallbacks.trackFemale : svgFallbacks.trackMale;
        } else if (sportName.includes('volleyball')) {
            return isFemale ? svgFallbacks.volleyballFemale : svgFallbacks.volleyballMale;
        } else if (sportName.includes('wrestling')) {
            return svgFallbacks.wrestlingPlayer;
        } else if (sportName.includes('swim')) {
            return isFemale ? svgFallbacks.swimmingFemale : svgFallbacks.swimmingMale;
        }
        
        // If no specific sport match, use general gender-based silhouette
        return isFemale ? svgFallbacks.playerFemale : svgFallbacks.playerMale;
    }

    // Initialize the application
    init();
});