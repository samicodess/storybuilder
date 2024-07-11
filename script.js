document.addEventListener('DOMContentLoaded', () => {
    const navHome = document.getElementById('navHome');
    const navStoryBuilder = document.getElementById('navStoryBuilder');
    const navStories = document.getElementById('navStories');
    const navLogout = document.getElementById('navLogout');
    const homeSection = document.getElementById('homeSection');
    const storyBuilderSection = document.getElementById('storyBuilderSection');
    const storiesSection = document.getElementById('storiesSection');
    const editStorySection = document.getElementById('editStorySection');
    const loginSection = document.getElementById('loginSection');
    const mainHeader = document.getElementById('mainHeader');
    const sidebar = document.getElementById('sidebar');
    const storyTitle = document.getElementById('storyTitle');
    const storyContent = document.getElementById('storyContent');
    const addPredefinedChoiceBtn = document.getElementById('addPredefinedChoiceBtn');
    const choicesContainer = document.getElementById('choicesContainer');
    const saveStoryBtn = document.getElementById('saveStoryBtn');
    const storiesList = document.getElementById('storiesList');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');
    const loginError = document.getElementById('loginError');
    const userName = document.getElementById('userName');
    const predefinedChoices = document.getElementsByName('choice');
    const outcomeDropdown = document.getElementById('outcomeDropdown');
    const editStoryTitle = document.getElementById('editStoryTitle');
    const editStoryContent = document.getElementById('editStoryContent');
    const editChoicesContainer = document.getElementById('editChoicesContainer');
    const addEditPredefinedChoiceBtn = document.getElementById('addEditPredefinedChoiceBtn');
    const editPredefinedChoices = document.getElementsByName('editChoice');
    const editOutcomeDropdown = document.getElementById('editOutcomeDropdown');
    const updateStoryBtn = document.getElementById('updateStoryBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    const users = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' }
    ];

    let stories = JSON.parse(localStorage.getItem('stories')) || [];
    let currentUser = localStorage.getItem('currentUser');
    let editIndex = null;

    function showSection(section) {
        homeSection.classList.add('hidden');
        storyBuilderSection.classList.add('hidden');
        storiesSection.classList.add('hidden');
        editStorySection.classList.add('hidden');
        loginSection.classList.add('hidden');
        section.classList.remove('hidden');
    }

    function showSidebar(show) {
        if (show) {
            sidebar.classList.remove('hidden');
        } else {
            sidebar.classList.add('hidden');
        }
    }

    function showHeader(show) {
        if (show) {
            mainHeader.classList.remove('hidden');
        } else {
            mainHeader.classList.add('hidden');
        }
    }

    navHome.addEventListener('click', () => showSection(homeSection));
    navStoryBuilder.addEventListener('click', () => showSection(storyBuilderSection));
    navStories.addEventListener('click', () => showSection(storiesSection));
    navLogout.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        showHeader(false);
        showSidebar(false);
        showSection(loginSection);
    });

    if (currentUser) {
        showHeader(true);
        showSidebar(true);
        showSection(homeSection);
        userName.textContent = currentUser;
    } else {
        showHeader(false);
        showSidebar(false);
        showSection(loginSection);
    }

    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            currentUser = username;
            localStorage.setItem('currentUser', currentUser);
            showHeader(true);
            showSidebar(true);
            showSection(homeSection);
            userName.textContent = currentUser;
            loginError.classList.add('hidden');
        } else {
            loginError.classList.remove('hidden');
        }
    });

    addPredefinedChoiceBtn.addEventListener('click', () => {
        const selectedChoice = Array.from(predefinedChoices).find(choice => choice.checked);
        const selectedOutcome = outcomeDropdown.value;

        if (selectedChoice) {
            const choiceItem = document.createElement('div');
            choiceItem.className = 'choiceItem';
            choiceItem.innerHTML = `
                <span class="choiceText">${selectedChoice.value}</span>: <span class="choiceOutcome">${selectedOutcome}</span>
                <button class="removeChoiceBtn">Remove</button>
            `;
            choicesContainer.appendChild(choiceItem);

            choiceItem.querySelector('.removeChoiceBtn').addEventListener('click', () => {
                choiceItem.remove();
            });
        }
    });

    saveStoryBtn.addEventListener('click', () => {
        const storyData = {
            title: storyTitle.value,
            content: storyContent.value,
            choices: Array.from(choicesContainer.querySelectorAll('.choiceItem')).map(item => ({
                text: item.querySelector('.choiceText').textContent,
                outcome: item.querySelector('.choiceOutcome').textContent
            }))
        };

        stories.push(storyData);
        localStorage.setItem('stories', JSON.stringify(stories));
        alert('Story saved! You can now view it in the Stories section.');
        resetForm();
        loadStories();
        showSection(storiesSection);
    });

    function resetForm() {
        storyTitle.value = '';
        storyContent.value = '';
        choicesContainer.innerHTML = '';
    }

    function loadStories() {
        storiesList.innerHTML = '';
        stories.forEach((story, index) => {
            const storyCard = document.createElement('div');
            storyCard.className = 'storyCard';
            storyCard.innerHTML = `
                <h3>${story.title}</h3>
                <p>${story.content.substring(0, 100)}...</p>
                <p><strong>Choices:</strong> ${story.choices?.map(choice => choice.text).join(', ')}</p>
                <button class="editStoryBtn" data-index="${index}">Edit</button>
                <button class="removeStoryBtn" data-index="${index}">Remove</button>
            `;
            storiesList.appendChild(storyCard);

            storyCard.querySelector('.editStoryBtn').addEventListener('click', () => {
                editIndex = index;
                openEditForm(story);
            });

            storyCard.querySelector('.removeStoryBtn').addEventListener('click', () => {
                removeStory(index);
            });
        });
    }

    function openEditForm(story) {
        editStoryTitle.value = story.title;
        editStoryContent.value = story.content;
        editChoicesContainer.innerHTML = '';

        (story.choices || []).forEach(choice => {
            const choiceItem = document.createElement('div');
            choiceItem.className = 'choiceItem';
            choiceItem.innerHTML = `
                <span class="choiceText">${choice.text}</span>: <span class="choiceOutcome">${choice.outcome}</span>
                <button class="removeChoiceBtn">Remove</button>
            `;
            editChoicesContainer.appendChild(choiceItem);

            choiceItem.querySelector('.removeChoiceBtn').addEventListener('click', () => {
                choiceItem.remove();
            });
        });

        showSection(editStorySection);
    }

    addEditPredefinedChoiceBtn.addEventListener('click', () => {
        const selectedChoice = Array.from(editPredefinedChoices).find(choice => choice.checked);
        const selectedOutcome = editOutcomeDropdown.value;

        if (selectedChoice) {
            const choiceItem = document.createElement('div');
            choiceItem.className = 'choiceItem';
            choiceItem.innerHTML = `
                <span class="choiceText">${selectedChoice.value}</span>: <span class="choiceOutcome">${selectedOutcome}</span>
                <button class="removeChoiceBtn">Remove</button>
            `;
            editChoicesContainer.appendChild(choiceItem);

            choiceItem.querySelector('.removeChoiceBtn').addEventListener('click', () => {
                choiceItem.remove();
            });
        }
    });

    updateStoryBtn.addEventListener('click', () => {
        const updatedStory = {
            title: editStoryTitle.value,
            content: editStoryContent.value,
            choices: Array.from(editChoicesContainer.querySelectorAll('.choiceItem')).map(item => ({
                text: item.querySelector('.choiceText').textContent,
                outcome: item.querySelector('.choiceOutcome').textContent
            }))
        };

        stories[editIndex] = updatedStory;
        localStorage.setItem('stories', JSON.stringify(stories));
        alert('Story updated!');
        loadStories();
        showSection(storiesSection);
    });

    cancelEditBtn.addEventListener('click', () => {
        showSection(storiesSection);
    });

    function removeStory(index) {
        stories.splice(index, 1);
        localStorage.setItem('stories', JSON.stringify(stories));
        loadStories();
    }

    loadStories();
});
