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

    const svg = document.querySelector('svg');
    const pattern = document.querySelector('#dot-pattern');

    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

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

    // Start animation loop
    updatePattern();

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        // Update cursor position immediately
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        // Get mouse position relative to center of viewport
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = e.clientY - window.innerHeight / 2;

        // Calculate offset (max 50px in any direction)
        const MAX_OFFSET = 50;
        // Update target position for lerping
        patternState.targetX = (mouseX / window.innerWidth) * MAX_OFFSET;
        patternState.targetY = (mouseY / window.innerHeight) * MAX_OFFSET;
    });

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
            if (textToType) {
                typeText(textToType);
            }
        });
    });
});
