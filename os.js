const desktop = document.getElementById('desktop');
let highestZIndex = 1;

// 1. Live Taskbar Clock
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock(); // Run once immediately

// 2. The Window Factory
function createWindow(title, contentHTML) {
    const win = document.createElement('div');
    win.className = 'os-window';
    
    // Stagger new windows slightly so they cascade
    const offset = (desktop.children.length * 30) + 50; 
    win.style.top = `${offset}px`;
    win.style.left = `${offset}px`;
    
    // Z-Index Management: Bring to front on creation
    highestZIndex++;
    win.style.zIndex = highestZIndex;

    // Z-Index Management: Bring to front on click
    win.addEventListener('mousedown', () => {
        highestZIndex++;
        win.style.zIndex = highestZIndex;
    });

    // Build Header
    const header = document.createElement('div');
    header.className = 'window-header';
    header.innerHTML = `<span>${title}</span>`;

    // Build Close Button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.onclick = () => win.remove(); // Destroys the HTML element
    header.appendChild(closeBtn);

    // Build Content Area
    const content = document.createElement('div');
    content.className = 'window-content';
    content.innerHTML = contentHTML;

    // Assemble and inject into Desktop
    win.appendChild(header);
    win.appendChild(content);
    desktop.appendChild(win);

    // Attach dragging physics
    makeDraggable(win, header);
}

// 3. The Dragging Engine
function makeDraggable(windowElement, dragHandle) {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    dragHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = windowElement.offsetLeft;
        initialTop = windowElement.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        // Calculate how far the mouse has moved
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // Apply new position
        windowElement.style.left = `${initialLeft + dx}px`;
        windowElement.style.top = `${initialTop + dy}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// 4. Initialization
window.onload = () => {
    // Spawns an initial welcome window when the page loads
    createWindow('Project Nexus Terminal', '<p>Welcome. System initialized.<br>Status: Online</p>');
};

// 5. Nexus Browser App (DuckDuckGo Edition)
function openBrowser() {
    const browserHTML = `
        <div class="browser-container">
            <div class="browser-toolbar">
                <input type="text" class="browser-input" placeholder="Search the web or enter URL..." onkeydown="if(event.key === 'Enter') navigateBrowser(this)">
                <button class="browser-btn" onclick="navigateBrowser(this.previousElementSibling)">🔍</button>
            </div>
            <iframe class="browser-frame" src="https://duckduckgo.com" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>
        </div>
    `;
    
    createWindow('Nexus Browser', browserHTML);
}

function navigateBrowser(inputElement) {
    const frame = inputElement.parentElement.nextElementSibling;
    let query = inputElement.value.trim();
    
    if (!query) return;

    // Check if the user typed a website URL or a search term
    if (query.includes('.') && !query.includes(' ')) {
        // Add https:// if the user forgot it
        if (!query.startsWith('http://') && !query.startsWith('https://')) {
            query = 'https://' + query;
        }
        frame.src = query;
    } else {
        // Perform a private search using DuckDuckGo
        frame.src = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
    }
}
