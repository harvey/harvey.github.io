// Mapping of several popular languages to their GitHub colors.
const languageColors = {
    "JavaScript": "#f1e05a",
    "Python": "#3572A5",
    "Java": "#b07219",
    "Ruby": "#701516",
    "CSS": "#563d7c",
    "C++": "#f34b7d",
    "HTML": "#e34c26",
    "TypeScript": "#2b7489"
    // You can add more languages as needed.
};

async function showSection(section) {
    const container = document.getElementById('chatContainer');
    const typing = document.getElementById('typingIndicator');
    
    // Show typing indicator immediately
    typing.style.display = 'block';
    
    // Create a message container and hide it initially until images load
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.style.display = 'none'; // Hide the message initially
    
    // Clone the template for the requested section.
    const template = document.getElementById(`${section}Template`);
    const clone = template.content.cloneNode(true);
    
    // Locate the bot-message element inside the clone and add the delete button inside it
    const botMessage = clone.querySelector('.bot-message');
    if (botMessage) {
        // Set relative positioning so delete button positions correctly
        botMessage.style.position = 'relative';
        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-chat';
        deleteButton.textContent = '×'; // cross icon
        deleteButton.addEventListener('click', () => {
            // Add fade-out animation class on click
            messageDiv.classList.add('fade-out');
            // Once the animation has ended, remove the message and adjust the scroll smoothly
            messageDiv.addEventListener('animationend', () => {
                messageDiv.remove();
                container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            });
        });
        botMessage.appendChild(deleteButton);
    }
    
    // Process projects section if needed
    if (section === 'projects') {
        const grid = clone.querySelector('.projects-grid');
        const repos = await fetchGitHubRepos('harvey');
        grid.innerHTML = repos;
        
        // Set up click handlers for each project item after DOM update
        grid.querySelectorAll('.project-item').forEach(item => {
            item.addEventListener('click', handleProjectClick(
                item.dataset.repo,
                item.dataset.owner
            ));
        });
    }
    
    // Append the clone to the message container and to the chat container
    messageDiv.appendChild(clone);
    container.appendChild(messageDiv);
    
    // Wait for all images in the message to load before revealing it
    await waitForImages(messageDiv);
    
    // Hide the typing indicator and show the loaded message
    typing.style.display = 'none';
    messageDiv.style.display = 'block';
    
    // Scroll to the bottom of the chat container.
    container.scrollTop = container.scrollHeight;

    if (section === 'about') {
        updateOverallLanguageBreakdown('harvey');
    }
}

let temp = null;


async function fetchGitHubRepos(username) {
    //console.log(temp);
    if(temp) {
        return temp;
    }
    else{
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        repos = await response.json();


        // Sort repositories:
        // - First, by total count of (stargazers_count + forks_count) in descending order.
        // - If equal, sort alphabetically by repo name.
        repos.sort((a, b) => {
            const totalA = a.stargazers_count + a.forks_count;
            const totalB = b.stargazers_count + b.forks_count;
            return totalB - totalA || a.name.localeCompare(b.name);
        });
        // Filter out unwanted repos (e.g., 'harvey.github.io')
        temp = repos.filter(r => !['harvey.github.io'].includes(r.name))
            .map(repo => {
                const starsText = repo.stargazers_count > 0 
                    ? `<span class="text-info">⭐ ${repo.stargazers_count}</span>` : "";
                const forksText = repo.forks_count > 0 
                    ? `<span class="text-info">🍴 ${repo.forks_count}</span>` : "";
                const languageBadge = repo.language 
                    ? `<span class="badge badge-language" style="background-color: ${languageColors[repo.language] || '#ccc'};">${repo.language}</span>` : "";
                const description = repo.description ? repo.description : "No description available";
                
                return `
                    <div class="project-item" data-repo="${repo.name}" data-owner="${username}">
                        <div class="project-info">
                            <div class="project-name">${repo.name}</div>
                            
                            <div class="project-description">${description}</div>
                            <div class="project-stats">
                                ${starsText}
                                ${forksText}
                                ${languageBadge}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
    return temp;
}


function handleProjectClick(repoName, owner) {
    return async function() {
        const typing = document.getElementById('typingIndicator');
        const container = document.getElementById('chatContainer');
        
        // Show typing indicator immediately
        typing.style.display = 'block';
        try {
            // Fetch README content from GitHub
            const readmeResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repoName}/readme`,
                { headers: { 'Accept': 'application/vnd.github.v3.raw' } }
            );
            const readmeContent = await readmeResponse.text();
            const repoUrl = `https://github.com/${owner}/${repoName}`;
            
            // Convert Markdown to HTML
            const htmlContent = marked.parse(readmeContent);
            
            // Clone the readme template and set its content
            const template = document.getElementById('readmeTemplate');
            const clone = template.content.cloneNode(true);
            clone.querySelector('.markdown-content').innerHTML = htmlContent;
            clone.querySelector('.repo-link a').href = repoUrl;
            
            // Create a message container, hide it initially
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message';
            messageDiv.style.display = 'none'; // Hide until images load
            
            // Locate the bot-message element and add the delete button inside it
            const botMessage = clone.querySelector('.bot-message');
            if (botMessage) {
                botMessage.style.position = 'relative';
                const deleteButton = document.createElement('span');
                deleteButton.className = 'delete-chat';
                deleteButton.textContent = '×'; // cross icon
                deleteButton.addEventListener('click', () => {
                    messageDiv.classList.add('fade-out');
                    messageDiv.addEventListener('animationend', () => {
                        messageDiv.remove();
                    });
                });
                botMessage.appendChild(deleteButton);
            }
            
            messageDiv.appendChild(clone);
            container.appendChild(messageDiv);
            
            // Wait until all images within the message have loaded
            await waitForImages(messageDiv);
            
            // Once images are loaded, hide the typing indicator and reveal the message
            typing.style.display = 'none';
            messageDiv.style.display = 'block';
            
            // Scroll to the bottom of the chat container
            container.scrollTop = container.scrollHeight;
            
            // Double-check scroll position in case layout changed
            const scrollCheck = () => {
                const prevHeight = container.scrollHeight;
                container.scrollTop = container.scrollHeight;
                if (container.scrollHeight !== prevHeight) {
                    requestAnimationFrame(scrollCheck);
                }
            };
            requestAnimationFrame(scrollCheck);
        } catch (error) {
            typing.style.display = 'none';
            const errorMessage = document.createElement('div');
            errorMessage.className = 'bot-message';
            errorMessage.innerHTML = `❌ Failed to load README for <strong>${repoName}</strong>: ${error.message}`;
            container.appendChild(errorMessage);
            container.scrollTop = container.scrollHeight;
        }
    };
}

function waitForImages(element) {
return new Promise((resolve) => {
const images = element.getElementsByTagName('img');
if (images.length === 0) return resolve();

let loadedCount = 0;
const totalImages = images.length;

const checkLoaded = () => {
    loadedCount++;
    
    // Force layout recalculation after each image load
    void element.offsetHeight;
    
    if (loadedCount === totalImages) {
        // Final layout check
        requestAnimationFrame(resolve);
    }
};

Array.from(images).forEach(img => {
    if (img.complete) {
        checkLoaded();
    } else {
        img.addEventListener('load', checkLoaded);
        img.addEventListener('error', checkLoaded);
    }
});
});
}

async function fetchMostUsedLanguages(username) {
const response = await fetch(`https://api.github.com/users/${username}/repos`);
const repos = await response.json();
const languageCounts = {};

// Count languages for each repository (ignoring excluded ones)
repos.filter(r => !['harvey.github.io'].includes(r.name)).forEach(repo => {
if (repo.language) {
    languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
}
});

// Sort languages by count (descending) and then alphabetically if counts are equal.
const sortedLanguages = Object.keys(languageCounts).sort((a, b) => {
const diff = languageCounts[b] - languageCounts[a];
return diff !== 0 ? diff : a.localeCompare(b);
});

// Build a text-based HTML snippet listing languages and their counts.
return sortedLanguages
.map(lang => `<div>${lang}: ${languageCounts[lang]} repo${languageCounts[lang] > 1 ? 's' : ''}</div>`)
.join('');
}

// Computes each project's popularity percentage relative to the total popularity of all projects.
async function fetchProjectPercentages(username) {
console.log(repos);
if(!repos) {
const response = await fetch(`https://api.github.com/users/${username}/repos`);
repos = await response.json();

}

// Filter out unwanted repos (e.g., 'harvey.github.io')
const filteredRepos = repos.filter(r => !['harvey.github.io'].includes(r.name));

let totalPopularity = 0;
// Calculate each repo's popularity and the overall sum.
filteredRepos.forEach(repo => {
repo.popularity = repo.stargazers_count + repo.forks_count;
totalPopularity += repo.popularity;
});

// Build an array that includes each repo's name, its popularity, and its percentage.
const projectPercentages = filteredRepos.map(repo => {
const percentage = totalPopularity > 0 ? ((repo.popularity / totalPopularity) * 100).toFixed(1) : "0.0";
return { 
name: repo.name, 
popularity: repo.popularity, 
totalPopularity: totalPopularity, 
percentage: percentage 
};
});

return projectPercentages;
}

// Computes the overall popularity percentage for each language based on repos' popularity.
// In this case, popularity is again measured as stars + forks.
async function fetchLanguagePopularityPercentages(username) {
const response = await fetch(`https://api.github.com/users/${username}/repos`);
const repos = await response.json();
// Only consider repositories with a defined language, and filter out unwanted ones.
const filteredRepos = repos.filter(r => !['harvey.github.io'].includes(r.name) && r.language);

let overallPopularity = 0;
const langPopularity = {};

filteredRepos.forEach(repo => {
const pop = repo.stargazers_count + repo.forks_count;
overallPopularity += pop;
if (repo.language) {
langPopularity[repo.language] = (langPopularity[repo.language] || 0) + pop;
}
});

// Build an object array for each language with its overall popularity and percentage.
const languagePercentages = Object.keys(langPopularity).map(lang => {
const percentage = overallPopularity > 0 ? ((langPopularity[lang] / overallPopularity) * 100).toFixed(1) : "0.0";
return { 
language: lang, 
popularity: langPopularity[lang], 
overallPopularity: overallPopularity, 
percentage: percentage 
};
});

// Sort languages by descending popularity, or alphabetically if equal.
languagePercentages.sort((a, b) => {
const diff = b.popularity - a.popularity;
return diff !== 0 ? diff : a.language.localeCompare(b.language);
});

return languagePercentages;
}

// Testing function: It calls both functions and logs the output to the console.
async function testOverallPercentages(username) {
const projectPercents = await fetchProjectPercentages(username);
//console.log("OVERALL Project Percentages:", projectPercents);


const languagePercents = await fetchLanguagePopularityPercentages(username);
//console.log("OVERALL Language Percentages:", languagePercents);
}

// Replace 'harvey' with your GitHub username if needed.
//testOverallPercentages('harvey');

let repos = null;

async function getRepos(username) {
if(repos) {
return repos;
}
else{
const response = await fetch(`https://api.github.com/users/${username}/repos`);
repos = await response.json();
return repos;
}
}


async function fetchLanguageBreakdownForEachProject(username) {
// Fetch all repositories for the specified user.
if(!repos) {
const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
repos = await reposResponse.json();
}

// Exclude unwanted repos (for instance, 'harvey.github.io')
const filteredRepos = repos.filter(repo => !['harvey.github.io'].includes(repo.name));

// For each repository, fetch its language breakdown.
const breakdownPromises = filteredRepos.map(async repo => {
// GitHub returns an object with language keys and bytes of code in that language.
const languagesResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`);
const languagesData = await languagesResponse.json();

// Sum the bytes across all languages in this repo.
const totalBytes = Object.values(languagesData).reduce((sum, bytes) => sum + bytes, 0);

return {
repoName: repo.name,
languagesData: languagesData, // e.g. { JavaScript: 12345, HTML: 6789, ... }
totalBytes: totalBytes
};
});

// Wait for all repositories to be processed.
const breakdownResults = await Promise.all(breakdownPromises);
return breakdownResults;
}

// Global variable to cache the breakdown results.
window.cachedOverallLanguageBreakdownResults = window.cachedOverallLanguageBreakdownResults || null;

/**
* Updates the About section with the overall language breakdown.
* Caches the computed breakdown results globally so that subsequent clicks only rebuild
* the table. Also, since there may be multiple language containers in the DOM (one per message),
* we update only the last one.
* After updating the content, we scroll the chat container to the bottom.
*/
async function updateOverallLanguageBreakdown(username) {
// Instead of getElementById, select all elements with id "languagesContent"
// and pick the last one.
const containers = document.querySelectorAll('#languagesContent');
if (!containers || containers.length === 0) {
console.error("Container with id 'languagesContent' not found.");
return;
}
const container = containers[containers.length - 1];

// Helper function to scroll the chat container to the bottom.
function scrollToBottom() {
const chatContainer = document.getElementById('chatContainer');
if (chatContainer) {
chatContainer.scrollTop = chatContainer.scrollHeight;
}
}

// If cached breakdown exists, rebuild the table and update the container.
if (window.cachedOverallLanguageBreakdownResults) {
const tableHtml = buildLanguageBreakdownTable(window.cachedOverallLanguageBreakdownResults);
container.innerHTML = tableHtml;
scrollToBottom();
return;
}

try {
// Fetch all repositories for the user.
const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
const repos = await reposResponse.json();

// Filter out unwanted repositories.
const filteredRepos = repos.filter(repo => repo.name !== 'harvey.github');

// Aggregate overall language bytes.
const overallLanguageBytes = {};
let overallTotalBytes = 0;

// For each repository, fetch its language data.
await Promise.all(filteredRepos.map(async repo => {
const languagesResponse = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`);
const languagesData = await languagesResponse.json();
Object.keys(languagesData).forEach(lang => {
overallLanguageBytes[lang] = (overallLanguageBytes[lang] || 0) + languagesData[lang];
overallTotalBytes += languagesData[lang];
});
}));

// Build an array with the breakdown details.
const breakdownArray = Object.keys(overallLanguageBytes).map(lang => {
const bytes = overallLanguageBytes[lang];
const percentage = overallTotalBytes > 0 ? ((bytes / overallTotalBytes) * 100).toFixed(1) : "0.0";
return { language: lang, percentage, bytes };
});
// Sort languages from highest to lowest.
breakdownArray.sort((a, b) => b.bytes - a.bytes);

// Cache the breakdown results globally.
window.cachedOverallLanguageBreakdownResults = breakdownArray;

// Build and insert the HTML table.
const tableHtml = buildLanguageBreakdownTable(breakdownArray);
container.innerHTML = tableHtml;
// Scroll to bottom after updating.
scrollToBottom();
} catch (error) {
console.error("Error updating overall language breakdown:", error);
}
}

/**
* Helper function that builds the bar string.
* If barCount is less than or equal to the phrase length, it returns the first barCount characters.
* If barCount is greater than the phrase length, it returns the full phrase 
* with the remaining characters replaced by dots.
*/
function buildBarString(barCount) {
const phrase = "MostUsedLanguages";
if (barCount <= phrase.length) {
return phrase.slice(0, barCount);
} else {
return phrase + ".".repeat(barCount - phrase.length);
}
}

/**
* Helper function to build the language breakdown HTML table
* from the breakdown array.
* Note: On mobile devices the bars are scaled down to 0.4x their length.
*/
function buildLanguageBreakdownTable(breakdownArray) {
// Defined language colors.
const languageColors = {
"JavaScript": "#f1e05a",
"Python": "#3572A5",
"CSS": "#563d7c",
"HTML": "#e34c26",
"Batchfile": "#C1F12E",
"Shell": "#89e051"
};

// Base scale factor for PC.
const baseScaleFactor = 5;
// Adjust the effective scale factor for mobile devices.
let effectiveScaleFactor = baseScaleFactor;
if (window.innerWidth < 768) {
effectiveScaleFactor = baseScaleFactor / 0.8; // making the bars 0.4x as big on mobile
}

// The phrase to use continuously for the bars.
const phrase = "IIIIIIIIIIIIIIIIIIIIIIIIII"; // CHANGE PHRASE WHENEVER U WANT :D
// This offset will persist across rows, so the phrase never restarts on each line.
let phraseOffset = 0;

// Helper function to build the bar string for a given barCount,
// using characters from 'phrase' starting at phraseOffset.
function getBarString(barCount) {
let result = "";
// Use available letters from the phrase if any remain.
if (phraseOffset < phrase.length) {
const available = phrase.length - phraseOffset;
const portion = Math.min(barCount, available);
result += phrase.substring(phraseOffset, phraseOffset + portion);
phraseOffset += portion;
barCount -= portion;
}
// If additional characters are needed, append dots.
if (barCount > 0) {
result += ".".repeat(barCount);
}
return result;
}

let tableHtml = '<table style="width: 50%; margin: auto; border-collapse: collapse;">';
tableHtml += '<thead><tr>';
tableHtml += '<th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Language</th>';
tableHtml += '<th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Breakdown</th>';
tableHtml += '</tr></thead>';
tableHtml += '<tbody>';

breakdownArray.forEach(item => {
const color = languageColors[item.language] || '#ccc';
// Calculate the intended bar length.
const barCount = Math.max(1, Math.round(parseFloat(item.percentage) / effectiveScaleFactor));
// Use the helper to generate the continuous bar string.
const bar = getBarString(barCount);

tableHtml += `<tr>
<td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.language}</td>
<td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right; white-space: nowrap;">
<span style="color: ${color}; font-weight: bold; white-space: pre; display: inline-block;">${bar}</span>
<span style="display: inline-block; margin-left: 10px; width: 3em; text-align: right;">${item.percentage}%</span>
</td>
</tr>`;
});

tableHtml += '</tbody></table>';
return tableHtml;
}

