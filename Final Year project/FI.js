        // Sample data for the application
        const sampleParticipants = [
            { id: 1, name: "Alex Johnson", email: "alex@example.com", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
            { id: 2, name: "Maria Garcia", email: "maria@example.com", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
            { id: 3, name: "David Smith", email: "david@example.com", avatar: "https://randomuser.me/api/portraits/men/62.jpg" },
            { id: 4, name: "Sarah Williams", email: "sarah@example.com", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
            { id: 5, name: "James Brown", email: "james@example.com", avatar: "https://randomuser.me/api/portraits/men/86.jpg" },
            { id: 6, name: "Emma Davis", email: "emma@example.com", avatar: "https://randomuser.me/api/portraits/women/65.jpg" },
            { id: 7, name: "Michael Wilson", email: "michael@example.com", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
            { id: 8, name: "Olivia Martinez", email: "olivia@example.com", avatar: "https://randomuser.me/api/portraits/women/26.jpg" }
        ];

        let sessions = [
            {
                id: 1,
                name: "Computer Organization and Design",
                date: "2024-06-15T10:00",
                type: "Class",
                location: "Control Lab",
                description: "This Class is for BECE5 and BETE5 students",
                participants: 21,
                attended: 20,
                status: "active"
            },
            {
                id: 2,
                name: "Digital Signal Processing",
                date: "2025-06-14T14:30",
                type: "Class",
                location: "E224",
                description: "BECE4 and BETE4 students will attend this class",
                participants: 22,
                attended: 18,
                status: "completed"
            },
            {
                id: 3,
                name: "Electrical Circuits Workshop",
                date: "2025-06-10T09:00",
                type: "Workshop",
                location: "T6 B",
                description: "Hands-on workshop on electrical circuits",
                participants: 35,
                attended: 32,
                status: "completed"
            },
            {
                id: 4,
                name: "Linear Electronics",
                date: "2025-06-20T13:00",
                type: "Class",
                location: "E225",
                description: "BEEE3, BECE3 and BETE3 students will attend this class",
                participants: 45,
                attended: 0,
                status: "pending"
            },
            {
                id: 5,
                name: "SOFTWARE ENGINEERING",
                date: "2025-06-22T09:30",
                type: "Class",
                location: "NT 13",
                description: "Introduction to software engineering principles",
                participants: 8,
                attended: 0,
                status: "pending"
            }
        ];

        let currentSessionId = null;
        let attendanceData = {};

        // DOM Elements
        const sessionModal = document.getElementById('sessionModal');
        const attendanceModal = document.getElementById('attendanceModal');
        const createSessionBtn = document.getElementById('createSessionBtn');
        const saveSessionBtn = document.getElementById('saveSessionBtn');
        const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
        const sessionSearch = document.getElementById('sessionSearch');
        const sessionsBody = document.getElementById('sessionsBody');
        const participantsContainer = document.getElementById('participantsContainer');
        const attendanceModalTitle = document.getElementById('attendanceModalTitle');
        const closeModalBtns = document.querySelectorAll('.close-modal');

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize charts
            initCharts();
            
            // Populate sessions table
            renderSessions();
            
            // Update dashboard stats
            updateDashboardStats();
            
            // Event listeners
            setupEventListeners();
        });

        // Initialize charts
        function initCharts() {
            // Line Chart
            const lineCtx = document.getElementById('attendanceChart').getContext('2d');
            const lineChart = new Chart(lineCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Attendance Rate',
                        data: [85, 92, 78, 88, 94, 65, 70],
                        borderColor: '#4cc9f0',
                        backgroundColor: 'rgba(76, 201, 240, 0.1)',
                        borderWidth: 3,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: 50,
                            max: 100,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: '#8d99ae'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#8d99ae'
                            }
                        }
                    }
                }
            });

            // Pie Chart
            const pieCtx = document.getElementById('attendancePie').getContext('2d');
            const pieChart = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Present', 'Late', 'Absent', 'Excused'],
                    datasets: [{
                        data: [72, 12, 10, 6],
                        backgroundColor: [
                            '#4cc9f0',
                            '#4361ee',
                            '#f72585',
                            '#8d99ae'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#f8f9fa',
                                padding: 20,
                                font: {
                                    size: 14
                                }
                            }
                        }
                    },
                    cutout: '65%'
                }
            });
        }

        // Render sessions table
        function renderSessions() {
            sessionsBody.innerHTML = '';
            
            sessions.forEach(session => {
                const row = document.createElement('tr');
                
                // Format date
                const sessionDate = new Date(session.date);
                const formattedDate = sessionDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                });
                
                // Status display
                let statusClass = '';
                let statusText = '';
                if (session.status === 'active') {
                    statusClass = 'active';
                    statusText = 'Active';
                } else if (session.status === 'completed') {
                    statusClass = 'completed';
                    statusText = 'Completed';
                } else {
                    statusClass = 'pending';
                    statusText = 'Scheduled';
                }
                
                row.innerHTML = `
                    <td>${session.name}</td>
                    <td>${formattedDate}</td>
                    <td>${session.attended || 0}/${session.participants}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="action-btn edit-session" data-id="${session.id}" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn take-attendance" data-id="${session.id}" title="Take Attendance"><i class="fas fa-user-check"></i></button>
                        <button class="action-btn delete-session" data-id="${session.id}" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                sessionsBody.appendChild(row);
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.edit-session').forEach(btn => {
                btn.addEventListener('click', function() {
                    const sessionId = this.getAttribute('data-id');
                    editSession(sessionId);
                });
            });
            
            document.querySelectorAll('.take-attendance').forEach(btn => {
                btn.addEventListener('click', function() {
                    const sessionId = this.getAttribute('data-id');
                    takeAttendance(sessionId);
                });
            });
            
            document.querySelectorAll('.delete-session').forEach(btn => {
                btn.addEventListener('click', function() {
                    const sessionId = this.getAttribute('data-id');
                    deleteSession(sessionId);
                });
            });
        }

        // Update dashboard statistics
        function updateDashboardStats() {
            document.getElementById('totalSessions').textContent = sessions.length;
            
            // Calculate total participants
            const uniqueParticipants = new Set();
            sessions.forEach(session => {
                // In a real app, we would have actual participant IDs
                uniqueParticipants.add(`session-${session.id}`);
            });
            document.getElementById('totalParticipants').textContent = uniqueParticipants.size;
            
            // Calculate average attendance
            let totalAttendance = 0;
            let totalPossible = 0;
            
            sessions.forEach(session => {
                if (session.attended && session.participants) {
                    totalAttendance += session.attended;
                    totalPossible += session.participants;
                }
            });
            
            const avgRate = totalPossible > 0 ? (totalAttendance / totalPossible * 100).toFixed(1) : 0;
            document.getElementById('attendanceRate').textContent = `${avgRate}%`;
            
            // Count active sessions
            const activeSessions = sessions.filter(session => session.status === 'active').length;
            document.getElementById('activeSessions').textContent = activeSessions;
        }

        // Setup event listeners
        function setupEventListeners() {
            // Modal handling
            createSessionBtn.addEventListener('click', () => {
                sessionModal.style.display = 'flex';
            });
            
            saveSessionBtn.addEventListener('click', createSession);
            
            closeModalBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    sessionModal.style.display = 'none';
                    attendanceModal.style.display = 'none';
                });
            });
            
            window.addEventListener('click', (e) => {
                if (e.target === sessionModal) {
                    sessionModal.style.display = 'none';
                }
                if (e.target === attendanceModal) {
                    attendanceModal.style.display = 'none';
                }
            });
            
            // Session search
            sessionSearch.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const filteredSessions = sessions.filter(session => 
                    session.name.toLowerCase().includes(searchTerm) || 
                    session.description.toLowerCase().includes(searchTerm)
                );
                
                // Re-render table with filtered sessions
                if (searchTerm === '') {
                    renderSessions();
                } else {
                    renderFilteredSessions(filteredSessions);
                }
            });
            
            // Save attendance button
            saveAttendanceBtn.addEventListener('click', saveAttendance);
        }

        // Create new session
        function createSession() {
            const name = document.getElementById('sessionName').value;
            const date = document.getElementById('sessionDate').value;
            const type = document.getElementById('sessionType').value;
            const location = document.getElementById('sessionLocation').value;
            const description = document.getElementById('sessionDescription').value;
            
            if (!name || !date) {
                alert('Please fill in required fields: Session Name and Date');
                return;
            }
            
            const newSession = {
                id: sessions.length + 1,
                name,
                date,
                type,
                location,
                description,
                participants: 0,
                attended: 0,
                status: "pending"
            };
            
            sessions.push(newSession);
            renderSessions();
            updateDashboardStats();
            sessionModal.style.display = 'none';
            
            // Reset form
            document.getElementById('sessionName').value = '';
            document.getElementById('sessionDate').value = '';
            document.getElementById('sessionType').value = 'Meeting';
            document.getElementById('sessionLocation').value = '';
            document.getElementById('sessionDescription').value = '';
        }

        // Edit session
        function editSession(sessionId) {
            const session = sessions.find(s => s.id == sessionId);
            if (session) {
                document.getElementById('sessionName').value = session.name;
                document.getElementById('sessionDate').value = session.date;
                document.getElementById('sessionType').value = session.type;
                document.getElementById('sessionLocation').value = session.location;
                document.getElementById('sessionDescription').value = session.description;
                
                sessionModal.style.display = 'flex';
                
                // Change button to update
                saveSessionBtn.textContent = "Update Session";
                saveSessionBtn.onclick = function() {
                    updateSession(sessionId);
                };
            }
        }

        // Update session
        function updateSession(sessionId) {
            const session = sessions.find(s => s.id == sessionId);
            if (session) {
                session.name = document.getElementById('sessionName').value;
                session.date = document.getElementById('sessionDate').value;
                session.type = document.getElementById('sessionType').value;
                session.location = document.getElementById('sessionLocation').value;
                session.description = document.getElementById('sessionDescription').value;
                
                renderSessions();
                sessionModal.style.display = 'none';
                
                // Reset button to create
                saveSessionBtn.textContent = "Create Session";
                saveSessionBtn.onclick = createSession;
            }
        }

        // Delete session
        function deleteSession(sessionId) {
            if (confirm('Are you sure you want to delete this session?')) {
                sessions = sessions.filter(s => s.id != sessionId);
                renderSessions();
                updateDashboardStats();
            }
        }

        // Take attendance
        function takeAttendance(sessionId) {
            currentSessionId = sessionId;
            const session = sessions.find(s => s.id == sessionId);
            
            if (session) {
                attendanceModalTitle.textContent = `Mark Attendance: ${session.name}`;
                
                // Clear previous attendance data
                participantsContainer.innerHTML = '';
                
                // Initialize attendance data for this session
                if (!attendanceData[sessionId]) {
                    attendanceData[sessionId] = {};
                }
                
                // Render participant cards
                sampleParticipants.forEach(participant => {
                    const card = document.createElement('div');
                    card.className = 'participant-card';
                    card.dataset.id = participant.id;
                    
                    // Check if attendance has been marked for this participant
                    const isPresent = attendanceData[sessionId][participant.id] === 'present';
                    
                    if (isPresent) {
                        card.classList.add('present');
                    }
                    
                    card.innerHTML = `
                        <img src="${participant.avatar}" alt="${participant.name}">
                        <h4>${participant.name}</h4>
                        <div class="status-indicator ${isPresent ? 'status-present' : 'status-absent'}">
                            ${isPresent ? 'Present' : 'Absent'}
                        </div>
                    `;
                    
                    card.addEventListener('click', function() {
                        const participantId = this.dataset.id;
                        const currentStatus = attendanceData[sessionId][participantId];
                        
                        if (currentStatus === 'present') {
                            attendanceData[sessionId][participantId] = 'absent';
                            this.classList.remove('present');
                            this.classList.add('absent');
                            this.querySelector('.status-indicator').className = 'status-indicator status-absent';
                            this.querySelector('.status-indicator').textContent = 'Absent';
                        } else {
                            attendanceData[sessionId][participantId] = 'present';
                            this.classList.remove('absent');
                            this.classList.add('present');
                            this.querySelector('.status-indicator').className = 'status-indicator status-present';
                            this.querySelector('.status-indicator').textContent = 'Present';
                        }
                    });
                    
                    participantsContainer.appendChild(card);
                });
                
                attendanceModal.style.display = 'flex';
            }
        }

        // Save attendance
        function saveAttendance() {
            if (currentSessionId) {
                const session = sessions.find(s => s.id == currentSessionId);
                if (session) {
                    // Count presents and absents
                    const attendance = attendanceData[currentSessionId];
                    let presentCount = 0;
                    let totalCount = 0;
                    
                    for (const participantId in attendance) {
                        if (attendance[participantId] === 'present') {
                            presentCount++;
                        }
                        totalCount++;
                    }
                    
                    // Update session data
                    session.attended = presentCount;
                    session.participants = totalCount;
                    session.status = "completed";
                    
                    // Update UI
                    renderSessions();
                    updateDashboardStats();
                    attendanceModal.style.display = 'none';
                    
                    alert(`Attendance saved successfully: ${presentCount} present, ${totalCount - presentCount} absent`);
                }
            }
        }

        // Render filtered sessions
        function renderFilteredSessions(filteredSessions) {
            sessionsBody.innerHTML = '';
            
            filteredSessions.forEach(session => {
                const row = document.createElement('tr');
                
                // Format date
                const sessionDate = new Date(session.date);
                const formattedDate = sessionDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                });
                
                // Status display
                let statusClass = '';
                let statusText = '';
                if (session.status === 'active') {
                    statusClass = 'active';
                    statusText = 'Active';
                } else if (session.status === 'completed') {
                    statusClass = 'completed';
                    statusText = 'Completed';
                } else {
                    statusClass = 'pending';
                    statusText = 'Scheduled';
                }
                
                row.innerHTML = `
                    <td>${session.name}</td>
                    <td>${formattedDate}</td>
                    <td>${session.attended || 0}/${session.participants}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="action-btn edit-session" data-id="${session.id}" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn take-attendance" data-id="${session.id}" title="Take Attendance"><i class="fas fa-user-check"></i></button>
                        <button class="action-btn delete-session" data-id="${session.id}" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                
                sessionsBody.appendChild(row);
            });
            
            // Reattach event listeners
            document.querySelectorAll('.edit-session').forEach(btn => {
                btn.addEventListener('click', function() {
                    const sessionId = this.getAttribute('data-id');
                    editSession(sessionId);
                });
            });
            
            document.querySelectorAll('.take-attendance').forEach(btn => {
                btn.addEventListener('click', function() {
                    const sessionId = this.getAttribute('data-id');
                    takeAttendance(sessionId);
                });
            });
            
            document.querySelectorAll('.delete-session').forEach(btn => {
                btn.addEventListener('click', function() {
                    const sessionId = this.getAttribute('data-id');
                    deleteSession(sessionId);
                });
            });
        }