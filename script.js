document.addEventListener('DOMContentLoaded', () => {
    // Animated Fitness Background Injection
    const bgContainer = document.getElementById('bg-animation');
    if(bgContainer) {
        const fitnessIcons = ['dumbbell', 'activity', 'heart', 'flame', 'zap', 'target', 'person-standing'];
        for(let i=0; i<20; i++) {
            const el = document.createElement('div');
            const randomIcon = fitnessIcons[Math.floor(Math.random() * fitnessIcons.length)];
            el.className = 'floating-fitness-icon';
            el.innerHTML = `<i data-lucide="${randomIcon}"></i>`;
            
            // Randomize styling
            const size = Math.random() * 40 + 30; // 30px to 70px
            el.style.left = `${Math.random() * 100}vw`;
            el.style.top = `${Math.random() * 100}vh`;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.animationDuration = `${Math.random() * 30 + 20}s`;
            el.style.animationDelay = `-${Math.random() * 20}s`;
            
            bgContainer.appendChild(el);
        }
    }
    lucide.createIcons();

    // 1. Onboarding Flow & User Global State
    const onboardingOverlay = document.getElementById('onboarding-overlay');
    const onboardingForm = document.getElementById('onboarding-form');
    let userData = { name: 'Alex', age: 25, gender: 'male', weight: 75, height: 180, goal: 'maintain', trainingMode: 'gym', bmi: 0, bmr: 0, tdee: 0, macros: {} };

    // Isolated Fullscreen Initialization Gateway
    document.querySelector('.app-layout').style.display = 'none';
    setTimeout(() => { onboardingOverlay.classList.add('active'); }, 500);

    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            userData.name = document.getElementById('ob-name').value || 'User';
            userData.age = parseInt(document.getElementById('ob-age').value);
            userData.gender = document.getElementById('ob-gender').value;
            userData.weight = parseFloat(document.getElementById('ob-weight').value);
            userData.height = parseFloat(document.getElementById('ob-height').value);
            const obGoalNode = document.querySelector('input[name="ob-goal"]:checked');
            userData.goal = obGoalNode ? obGoalNode.value : 'maintain';
            const obModeNode = document.querySelector('input[name="ob-mode"]:checked');
            userData.trainingMode = obModeNode ? obModeNode.value : 'gym';

            // Compute Base Metrics
            const heightM = userData.height / 100;
            userData.bmi = (userData.weight / (heightM * heightM)).toFixed(1);
            let bmrBase = (10 * userData.weight) + (6.25 * userData.height) - (5 * userData.age);
            userData.bmr = userData.gender === 'male' ? Math.round(bmrBase + 5) : Math.round(bmrBase - 161);
            userData.tdee = Math.round(userData.bmr * 1.55); // Default multi

            // Update UI Globals
            document.getElementById('welcome-text').textContent = `Welcome, ${userData.name}`;
            document.getElementById('sidebar-name').textContent = userData.name;
            document.getElementById('prof-name').textContent = userData.name;
            document.getElementById('prof-fname').value = userData.name;

            // Load 3D Model logic
            const anatomyImg = document.getElementById('anatomy-vis');
            if(anatomyImg) anatomyImg.src = userData.gender === 'female' ? 'female-3d.png' : 'male-3d.png';
            
            // Dynamic Theme Recolor Array (Light Mode Iteration)
            if(userData.gender === 'female') {
                document.documentElement.style.setProperty('--clr-neon-blue', '#db2777'); // Pink
                document.documentElement.style.setProperty('--clr-neon-purple', '#9333ea'); // Purple
            } else {
                document.documentElement.style.setProperty('--clr-neon-blue', '#2563eb'); // Royal Blue
                document.documentElement.style.setProperty('--clr-neon-purple', '#7c3aed'); // Deep Purple
            }

            const btn = onboardingForm.querySelector('.init-btn');
            btn.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Initializing...`;
            lucide.createIcons();

            // Simulate AI Authentication / Engine Delay & Mount Application Workspace
            setTimeout(() => {
                onboardingOverlay.classList.remove('active');
                setTimeout(() => { onboardingOverlay.style.display = 'none'; }, 500);
                
                const appLayout = document.querySelector('.app-layout');
                appLayout.style.display = 'flex';
                
                // Hardware-accelerated Reflow logic to initialize Dashboard fading
                void appLayout.offsetWidth; 
                appLayout.style.opacity = '1';

                updateDashboardMetrics(userData);
                showToast(`Biometric Profile initialized for ${userData.name}. Engine ready.`);
            }, 800);
            
            showToast(`Biometric Profile initialized for ${userData.name}. Engine ready.`);
            
            // Auto inject to form
            document.getElementById('weight').value = userData.weight;
            document.getElementById('height').value = userData.height;
        });
    }

    function updateDashboardMetrics(data) {
        document.getElementById('display-bmi').textContent = data.bmi || '--';
        document.getElementById('display-bmr').textContent = data.bmr ? data.bmr.toLocaleString() : '--';
        document.getElementById('display-tdee').textContent = data.tdee ? data.tdee.toLocaleString() : '--';

        const bmiBadge = document.getElementById('bmi-status');
        if (data.bmi > 0) {
            let status = 'Optimal System'; let colorClass = 'text-neon-green';
            if (data.bmi < 18.5) { status = 'Low Mass Deficit'; colorClass = 'text-neon-purple'; }
            else if (data.bmi > 25) { status = 'Energy Surplus'; colorClass = 'text-neon-blue'; }
            bmiBadge.textContent = status;
            bmiBadge.className = `badge badge-neutral mt-2 ${colorClass}`;
        }

        // Update SVG Analytics Pie Chart
        if (data.tdee > 0) {
            document.getElementById('pie-total-cals').textContent = data.tdee.toLocaleString();
            
            let proSplit = 30, carSplit = 50, fatSplit = 20;
            if(data.goal === 'cut') { proSplit=40; carSplit=30; fatSplit=30; }
            if(data.goal === 'bulk') { proSplit=30; carSplit=50; fatSplit=20; }
            
            let proG = Math.round((data.tdee * (proSplit/100)) / 4);
            let carG = Math.round((data.tdee * (carSplit/100)) / 4);
            let fatG = Math.round((data.tdee * (fatSplit/100)) / 9);

            document.getElementById('dash-protein').textContent = proG + 'g';
            document.getElementById('dash-carbs').textContent = carG + 'g';
            document.getElementById('dash-fats').textContent = fatG + 'g';
            
            const pLbl = document.getElementById('pie-lbl-pro');
            const cLbl = document.getElementById('pie-lbl-car');
            const fLbl = document.getElementById('pie-lbl-fat');
            if(pLbl) pLbl.textContent = `Protein (${proSplit}%)`;
            if(cLbl) cLbl.textContent = `Carbs (${carSplit}%)`;
            if(fLbl) fLbl.textContent = `Fats (${fatSplit}%)`;

            setTimeout(() => {
                const pieP = document.getElementById('pie-protein');
                const pieC = document.getElementById('pie-carbs');
                const pieF = document.getElementById('pie-fats');
                if(pieP) pieP.style.strokeDasharray = `${proSplit}, 100`;
                if(pieC) { pieC.style.strokeDasharray = `${carSplit}, 100`; pieC.style.strokeDashoffset = `-${proSplit}`; }
                if(pieF) { pieF.style.strokeDasharray = `${fatSplit}, 100`; pieF.style.strokeDashoffset = `-${proSplit + carSplit}`; }
            }, 100);
        }
    }

    // Video Player Modal Global Logic
    const closeVideoBtn = document.getElementById('close-video');
    if(closeVideoBtn) {
        closeVideoBtn.addEventListener('click', () => {
            document.getElementById('video-modal').classList.remove('active');
            document.getElementById('video-player').src = "";
        });
    }

    // 2. Navigation Architecture
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.getElementById('page-title');

    const viewTitles = {
        'dashboard': 'Health Analytics',
        'planner': 'Personalized Planning',
        'anatomy': 'Interactive 3D Muscle Anatomy',
        'diet': 'Diet Recommendation System',
        'scanner': 'Artificial Intelligence Vision',
        'chatbot': 'Neural Interaction (Ria)',
        'profile': 'Profile Manifest',
        'preferences': 'System Customization'
    };

    function switchToView(targetId) {
        if(targetId === 'scanner') startCamera(); else stopCamera();

        navItems.forEach(nav => nav.classList.toggle('active', nav.getAttribute('data-target') === targetId));
        views.forEach(view => view.classList.toggle('active', view.id === targetId));

        if (viewTitles[targetId]) pageTitle.textContent = viewTitles[targetId];
    }

    navItems.forEach(item => item.addEventListener('click', () => switchToView(item.getAttribute('data-target'))));

    // 3. Planner & Schedule Logic
    document.querySelectorAll('.radio-card input').forEach(input => {
        input.addEventListener('change', (e) => {
            document.querySelectorAll('.radio-card').forEach(rc => rc.classList.remove('active'));
            if(e.target.checked) e.target.closest('.radio-card').classList.add('active');
        });
    });

    const plannerForm = document.getElementById('health-form');
    if (plannerForm) {
        plannerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const act = parseFloat(document.getElementById('activity').value);
            const goalBtn = document.querySelector('input[name="goal"]:checked');
            if(goalBtn) userData.goal = goalBtn.value;
            const modeBtn = document.querySelector('input[name="training-mode"]:checked');
            if(modeBtn) userData.trainingMode = modeBtn.value;
            
            // Re-calc specific TDEE
            let tdeeBase = userData.bmr * act;
            if (userData.goal === 'cut') userData.tdee = Math.round(tdeeBase - 500); 
            else if (userData.goal === 'bulk') userData.tdee = Math.round(tdeeBase + 300);
            else userData.tdee = Math.round(tdeeBase);

            userData.macros.protein = Math.round(userData.weight * 2.2); 
            userData.macros.fats = Math.round(userData.weight * 1); 
            userData.macros.carbs = Math.max(0, Math.round((userData.tdee - (userData.macros.protein * 4) - (userData.macros.fats * 9)) / 4));

            document.getElementById('empty-planner').classList.add('hidden');
            document.getElementById('generated-plan').classList.remove('hidden');

            const total = userData.macros.protein + userData.macros.carbs + userData.macros.fats;
            document.getElementById('val-protein').textContent = `${userData.macros.protein}g`;
            document.getElementById('val-carbs').textContent = `${userData.macros.carbs}g`;
            document.getElementById('val-fats').textContent = `${userData.macros.fats}g`;

            setTimeout(() => {
                document.getElementById('fill-protein').style.width = `${(userData.macros.protein / total) * 100}%`;
                document.getElementById('fill-carbs').style.width = `${(userData.macros.carbs / total) * 100}%`;
                document.getElementById('fill-fats').style.width = `${(userData.macros.fats / total) * 100}%`;
            }, 50);

            let schedule = [];
            if (userData.trainingMode === 'yoga') {
                const yogaImgs = [
                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80', // Yoga mat
                    'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&w=800&q=80', // Stretching
                    'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80', // Yoga pose
                    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80', // Meditating
                    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', // Outdoor yoga
                ];
                let texts = (userData.goal === 'cut') 
                    ? ['Power Vinyasa Sequence', 'Core Ashtanga Burn', 'Active Stretch & Walk', 'Hot Flow Session', 'Yin Yoga Recovery', 'Vinyasa II Challenge', 'Full Rest']
                    : ['Hatha Strength Hold', 'Ashtanga Primary Form', 'Restorative Flow', 'Iyengar Props Mastery', 'Vinyasa Power Load', 'Mobility Core Integration', 'Full Rest'];
                
                schedule = texts.map((t, i) => ({ title: t, img: t.includes('Rest') ? yogaImgs[3] : yogaImgs[i % 5], type: 'yoga' }));
            } else {
                const gymImgs = [
                    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80', // Heavy barbell
                    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80', // Gym dark
                    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80', // Battle ropes
                    'https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?auto=format&fit=crop&w=800&q=80', // Bicep curl
                    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80', // Sneakers
                ];
                let texts = (userData.goal === 'cut') 
                    ? ['Neural HIIT Complex', 'Full Body Kinetic', 'Rest Protocol', 'Upper Push Kinetics', 'Lower Pull Strength', 'LISS Cardio Run', 'Full Rest']
                    : ['Chest/Tris Hypertrophy', 'Back/Bis Mass Building', 'Passive Recovery', 'Legs High Volume', 'Shoulders & Delts', 'Arms Axis Pumping', 'Full Rest'];
                
                schedule = texts.map((t, i) => ({ title: t, img: t.includes('Rest') ? gymImgs[4] : gymImgs[i % 4], type: 'gym' }));
            }

            const list = document.getElementById('schedule-list');
            list.innerHTML = '';
            schedule.forEach((dayData, i) => {
                const isRest = dayData.title.includes('Rest');
                // Direct YouTube Search queries mapping exactly to the workout title
                const ytQuery = encodeURIComponent(dayData.title + (dayData.type === 'yoga' ? ' yoga routine' : ' gym workout'));
                const ytLink = `https://www.youtube.com/results?search_query=${ytQuery}`;

                list.innerHTML += `
                <div class="food-card glass-card shadow-lg ${isRest ? 'opacity-50' : ''}" style="display:flex; flex-direction:column;">
                    <div class="food-image relative" style="height: 140px; border-bottom: 2px solid var(--clr-border);">
                        <img src="${dayData.img}" style="width:100%; height:100%; object-fit:cover;">
                        <div class="food-badge ${dayData.type === 'yoga' ? 'bg-purple' : 'bg-blue'} text-white text-xs font-bold uppercase rounded" style="position: absolute; top:8px; left:8px; padding: 3px 6px;">DAY ${i + 1}</div>
                        ${!isRest ? `<a href="${ytLink}" target="_blank" class="position-absolute glow-hover" style="position:absolute; bottom:8px; right:8px; background:var(--clr-neon-blue); color:#000; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer;" title="Watch on YouTube"><i data-lucide="play" style="width:14px; margin-left:2px;"></i></a>` : ''}
                    </div>
                    <div class="food-content p-4" style="flex: 1; display:flex; flex-direction:column;">
                        <h3 class="food-title font-600 mb-1 ${isRest ? 'text-muted' : 'text-neon-blue'}" style="font-size: 1rem;">${dayData.title}</h3>
                        ${isRest ? `<p class="text-xs text-muted mb-3 flex-1">Neurological & Muscular Recovery System.</p>` 
                        : `<p class="text-xs text-muted mb-3 flex-1">${dayData.type === 'yoga' ? '45 Min • Flexibility • Breathing' : '60 Min • 4 Sets • 12 Reps Target'}</p>`}
                        ${!isRest ? `<a href="${ytLink}" target="_blank" style="text-decoration:none;" class="button button-secondary w-full text-xs py-2 mt-auto glow-hover"><i data-lucide="youtube" style="width:14px; color:#ff0000;"></i> Open on YouTube</a>` : `<button class="button button-neutral w-full text-xs py-2 mt-auto" disabled>Rest Day</button>`}
                    </div>
                </div>`;
            });
            lucide.createIcons();

            updateDashboardMetrics(userData);
            showToast(`Neural pathway compiled for ${userData.trainingMode.toUpperCase()}. Plan architecture updated.`);
        });
    }

    // 4. 3D Anatomy Interaction System
    const muscleMap = {
        'neck': { title: 'Cervical Spine & Traps', desc: 'Critical for structural stability during compound kinetic loads. Target with shrug variations.' },
        'shouldersL': { title: 'Left Deltoid Matrix', desc: 'Anterior, lateral, and posterior heads. High leverage zone during pressing mechanics.' },
        'shouldersR': { title: 'Right Deltoid Matrix', desc: 'Anterior, lateral, and posterior heads. Requires rotational warmups to prevent impaction.' },
        'chestL': { title: 'Left Pectoralis Major', desc: 'Primary upper-body pushing musculature. Optimal activation via incline/decline vectors.' },
        'chestR': { title: 'Right Pectoralis Major', desc: 'Primary upper-body pushing musculature. High propensity for tearing under cold ballistic load.' },
        'coreL': { title: 'Left Obliques & Core', desc: 'Core stabilizing engine. Transfers rotational power from lower to upper extremities.' },
        'coreR': { title: 'Right Obliques & Core', desc: 'Core stabilizing engine. Essential for spinal rigidity during heavy axial loading.' },
        'armsL': { title: 'Left Biceps & Forearm', desc: 'Pulling mechanism actuators. Biomechanical lever for posterior chain activities.' },
        'armsR': { title: 'Right Biceps & Forearm', desc: 'Pulling mechanism actuators. Focus on supinating the wrist for peak bicep contraction.' },
        'legsL': { title: 'Left Quadriceps', desc: 'Massive energy output zone. Knee extensor complex driving vertical power generation.' },
        'legsR': { title: 'Right Quadriceps', desc: 'Massive energy output zone. Squat mechanics require high dorsal ankle mobility here.' },
        'calvesL': { title: 'Left Gastrocnemius', desc: 'Distal energy absorption. Extremely dense fiber makeup requiring high-volume stimulation.' },
        'calvesR': { title: 'Right Gastrocnemius', desc: 'Distal energy absorption. Key to explosive jumping and sprint transition.' }
    };

    const anatomyParts = document.querySelectorAll('.anatomy-node');
    const titleEl = document.getElementById('muscle-title');
    const descEl = document.getElementById('muscle-desc');

    anatomyParts.forEach(part => {
        part.addEventListener('mouseenter', (e) => {
            const id = e.target.getAttribute('data-muscle');
            if (muscleMap[id]) {
                titleEl.textContent = muscleMap[id].title;
                descEl.textContent = muscleMap[id].desc;
            }
        });
        part.addEventListener('click', (e) => {
            anatomyParts.forEach(p => p.classList.remove('active'));
            e.target.classList.add('active');
            showToast(`Isolated targeting protocols loaded for: ${muscleMap[e.target.getAttribute('data-muscle')].title}`);
        });
    });

    // 5. Diet Filter Matrices
    const dietFilters = document.querySelectorAll('.filter-bar .chip');
    const dietCards = document.querySelectorAll('.food-grid .food-card');

    dietFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            dietFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetFilter = btn.getAttribute('data-filter');
            
            dietCards.forEach(card => {
                if (targetFilter === 'all' || card.getAttribute('data-cat').includes(targetFilter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    document.querySelectorAll('.btn-add-diet').forEach(btn => btn.addEventListener('click', () => showToast('Nutritional vector ingested. Caloric goal updated.')));

    // 6. Food Scanner AI (Camera Setup)
    let cameraStream = null;
    const videoElem = document.getElementById('camera-stream');
    const canvasElem = document.getElementById('camera-canvas');

    function stopCamera() {
        if (cameraStream) { cameraStream.getTracks().forEach(track => track.stop()); cameraStream = null; }
        if (videoElem) { videoElem.srcObject = null; videoElem.classList.add('hidden'); }
    }

    function startCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(function (stream) {
                cameraStream = stream;
                if(videoElem) { videoElem.srcObject = stream; videoElem.classList.remove('hidden'); document.getElementById('camera-error').classList.add('hidden'); }
            }).catch(function (err) { document.getElementById('camera-error').classList.remove('hidden'); });
        }
    }

    const btnScan = document.getElementById('btn-scan');
    if (btnScan) {
        btnScan.addEventListener('click', () => {
            if(!cameraStream) { showToast("Requires hardware camera connection."); return; }
            if(videoElem && canvasElem) {
                canvasElem.width = videoElem.videoWidth || 400; canvasElem.height = videoElem.videoHeight || 400;
                canvasElem.getContext('2d').drawImage(videoElem, 0, 0, canvasElem.width, canvasElem.height);
                videoElem.classList.add('hidden'); canvasElem.classList.remove('hidden');
            }
            document.getElementById('scan-results').classList.add('hidden');
            document.getElementById('scanner-viewport').classList.add('scanning');
            document.getElementById('scan-laser').classList.remove('hidden');
            document.getElementById('scan-prompt').style.opacity = '0';
            btnScan.innerHTML = `<i data-lucide="loader-2" class="animate-spin"></i> Initializing Neural Extractor...`;
            lucide.createIcons();
            
            setTimeout(() => {
                document.getElementById('scanner-viewport').classList.remove('scanning');
                document.getElementById('scan-laser').classList.add('hidden');
                document.getElementById('scan-results').classList.remove('hidden');
                btnScan.innerHTML = `<i data-lucide="refresh-cw"></i> Recapture Object`;
                lucide.createIcons();
                stopCamera();
            }, 2500); 
        });
    }

    // 7. Human Interaction Chatbot (Ria)
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatHistory = document.getElementById('chat-history');
    
    // File inputs for Image / Camera
    const btnCamera = document.getElementById('ria-btn-camera');
    const pickerCamera = document.getElementById('ria-camera-picker');
    const btnImage = document.getElementById('ria-btn-image');
    const pickerImage = document.getElementById('ria-image-picker');

    if(btnCamera) btnCamera.addEventListener('click', (e) => { e.preventDefault(); pickerCamera.click(); });
    if(btnImage) btnImage.addEventListener('click', (e) => { e.preventDefault(); pickerImage.click(); });

    function handleFilePick(e) {
        if(e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (loadEv) => {
                const imgTag = `<br><img src="${loadEv.target.result}" class="chat-img-preview">`;
                addMessage("Uploaded Image:" + imgTag, 'user');
                setTimeout(() => {
                    addMessage("Processing biometric vision scan... I have ingested this media. Logging nutritional matrix now.", 'ai');
                }, 1500);
            };
            reader.readAsDataURL(file);
        }
    }
    
    if(pickerCamera) pickerCamera.addEventListener('change', handleFilePick);
    if(pickerImage) pickerImage.addEventListener('change', handleFilePick);

    // Voice Mock
    const btnMic = document.getElementById('ria-btn-mic');
    let isRecording = false;
    if(btnMic) btnMic.addEventListener('click', () => {
        isRecording = !isRecording;
        if(isRecording) { btnMic.style.color = 'var(--clr-neon-blue)'; document.getElementById('recording-toast').classList.remove('hidden'); } 
        else {
            btnMic.style.color = ''; document.getElementById('recording-toast').classList.add('hidden');
            setTimeout(() => processChat("I'm looking for a diet suggestion.", 'user'), 300);
        }
    });

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if(!text) return;
            processChat(text, 'user');
            chatInput.value = '';
        });
    }

    function processChat(text, sender) {
        // User Message
        addMessage(text, 'user');
        
        // AI Human-like Response Logic
        setTimeout(() => {
            let reply = "I am processing your biometric feedback. Your telemetry looks optimal today.";
            const t = text.toLowerCase();
            
            if (t.includes('weight loss') || t.includes('cut') || t.includes('fat loss')) {
                reply = `
                <p>Based on your metabolic rate, here are my optimized **Weight Loss (Cut)** recommendations:</p>
                <ul style="margin-top: 10px; margin-left: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <li><strong class="text-neon-blue">Spinach & Egg Scramble</strong> — 290 kcal (High Protein/Keto)</li>
                    <li><strong class="text-neon-blue">Açai Berry Neural Bowl</strong> — 220 kcal (Vegan Fast)</li>
                    <li><strong class="text-neon-blue">Smashed Avocado Toast</strong> — 320 kcal (Clean Fats)</li>
                </ul>
                <p style="margin-top:10px">Shall I load these into your daily planner to ensure caloric deficit?</p>`;
            } 
            else if (t.includes('weight gain') || t.includes('bulk') || t.includes('hypertrophy') || t.includes('mass')) {
                reply = `
                <p>For accelerating sheer mass and hypertrophy, these are your **Weight Gain (Bulk)** blueprints:</p>
                <ul style="margin-top: 10px; margin-left: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <li><strong class="text-neon-purple">Prime Sirloin & Veggies</strong> — 640 kcal (Anabolic Matrix)</li>
                    <li><strong class="text-neon-purple">Atlantic Salmon Node</strong> — 520 kcal (Omega-3 Core)</li>
                    <li><strong class="text-neon-purple">Quinoa Tofu Power Bowl</strong> — 410 kcal (Plant Protein)</li>
                </ul>
                <p style="margin-top:10px">These will provide the necessary caloric surplus to repair torn muscle fibers.</p>`;
            }
            else if (t.includes('optimize') || t.includes('maintain') || t.includes('balance')) {
                reply = `
                <p>To maintain homeostasis and **Optimize** current mass, here are balanced recommendations:</p>
                <ul style="margin-top: 10px; margin-left: 15px; display: flex; flex-direction: column; gap: 8px;">
                    <li><strong class="text-neon-green">Chargrilled Chicken Bowl</strong> — 450 kcal (Aura Balanced)</li>
                    <li><strong class="text-neon-green">Whey Isolate Pancakes</strong> — 380 kcal (Anabolic Breakfast)</li>
                </ul>
                <p style="margin-top:10px">This perfectly matches your TDEE output.</p>`;
            }
            else if (t.includes('all') && (t.includes('diet') || t.includes('plan') || t.includes('food'))) {
                reply = `
                <p>I am pulling **All Diet Plans** from the AuraFit Engine Database:</p>
                <ul style="margin-top: 10px; margin-left: 15px; font-size: 0.8rem; display: flex; flex-direction: column; gap: 6px; border-left: 2px solid var(--clr-border); padding-left: 10px;">
                    <li>1. Chargrilled Chicken Bowl (450 kcal) - Balanced</li>
                    <li>2. Atlantic Salmon Node (520 kcal) - Bulking</li>
                    <li>3. Prime Sirloin & Veggies (640 kcal) - Keto/Bulk</li>
                    <li>4. Whey Isolate Pancakes (380 kcal) - Protein Load</li>
                    <li>5. Smashed Avocado Toast (320 kcal) - Vegan</li>
                    <li>6. Spinach & Egg Scramble (290 kcal) - Weight Loss</li>
                    <li>7. Açai Berry Bowl (220 kcal) - Fast/Cut</li>
                    <li>8. Quinoa Tofu Bowl (410 kcal) - Vegan/Bulk</li>
                </ul>`;
            } else if(t.includes('diet') || t.includes('food') || t.includes('hungry')) {
                reply = `As your requested Diet Recommendation System, I strongly suggest the **Atlantic Salmon Node** for Omega-3 synthesis. I also have plans for Weight Loss, Weight Gain, or Optimize. Which path do you want?`;
            } else if (t.includes('yoga') || t.includes('mobility') || t.includes('stretch')) {
                reply = `If you have switched to Yoga Modality, focus on mindful breathing and full ROM! Yin recovery protocols are incredibly effective for lactic acid clearing.`;
            } else if (t.includes('gym') || t.includes('lift') || t.includes('weights')) {
                reply = `For Gym modules, progressive overload is king. Track your volume precisely!`;
            } else if (t.includes('workout') || t.includes('routine') || t.includes('plan')) {
                reply = `According to your Personalized Planning profile, you are operating on a ${userData.goal.toUpperCase()} loop under the ${userData.trainingMode.toUpperCase()} modality! Let's crush today's scheduled block.`;
            } else if (t.includes('muscle') || t.includes('sore') || t.includes('anatomy') || t.includes('body')) {
                reply = `Analyzing 3D Anatomy logs... I see you stimulated the Left Pectoralis yesterday. I recommend light active recovery. Head over to the **3D Muscle Anatomy** module to verify your kinetic status!`;
            } else if (t.includes('hello') || t.includes('hi')) {
                reply = `Hello ${userData.name}! My neural pathways are active. What objective are we targeting today? You can ask me for "Weight Loss Diet Plans", "Camera Uploading", or "Muscle Recovery".`;
            }
            
            addMessage(reply, 'ai');
        }, 1200);
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'} float-up`;
        div.innerHTML = `<div class="message-content glass-chip"><p>${text}</p></div>`;
        chatHistory.appendChild(div);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Settings Toggle Logic
    document.querySelectorAll('.toggle-switch').forEach(toggle => toggle.addEventListener('click', () => toggle.classList.toggle('active')));
    document.querySelectorAll('.btn-save-pref').forEach(btn => btn.addEventListener('click', () => showToast('Preferences securely saved to local cluster.')));

    // Toast
    const toastContainer = document.getElementById('toast-container');
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i data-lucide="check-circle" class="text-neon-blue"></i><span>${msg}</span>`;
        toastContainer.appendChild(toast);
        lucide.createIcons();
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
    }
});
