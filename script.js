document.addEventListener('DOMContentLoaded', () => {
    // Hero text rotation
    const heroNouns = [
        "Marble<span id='hero-sub-period'>.</span>", //  final bug fix - we use the add'l span tag to prevent font loading scaling issues on chrome
        "Your Tutor",
        "Your Study Guide",
        "Your Cheat Sheet",
        "Your Secret Weapon"
    ];
    heroNouns.unshift(heroNouns[0]);
    heroNouns.push(heroNouns[0]);

    const highlightContainer = document.querySelector('.highlight-container');
    let currentIndex = 0;
    let isAnimating = true;
    let didFinishLoop = false;

    // Function to update container width
    function updateContainerWidth(element) {
        if (element) {
            // Create a temporary span to measure text width
            const temp = document.createElement('span');
            temp.className = 'highlight word';
            temp.style.visibility = 'hidden';
            temp.style.position = 'absolute';
            temp.style.whiteSpace = 'nowrap';
            temp.style.fontFamily = 'Libre Baskerville, serif';
            temp.style.fontSize = '2.5rem';
            temp.style.fontWeight = 'bolder';
            temp.style.left = '-9999px';
            temp.innerHTML = element.innerHTML;

            // Increase buffer from 4px to 20px to prevent text cutoff
            let offset = 15;
            if (temp.innerHTML == heroNouns[0]) {
                // Add 20% extra width for the first entry
                document.body.appendChild(temp);
                const baseWidth = temp.offsetWidth;
                offset = Math.round(baseWidth * 0.2); // 20% of the text width
                document.body.removeChild(temp);
            }
            document.body.appendChild(temp);

            const width = temp.offsetWidth;
            highlightContainer.style.setProperty('--container-width', `${width + offset}px`);

            document.body.removeChild(temp);
        }
    }

    // Ensure initial text is visible and sized correctly
    const initialText = highlightContainer.querySelector('.highlight');
    if (initialText) {
        initialText.classList.add('active');
        updateContainerWidth(initialText);
    }

    function updateHeroText() {
        if (!isAnimating) return;

        const currentText = highlightContainer.querySelector('.highlight.active');
        let nextIndex = (currentIndex + 1) % heroNouns.length;

        if (nextIndex === 0) {
            isAnimating = false;
            return;
        }

        if (nextIndex === heroNouns.length - 1) didFinishLoop = true;

        // Create new text element
        const newText = document.createElement('span');
        newText.className = 'highlight word';
        newText.innerHTML = heroNouns[nextIndex];

        // if it is index 0, hero-period should be invisible. else, it should be visible.
        const heroPeriod = document.getElementById('hero-period');
        heroPeriod.style.visibility = currentIndex === 0 || didFinishLoop ? 'hidden' : 'visible';

        // Calculate new width before adding the element
        updateContainerWidth(newText);

        // Add the new text
        highlightContainer.appendChild(newText);

        // Trigger animations
        if (currentText) {
            currentText.classList.add('slide-up-out');
        }
        newText.classList.add('slide-up-in', 'active');

        // Update classes and clean up after animation
        setTimeout(() => {
            if (currentText) {
                currentText.remove();
            }
            newText.classList.remove('slide-up-in');
        }, 500);

        currentIndex = nextIndex;

        // Schedule next update
        setTimeout(updateHeroText, 1000);
    }

    // Start the animation
    setTimeout(updateHeroText, 1000);

    const pattern = document.querySelector('#dot-pattern');

    // Pattern movement state
    const patternState = {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0
    };

    // Lerp function
    const lerp = (start, end, factor) => {
        return start + (end - start) * factor;
    };

    // Animation loop for smooth pattern movement
    const updatePattern = () => {
        // Smoothly interpolate current position towards target
        patternState.currentX = lerp(patternState.currentX, patternState.targetX, 0.1);
        patternState.currentY = lerp(patternState.currentY, patternState.targetY, 0.1);

        // Apply the smoothed position to pattern
        pattern.setAttribute('x', patternState.currentX.toString());
        pattern.setAttribute('y', patternState.currentY.toString());

        // Continue animation loop
        requestAnimationFrame(updatePattern);
    };

    // Handle click animation
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicked');
    });

    // Reset position when mouse leaves
    document.addEventListener('mouseleave', () => {
        patternState.targetX = patternState.targetY = 0;
        cursor.style.display = 'none';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
    });

    // Start animation loop
    updatePattern();

    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        // Get mouse position relative to center of viewport
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = e.clientY - window.innerHeight / 2;

        // Update cursor position immediately
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Calculate offset (max 50px in any direction)
        const MAX_OFFSET = 50;
        // Update target position for lerping
        patternState.targetX = (mouseX / window.innerWidth) * MAX_OFFSET;
        patternState.targetY = (mouseY / window.innerHeight) * MAX_OFFSET;
    });

    // Add mouse tracking for presentation slide skew effect
    const presentationSlide = document.querySelector('#skew');
    let slideRect = presentationSlide?.getBoundingClientRect();

    // Update slide rect on resize
    window.addEventListener('resize', () => {
        slideRect = presentationSlide?.getBoundingClientRect();
    });

    // Track mouse movement for slide skew effect
    document.addEventListener('mousemove', (e) => {
        if (!presentationSlide || !slideRect) return;

        // Calculate mouse position relative to the center of the slide
        const centerX = slideRect.left + slideRect.width / 2;
        const centerY = slideRect.top + slideRect.height / 2;

        // Calculate distance from center (-1 to 1)
        const distanceX = (e.clientX - centerX) / (window.innerWidth / 2);
        const distanceY = (e.clientY - centerY) / (window.innerHeight / 2);

        // Apply rotation transform with smooth transition
        const rotateX = -distanceY * 5;
        const rotateY = distanceX * 10;

        presentationSlide.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
    });

    const inputContainer = document.querySelector('.input-container');

    // Typing animation function
    async function typeText(text) {
        const input = document.querySelector('.input-box');
        input.value = '';

        for (let i = 0; i < text.length; i++) {
            input.value += text[i];
            await new Promise(resolve => setTimeout(resolve, 2));
        }
    }

    // Add click handlers to pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const textToType = pill.getAttribute('data-text');
            // Show input box first
            teachMeButton.style.display = 'none';
            inputBoxContainer.style.display = 'flex';
            inputBox.focus();
            // Then type the text if available
            if (textToType) {
                typeText(textToType);
            }
        });

        // Add mouse enter/exit handlers for pills
        pill.addEventListener('mouseenter', () => {
            const pillText = pill.querySelector('span').textContent;
            updateSlideContent(pillText);
        });

        pill.addEventListener('mouseleave', () => {
            updateSlideContent('default');
        });
    });

    // Function to update slide content
    function updateSlideContent(pillText) {
        const slideContent = document.querySelector('.presentation-slide');

        // Clear existing content
        slideContent.innerHTML = '';

        // Create content based on pill type
        switch (pillText) {
            case 'Insertion Sort':
                slideContent.innerHTML = `
                    <h1>Insertion Sort Visualization</h1>
                    <div class="slide-content">
                        <svg width="100%" height="200" class="algorithm-viz">
                            <g transform="translate(50, 20)">
                                <!-- Array bars -->
                                <rect x="0" y="0" width="40" height="160" fill="#b956e3" opacity="0.7"/>
                                <rect x="50" y="40" width="40" height="120" fill="#b956e3" opacity="0.7"/>
                                <rect x="100" y="80" width="40" height="80" fill="#b956e3" opacity="0.7"/>
                                <rect x="150" y="20" width="40" height="140" fill="#b956e3" opacity="0.7"/>
                                <rect x="200" y="60" width="40" height="100" fill="#b956e3" opacity="0.7"/>
                                
                                <!-- Numbers -->
                                <text x="20" y="190" text-anchor="middle" fill="white">8</text>
                                <text x="70" y="190" text-anchor="middle" fill="white">6</text>
                                <text x="120" y="190" text-anchor="middle" fill="white">4</text>
                                <text x="170" y="190" text-anchor="middle" fill="white">7</text>
                                <text x="220" y="190" text-anchor="middle" fill="white">5</text>
                                
                                <!-- Arrow indicating current element -->
                                <path d="M120,0 L130,-10 L110,-10 Z" fill="#56a0e3"/>
                            </g>
                        </svg>
                        <p>Watch as each element finds its correct position in the sorted portion of the array.</p>
                    </div>`;
                break;

            case 'Time Complexity':
                slideContent.innerHTML = `
                    <h1>Algorithm Time Complexity</h1>
                    <div class="slide-content">
                        <svg width="100%" height="200" class="complexity-viz">
                            <g transform="translate(40, 20)">
                                <!-- Axes -->
                                <line x1="0" y1="160" x2="300" y2="160" stroke="white" opacity="0.5"/>
                                <line x1="0" y1="160" x2="0" y2="0" stroke="white" opacity="0.5"/>
                                
                                <!-- O(n) linear -->
                                <path d="M0,160 L300,0" stroke="#56a0e3" fill="none" opacity="0.7"/>
                                
                                <!-- O(n²) quadratic -->
                                <path d="M0,160 Q150,160 300,0" stroke="#b956e3" fill="none" opacity="0.7"/>
                                
                                <!-- O(log n) logarithmic -->
                                <path d="M0,160 Q150,80 300,40" stroke="#e3a256" fill="none" opacity="0.7"/>
                                
                                <!-- Labels -->
                                <text x="310" y="165" fill="white" opacity="0.8">n</text>
                                <text x="-30" y="10" fill="white" opacity="0.8">time</text>
                            </g>
                        </svg>
                        <p>Compare how different algorithms scale with input size.</p>
                    </div>`;
                break;

            case 'Database Design':
                slideContent.innerHTML = `
                    <h1>Database Normalization</h1>
                    <div class="slide-content">
                        <svg width="100%" height="200" class="db-viz">
                            <g transform="translate(50, 20)">
                                <!-- Tables -->
                                <rect x="0" y="0" width="120" height="60" fill="#e3a256" opacity="0.7"/>
                                <rect x="160" y="0" width="120" height="60" fill="#e3a256" opacity="0.7"/>
                                <rect x="80" y="100" width="120" height="60" fill="#e3a256" opacity="0.7"/>
                                
                                <!-- Relationships -->
                                <path d="M120,30 L160,30" stroke="white" opacity="0.5" marker-end="url(#arrowhead)"/>
                                <path d="M140,60 L140,100" stroke="white" opacity="0.5" marker-end="url(#arrowhead)"/>
                                
                                <!-- Labels -->
                                <text x="60" y="35" fill="white" text-anchor="middle">Users</text>
                                <text x="220" y="35" fill="white" text-anchor="middle">Orders</text>
                                <text x="140" y="135" fill="white" text-anchor="middle">Products</text>
                            </g>
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="white" opacity="0.5"/>
                                </marker>
                            </defs>
                        </svg>
                        <p>Learn about relationships and normalization in database design.</p>
                    </div>`;
                break;

            case 'Recursion':
                slideContent.innerHTML = `
                    <h1>Understanding Recursion</h1>
                    <div class="slide-content">
                        <svg width="100%" height="200" class="recursion-viz">
                            <g transform="translate(150, 20)">
                                <!-- Tree structure -->
                                <circle cx="0" cy="0" r="20" fill="#b956e3" opacity="0.7"/>
                                <circle cx="-60" cy="60" r="20" fill="#b956e3" opacity="0.7"/>
                                <circle cx="60" cy="60" r="20" fill="#b956e3" opacity="0.7"/>
                                <circle cx="-90" cy="120" r="20" fill="#b956e3" opacity="0.7"/>
                                <circle cx="-30" cy="120" r="20" fill="#b956e3" opacity="0.7"/>
                                
                                <!-- Connections -->
                                <line x1="0" y1="0" x2="-60" y2="60" stroke="white" opacity="0.3"/>
                                <line x1="0" y1="0" x2="60" y2="60" stroke="white" opacity="0.3"/>
                                <line x1="-60" y1="60" x2="-90" y2="120" stroke="white" opacity="0.3"/>
                                <line x1="-60" y1="60" x2="-30" y2="120" stroke="white" opacity="0.3"/>
                            </g>
                        </svg>
                        <p>Visualize how recursive functions break down problems into smaller sub-problems.</p>
                    </div>`;
                break;

            case 'OOP Concepts':
                slideContent.innerHTML = `
                    <h1>Object-Oriented Programming</h1>
                    <div class="slide-content">
                        <svg width="100%" height="200" class="oop-viz">
                            <g transform="translate(50, 20)">
                                <!-- Class hierarchy -->
                                <rect x="80" y="0" width="140" height="40" rx="5" fill="#56a0e3" opacity="0.7"/>
                                <rect x="0" y="80" width="140" height="40" rx="5" fill="#56a0e3" opacity="0.7"/>
                                <rect x="160" y="80" width="140" height="40" rx="5" fill="#56a0e3" opacity="0.7"/>
                                
                                <!-- Inheritance arrows -->
                                <path d="M70,80 L150,40" stroke="white" opacity="0.5" marker-end="url(#arrowhead)"/>
                                <path d="M230,80 L150,40" stroke="white" opacity="0.5" marker-end="url(#arrowhead)"/>
                                
                                <!-- Labels -->
                                <text x="150" y="25" fill="white" text-anchor="middle">Animal</text>
                                <text x="70" y="105" fill="white" text-anchor="middle">Dog</text>
                                <text x="230" y="105" fill="white" text-anchor="middle">Cat</text>
                            </g>
                        </svg>
                        <p>Explore inheritance, encapsulation, polymorphism, and abstraction.</p>
                    </div>`;
                break;

            case 'Dynamic Programming':
                slideContent.innerHTML = `
                    <h1>Dynamic Programming</h1>
                    <div class="slide-content">
                        <svg width="100%" height="200" class="dp-viz">
                            <g transform="translate(50, 20)">
                                <!-- Grid structure -->
                                <rect x="0" y="0" width="40" height="40" fill="#b956e3" opacity="0.3"/>
                                <rect x="40" y="0" width="40" height="40" fill="#b956e3" opacity="0.3"/>
                                <rect x="80" y="0" width="40" height="40" fill="#b956e3" opacity="0.3"/>
                                <rect x="0" y="40" width="40" height="40" fill="#b956e3" opacity="0.5"/>
                                <rect x="40" y="40" width="40" height="40" fill="#b956e3" opacity="0.5"/>
                                <rect x="80" y="40" width="40" height="40" fill="#b956e3" opacity="0.5"/>
                                <rect x="0" y="80" width="40" height="40" fill="#b956e3" opacity="0.7"/>
                                <rect x="40" y="80" width="40" height="40" fill="#b956e3" opacity="0.7"/>
                                <rect x="80" y="80" width="40" height="40" fill="#b956e3" opacity="0.7"/>
                                
                                <!-- Values -->
                                <text x="20" y="25" fill="white" text-anchor="middle">1</text>
                                <text x="60" y="25" fill="white" text-anchor="middle">3</text>
                                <text x="100" y="25" fill="white" text-anchor="middle">6</text>
                                <text x="20" y="65" fill="white" text-anchor="middle">2</text>
                                <text x="60" y="65" fill="white" text-anchor="middle">5</text>
                                <text x="100" y="65" fill="white" text-anchor="middle">8</text>
                                <text x="20" y="105" fill="white" text-anchor="middle">4</text>
                                <text x="60" y="105" fill="white" text-anchor="middle">7</text>
                                <text x="100" y="105" fill="white" text-anchor="middle">9</text>
                            </g>
                        </svg>
                        <p>See how solutions to subproblems are stored and reused.</p>
                    </div>`;
                break;

            case 'Graph Algorithms':
                slideContent.innerHTML = `
                    <h1>Graph Algorithms</h1>
                    <div class="slide-content">
                        <svg width="100%" height="200" class="graph-viz">
                            <g transform="translate(50, 20)">
                                <!-- Nodes -->
                                <circle cx="150" cy="20" r="20" fill="#56a0e3" opacity="0.7"/>
                                <circle cx="50" cy="80" r="20" fill="#56a0e3" opacity="0.7"/>
                                <circle cx="250" cy="80" r="20" fill="#56a0e3" opacity="0.7"/>
                                <circle cx="150" cy="140" r="20" fill="#56a0e3" opacity="0.7"/>
                                
                                <!-- Edges -->
                                <line x1="150" y1="20" x2="50" y2="80" stroke="white" opacity="0.3"/>
                                <line x1="150" y1="20" x2="250" y2="80" stroke="white" opacity="0.3"/>
                                <line x1="50" y1="80" x2="150" y2="140" stroke="white" opacity="0.3"/>
                                <line x1="250" y1="80" x2="150" y2="140" stroke="white" opacity="0.3"/>
                                
                                <!-- Node labels -->
                                <text x="150" y="25" fill="white" text-anchor="middle">A</text>
                                <text x="50" y="85" fill="white" text-anchor="middle">B</text>
                                <text x="250" y="85" fill="white" text-anchor="middle">C</text>
                                <text x="150" y="145" fill="white" text-anchor="middle">D</text>
                            </g>
                        </svg>
                        <p>Explore traversal, shortest paths, and network flow algorithms.</p>
                    </div>`;
                break;

            default:
                slideContent.innerHTML = `
                    <h1>Learning Made Simple</h1>
                    <p><span class="marble-slide-text">Marble</span> will create tiny, interactive slide decks to help you learn.<br /><br />Select a topic on the right to get started, or type in something new.</p>`;
        }
    }

    updateSlideContent('default');

    // Input container interaction
    const teachMeButton = document.querySelector('.teach-me-button');
    const inputBoxContainer = document.querySelector('.input-box-container');
    const inputBox = document.querySelector('.input-box');

    teachMeButton.addEventListener('click', () => {
        teachMeButton.style.display = 'none';
        inputBoxContainer.style.display = 'flex';
        inputBox.focus();
    });

    // When input loses focus and is empty, show button again
    inputBox.addEventListener('blur', () => {
        if (!inputBox.value.trim()) {
            setTimeout(() => {
                const isButtonVisible = getComputedStyle(teachMeButton).display !== 'none';
                if (!isButtonVisible && !inputBox.value.trim()) {
                    teachMeButton.style.display = 'block';
                    inputBoxContainer.style.display = 'none';
                }
            }, 200);
        }
    });
});
