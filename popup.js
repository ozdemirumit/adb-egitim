document.getElementById('openPage').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://adbs.uab.gov.tr/users/my-educations' });
});
