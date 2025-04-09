document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const lessonContainer = document.querySelector('.lesson-container');
    const topicItems = document.querySelectorAll('.topic-item');
    const contentCard = document.querySelector('.content-card');
    const unitHeader = document.querySelector('.unit-header');
    const pattern = document.querySelector('#dot-pattern');
    
    // Pattern movement state
    const patternState = {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0
    };

    // Lerp function for smooth animation
    const lerp = (start, end, factor) => {
        return start + (end - start) * factor;
    };

    // Animation loop for smooth pattern movement
    const updatePattern = () => {
        // Smoothly interpolate current position towards target
        patternState.currentX = lerp(patternState.currentX, patternState.targetX, 0.1);
        patternState.currentY = lerp(patternState.currentY, patternState.targetY, 0.1);

        // Apply the smoothed position to pattern
        if (pattern) {
            pattern.setAttribute('x', patternState.currentX.toString());
            pattern.setAttribute('y', patternState.currentY.toString());
        }

        // Continue animation loop
        requestAnimationFrame(updatePattern);
    };

    // Start animation loop
    updatePattern();

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        // Get mouse position relative to center of viewport
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = e.clientY - window.innerHeight / 2;

        // Calculate offset (max 50px in any direction)
        const MAX_OFFSET = 50;
        // Update target position for lerping
        patternState.targetX = (mouseX / window.innerWidth) * MAX_OFFSET;
        patternState.targetY = (mouseY / window.innerHeight) * MAX_OFFSET;
    });

    // Add 3D hover effect to content card
    if (contentCard) {
        document.addEventListener('mousemove', (e) => {
            const cardRect = contentCard.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const distanceX = (e.clientX - cardCenterX) / (cardRect.width / 2);
            const distanceY = (e.clientY - cardCenterY) / (cardRect.height / 2);
            
            // Limit the rotation to a subtle effect
            const maxRotation = 2;
            const rotateY = distanceX * -maxRotation;
            const rotateX = distanceY * maxRotation;
            
            contentCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        });
        
        // Reset transformation when mouse leaves
        contentCard.addEventListener('mouseleave', () => {
            contentCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    }
    
    // Handle topic item clicks
    topicItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all topic items
            topicItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the topic text
            const topicText = this.querySelector('.topic-text').textContent;
            
            // Update content based on topic
            updateContent(topicText);
        });
    });
    
    // Function to update content based on selected topic
    function updateContent(topic) {
        if (!contentCard) return;
        
        // Don't update content if still loading
        if (document.body.classList.contains('is-loading')) return;
        
        // Reset the card animation
        contentCard.style.opacity = '0';
        contentCard.style.transform = 'perspective(1000px) translateY(20px)';
        
        setTimeout(() => {
            // Update content based on topic
            let content = '';
            
            switch(topic) {
                case 'What is Recursion?':
                    content = `
                        <h1>What is Recursion?</h1>
                        <p>Recursion is a programming technique where a function calls itself to solve a problem. It's particularly useful for tasks that can be broken down into similar subtasks.</p>
                        <p>The key components of recursion are:</p>
                        <ul>
                            <li>Base case - the condition that stops the recursion</li>
                            <li>Recursive case - where the function calls itself</li>
                            <li>Progress toward the base case - each recursive call should move closer to the base case</li>
                        </ul>
                    `;
                    break;
                    
                case 'Base cases':
                    content = `
                        <h1>Base Cases</h1>
                        <p>Base cases are the foundation of any recursive function. They define when the recursion should stop.</p>
                        <p>Without proper base cases, a recursive function would call itself indefinitely, resulting in a stack overflow.</p>
                        <ul>
                            <li>A base case should be simple enough to solve directly</li>
                            <li>Every recursive path must eventually reach a base case</li>
                            <li>Common base cases include empty arrays, 0, or 1 for mathematical operations</li>
                        </ul>
                    `;
                    break;
                    
                case 'Recursion with stacks':
                    content = `
                        <h1>Recursion with Stacks</h1>
                        <p>Understanding the call stack is essential for mastering recursion.</p>
                        <p>When a function calls itself recursively, each new call is added to the call stack, creating a stack of function calls.</p>
                        <ul>
                            <li>The call stack keeps track of where to return after each function call completes</li>
                            <li>Each recursive call consumes memory on the stack</li>
                            <li>Too many recursive calls can lead to a "stack overflow" error</li>
                            <li>Understanding stack frames helps in tracing and debugging recursive functions</li>
                        </ul>
                    `;
                    break;
                    
                case 'Recursive examples':
                    content = `
                        <h1>Recursive Examples</h1>
                        <p>Let's explore some classic examples of recursion.</p>
                        <h2>Factorial Function</h2>
                        <pre><code>function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n-1);
}</code></pre>
                        <h2>Fibonacci Sequence</h2>
                        <pre><code>function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}</code></pre>
                    `;
                    break;
                    
                case 'Practice problems':
                    content = `
                        <h1>Practice Problems</h1>
                        <p>Challenge yourself with these recursive problems:</p>
                        <ul>
                            <li>Calculate the sum of an array using recursion</li>
                            <li>Find the nth Fibonacci number optimally</li>
                            <li>Implement a recursive function to calculate power(base, exponent)</li>
                            <li>Write a recursive function to reverse a string</li>
                            <li>Solve the Tower of Hanoi puzzle for n disks</li>
                            <li>Implement a recursive algorithm for generating all permutations of a string</li>
                        </ul>
                    `;
                    break;
                    
                default:
                    content = `<h1>${topic}</h1><p>Content for ${topic} goes here.</p>`;
            }
            
            contentCard.innerHTML = content;
            
            // Animate the content card
            setTimeout(() => {
                contentCard.style.opacity = '1';
                contentCard.style.transform = 'perspective(1000px) translateY(0)';
            }, 100);
        }, 300);
    }
    
    // Loading animation sequence - add loading class to the page initially
    document.body.classList.add('is-loading');
    
    // Hide content card initially
    if (contentCard) {
        contentCard.style.opacity = '0';
        contentCard.style.transform = 'translateY(20px)';
    }
    
    // Start loading sequence after a short delay
    setTimeout(() => {
        // First, show the unit header with animations
        if (unitHeader) {
            unitHeader.style.opacity = "1";
            unitHeader.style.transform = "translateY(0)";
            
            // Keep the unit header visible for 3.5 seconds before loading the rest
            setTimeout(() => {
                // Then show each topic item one by one
                if (topicItems.length) {
                    topicItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = "1";
                            item.style.transform = "translateY(0)";

                            if (index == 2) unitHeader.classList.add('loading-complete'); // Removes Gradients
                            
                            // If this is the last item, stop the header animations
                            if (index === topicItems.length - 1) {
                                setTimeout(() => {
                                    document.body.classList.remove('is-loading');
                                    
                                    // Show the content card last, after everything else is loaded
                                    setTimeout(() => {
                                        if (contentCard) {
                                            contentCard.style.opacity = '1';
                                            contentCard.style.transform = 'translateY(0)';
                                        }
                                    }, 400);
                                }, 500);
                            }
                        }, 150 + (index * 150)); // Stagger the items
                    });
                }
            }, 4000); // Wait 3.5 seconds with just the header showing
        }
    }, 100); // Initial delay before starting animations
});
