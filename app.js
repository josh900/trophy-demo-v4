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

    // Sport Icons Mapping
    const sportIcons = {
        "Men's Basketball": "fa-basketball-ball",
        "Women's Basketball": "fa-basketball-ball",
        "Football": "fa-football-ball",
        "Baseball": "fa-baseball-ball",
        "Women's Softball": "fa-baseball-ball",
        "Wrestling": "fa-user-ninja",
        "Lacrosse": "fa-hockey-stick",
        "Women's Track & Field": "fa-running",
        "Men's Track & Field": "fa-running"
    };

    // Initialize the application
    async function init() {
        // Set up event listeners
        backButton.addEventListener('click', navigateBack);
        homeButton.addEventListener('click', navigateHome);

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
            const response = await fetch('/api/schools');
            if (!response.ok) throw new Error(`Server responded with ${response.status}`);
            const data = await response.json();
            state.schools = data.data || [];
            return data;
        } catch (error) {
            console.error('Error fetching schools:', error);
            throw error;
        }
    }

    async function fetchTeams() {
        try {
            const response = await fetch('/api/teams');
            if (!response.ok) throw new Error(`Server responded with ${response.status}`);
            const data = await response.json();
            state.teams = data.data || [];
            return data;
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
        }
    }

    async function fetchIndividuals() {
        try {
            const response = await fetch('/api/individuals');
            if (!response.ok) throw new Error(`Server responded with ${response.status}`);
            const data = await response.json();
            state.individuals = data.data || [];
            return data;
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

    // View Rendering Functions
    function renderView(viewName) {
        // Clear the content container
        contentContainer.innerHTML = '';
        
        // Render the appropriate view
        switch (viewName) {
            case 'schools':
                renderSchoolsView();
                break;
            case 'categories':
                renderCategoriesView();
                break;
            case 'sports':
                renderSportsView();
                break;
            case 'years':
                renderYearsView();
                break;
            case 'team-detail':
                renderTeamDetailView();
                break;
            case 'player-detail':
                renderPlayerDetailView();
                break;
            case 'd1-athletes':
                renderD1AthletesView();
                break;
            case 'pro-athletes':
                renderProAthletesView();
                break;
            case 'athlete-detail':
                renderAthleteDetailView();
                break;
            default:
                console.error('Unknown view:', viewName);
                renderSchoolsView(); // Fallback to schools view
        }

        // Update back button visibility
        backButton.style.display = state.navigationHistory.length > 0 ? 'flex' : 'none';
        
        // Set up image fallbacks for all images in the current view
        setTimeout(setupImageFallbacks, 100); // Small delay to ensure all images are in the DOM
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
        const cardImage = clone.querySelector('.card-image');
        const cardTitle = clone.querySelector('.card-title');
        
        // Set school card styles based on school colors
        cardElement.style.borderColor = school.primary_color;
        
        cardImage.src = school.media_url || '/placeholder-school.png';
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
            cardMedia.style.backgroundColor = state.selectedSchool.primary_color;
            card.querySelector('i').style.color = state.selectedSchool.secondary_color;
            
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
        
        contentContainer.appendChild(clone);
    }

    function createSportCard(sport) {
        const template = document.getElementById('sport-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.sport-card');
        const iconElement = clone.querySelector('.card-media i');
        const titleElement = clone.querySelector('.card-title');
        
        // Set icon and title
        iconElement.classList.add(sportIcons[sport] || 'fa-trophy');
        titleElement.textContent = sport;
        
        // Apply school colors
        iconElement.style.color = state.selectedSchool.secondary_color;
        
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
        cardElement.style.backgroundColor = state.selectedSchool.primary_color;
        titleElement.style.color = state.selectedSchool.secondary_color;
        
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
        
        // Set team details
        clone.querySelector('.team-title').textContent = 
            `${state.selectedSchool.name} ${state.selectedSport} (${state.selectedYear})`;
        clone.querySelector('.team-achievement').textContent = state.selectedTeam.achievement;
        
        // Set team photo
        const teamPhoto = clone.querySelector('.team-photo');
        teamPhoto.src = state.selectedTeam.team_photo_url || '/placeholder-team.png';
        teamPhoto.alt = `${state.selectedSchool.name} ${state.selectedSport} Team ${state.selectedYear}`;
        
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
        
        contentContainer.appendChild(clone);
    }

    function createPlayerCard(player) {
        const template = document.getElementById('player-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.player-card');
        const playerImage = clone.querySelector('.player-image');
        const playerName = clone.querySelector('.card-title');
        const playerPosition = clone.querySelector('.player-position');
        const playerNumber = clone.querySelector('.player-number');
        
        playerImage.src = player.media_url || '/placeholder-player.png';
        playerImage.alt = player.name;
        playerName.textContent = player.name;
        playerPosition.textContent = player.position || '';
        playerNumber.textContent = player.number ? `#${player.number}` : '';
        
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
        
        contentContainer.appendChild(clone);
    }

    function createAthleteCard(athlete) {
        const template = document.getElementById('athlete-card-template');
        const clone = template.content.cloneNode(true);
        
        const cardElement = clone.querySelector('.athlete-card');
        const athleteImage = clone.querySelector('.athlete-image');
        const athleteName = clone.querySelector('.card-title');
        const athleteGraduation = clone.querySelector('.athlete-graduation');
        const athleteSport = clone.querySelector('.athlete-sport');
        const athleteAffiliation = clone.querySelector('.athlete-affiliation');
        
        athleteImage.src = athlete.media_url || '/placeholder-athlete.png';
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
                
                // Determine appropriate fallback based on image type
                if (alt.includes('School') || this.classList.contains('card-image')) {
                    this.src = 'https://via.placeholder.com/400x300/00205B/EFBF04?text=School';
                } else if (alt.includes('Team') || this.classList.contains('team-photo')) {
                    this.src = 'https://via.placeholder.com/800x500/00205B/EFBF04?text=Team+Photo';
                } else if (alt.includes('Player') || this.classList.contains('player-image') || this.classList.contains('player-photo')) {
                    this.src = 'https://via.placeholder.com/300x300/00205B/EFBF04?text=Player';
                } else if (alt.includes('Athlete') || this.classList.contains('athlete-image') || this.classList.contains('athlete-photo')) {
                    this.src = 'https://via.placeholder.com/300x300/00205B/EFBF04?text=Athlete';
                } else {
                    this.src = 'https://via.placeholder.com/400x300/00205B/EFBF04?text=Saginaw';
                }
                
                // Remove onerror to prevent potential loops
                this.onerror = null;
            };
        });
    }

    // Initialize the application
    init();
});