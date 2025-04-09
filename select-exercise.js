document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const optionButtons = document.querySelectorAll('.option-button:not([href])'); // Exclude anchor elements
    const searchContainer = document.getElementById('search-container');
    const leetcodeProblems = document.getElementById('leetcode-problems');
    const uploadArea = document.getElementById('upload-area');
    const customProblemArea = document.getElementById('custom-problem-area');
    const problemItems = document.querySelectorAll('.problem-item');
    const launchButton = document.getElementById('launch-button');
    
    // Track selection state
    let selectionState = {
        option: null,
        problem: null,
        file: null,
        customProblem: null
    };
    
    // Function to update launch button visibility - no longer needed since button is always visible
    // Keeping the function but emptying it in case it's called elsewhere
    function updateLaunchButtonState() {
        // Button is now always visible, so this function is no longer needed
        return;
    }
    
    // Pattern movement setup (reused from main script)
    const pattern = document.querySelector('#dot-pattern');
    
    const patternState = {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0
    };
    
    const lerp = (start, end, factor) => {
        return start + (end - start) * factor;
    };
    
    const updatePattern = () => {
        patternState.currentX = lerp(patternState.currentX, patternState.targetX, 0.1);
        patternState.currentY = lerp(patternState.currentY, patternState.targetY, 0.1);
        
        pattern.setAttribute('x', patternState.currentX.toString());
        pattern.setAttribute('y', patternState.currentY.toString());
        
        requestAnimationFrame(updatePattern);
    };
    
    updatePattern();
    
    document.addEventListener('mousemove', (e) => {
        // Update pattern offset based on mouse position
        const mouseX = e.clientX - window.innerWidth / 2;
        const mouseY = e.clientY - window.innerHeight / 2;
        
        const MAX_OFFSET = 50;
        patternState.targetX = (mouseX / window.innerWidth) * MAX_OFFSET;
        patternState.targetY = (mouseY / window.innerHeight) * MAX_OFFSET;
    });
    
    // Option Button Click Handlers with enhanced animations
    optionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add ripple effect on click
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            button.appendChild(ripple);
            
            // Calculate ripple size
            const size = Math.max(button.offsetWidth, button.offsetHeight);
            ripple.style.width = ripple.style.height = `${size}px`;
            
            // Position ripple
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Reset all buttons
            optionButtons.forEach(btn => btn.classList.remove('active'));
            
            // Set active button
            button.classList.add('active');
            
            // Get option type
            const optionType = button.getAttribute('data-option');
            
            // Update selection state
            selectionState.option = optionType;
            
            // Show/hide appropriate content with smooth transitions
            switch(optionType) {
                case 'upload':
                    fadeOut(searchContainer);
                    fadeOut(leetcodeProblems);
                    fadeOut(customProblemArea);
                    setTimeout(() => {
                        searchContainer.style.display = 'none';
                        leetcodeProblems.style.display = 'none';
                        customProblemArea.style.display = 'none';
                        uploadArea.style.display = 'flex';
                        fadeIn(uploadArea);
                    }, 300);
                    break;
                case 'custom':
                    fadeOut(searchContainer);
                    fadeOut(leetcodeProblems);
                    fadeOut(uploadArea);
                    setTimeout(() => {
                        searchContainer.style.display = 'none';
                        leetcodeProblems.style.display = 'none';
                        uploadArea.style.display = 'none';
                        customProblemArea.style.display = 'block';
                        fadeIn(customProblemArea);
                    }, 300);
                    break;
                case 'leetcode':
                    fadeOut(uploadArea);
                    fadeOut(customProblemArea);
                    setTimeout(() => {
                        uploadArea.style.display = 'none';
                        customProblemArea.style.display = 'none';
                        searchContainer.style.display = 'block';
                        leetcodeProblems.style.display = 'flex';
                        fadeIn(searchContainer);
                        fadeIn(leetcodeProblems);
                    }, 300);
                    break;
            }
            
            // No need to update launch button visibility since it's always visible
        });
    });
    
    // Helper functions for smooth transitions
    function fadeIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 50);
    }
    
    function fadeOut(element) {
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
    }
    
    // Set LeetCode as default selected option
    const leetcodeButton = document.querySelector('.option-button[data-option="leetcode"]');
    if (leetcodeButton) {
        leetcodeButton.click();
    }
    
    // Problem selection handling with animations
    problemItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Add ripple effect on click
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            item.appendChild(ripple);
            
            // Calculate ripple size
            const size = Math.max(item.offsetWidth, item.offsetHeight);
            ripple.style.width = ripple.style.height = `${size}px`;
            
            // Position ripple
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Remove selected class from all problems
            problemItems.forEach(problem => problem.classList.remove('selected'));
            
            // Add selected class to clicked problem
            item.classList.add('selected');
            
            // Update selection state
            selectionState.problem = item.querySelector('.problem-name').textContent;
            
            // No need to update launch button visibility since it's always visible
        });
    });
    
    // Add interactivity to the upload area
    const uploadButton = document.querySelector('.upload-button');
    if (uploadButton) {
        uploadButton.addEventListener('click', (e) => {
            // Add ripple effect on click
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            uploadButton.appendChild(ripple);
            
            // Calculate ripple size
            const size = Math.max(uploadButton.offsetWidth, uploadButton.offsetHeight);
            ripple.style.width = ripple.style.height = `${size}px`;
            
            // Position ripple
            const rect = uploadButton.getBoundingClientRect();
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Simulate file selection dialog
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf,.doc,.docx,.txt';
            fileInput.click();
            
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    const fileName = e.target.files[0].name;
                    // Display the file name (in a real app, you'd handle the upload)
                    const uploadAreaText = document.querySelector('.upload-area p:first-of-type');
                    if (uploadAreaText) {
                        uploadAreaText.textContent = `Selected: ${fileName}`;
                    }
                    
                    // Update selection state
                    selectionState.file = e.target.files[0];
                    
                    // No need to update launch button visibility since it's always visible
                    
                    // Add confirmation animation
                    uploadArea.classList.add('highlight');
                    setTimeout(() => {
                        if (!uploadArea.matches(':hover')) {
                            uploadArea.classList.remove('highlight');
                        }
                    }, 2000);
                }
            });
        });
    }
    
    // Handle drag and drop for upload area
    const uploadAreaElement = document.querySelector('.upload-area');
    if (uploadAreaElement) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadAreaElement.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadAreaElement.addEventListener(eventName, () => {
                uploadAreaElement.classList.add('highlight');
            }, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadAreaElement.addEventListener(eventName, () => {
                if (eventName === 'drop') {
                    // Keep highlight on drop
                    setTimeout(() => {
                        if (!uploadAreaElement.matches(':hover') && !selectionState.file) {
                            uploadAreaElement.classList.remove('highlight');
                        }
                    }, 2000);
                } else {
                    uploadAreaElement.classList.remove('highlight');
                }
            }, false);
        });
        
        uploadAreaElement.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            
            if (files.length > 0) {
                const fileName = files[0].name;
                // Display the file name (in a real app, you'd handle the upload)
                const uploadAreaText = document.querySelector('.upload-area p:first-of-type');
                if (uploadAreaText) {
                    uploadAreaText.textContent = `Selected: ${fileName}`;
                }
                
                // Update selection state
                selectionState.file = files[0];
                
                // No need to update launch button visibility since it's always visible
            }
        }, false);
    }
    
    // Search functionality for LeetCode problems
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            problemItems.forEach(item => {
                const problemName = item.querySelector('.problem-name').textContent.toLowerCase();
                
                if (problemName.includes(searchTerm)) {
                    item.style.display = 'flex';
                    // Add a subtle animation for showing items
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-5px)';
                    setTimeout(() => {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 50 * Math.random() * 10); // Staggered animation
                } else {
                    // Add a subtle animation for hiding items
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    }
    
    // Add highlight class to upload area for styling hover states
    document.querySelector('.upload-area')?.addEventListener('mouseenter', function() {
        this.classList.add('highlight');
    });
    
    document.querySelector('.upload-area')?.addEventListener('mouseleave', function() {
        if (!selectionState.file) {
            this.classList.remove('highlight');
        }
    });
    
    // Handle custom problem text input
    const customTextarea = document.querySelector('.custom-problem-area textarea');
    if (customTextarea) {
        customTextarea.addEventListener('input', (e) => {
            // Update selection state
            selectionState.customProblem = e.target.value.trim();
            
            // No need to update launch button visibility since it's always visible
        });
    }
    
    // Launch button click handler with enhanced animation
    launchButton.addEventListener('click', () => {
        // In a real app, this would navigate to the next page or start the exercise
        console.log('Launching with selection state:', selectionState);
        
        // Add a ripple effect on launch button
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        launchButton.appendChild(ripple);
        
        // Calculate ripple size
        const size = Math.max(launchButton.offsetWidth, launchButton.offsetHeight) * 2;
        ripple.style.width = ripple.style.height = `${size}px`;
        
        // Position ripple in center
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        
        // For demo purposes, let's simulate a page transition
        setTimeout(() => {
            // Add fade out animation to the whole body
            document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            document.body.style.opacity = '0';
            document.body.style.transform = 'scale(1.03)';
            
            setTimeout(() => {
                // This would be a redirect in a real app
                window.location.href = 'index.html';
            }, 500);
        }, 300);
    });
    
    // Add the ripple effect style
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});