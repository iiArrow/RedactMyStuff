let replacements = {};

// Load replacements from storage when the script is injected
chrome.storage.sync.get({ replacements: {} }, (data) => {
    replacements = data.replacements;
});

// Listen for storage updates dynamically
chrome.storage.onChanged.addListener((changes) => {
    if (changes.replacements) {
        replacements = changes.replacements.newValue;
    }
});

// Listen for messages from popup.js and update replacements ONLY for the active tab
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateReplacements") {
        chrome.storage.sync.get({ replacements: {} }, (data) => {
            replacements = data.replacements;
        });
    }
});


// Function to replace text in active input fields
function replaceText(event) {
    let target = event.target;

    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        let text = target.value || target.innerText;

        let replacedText = text;
        Object.keys(replacements).forEach((findText) => {
            let regex = new RegExp(findText, "g");
            replacedText = replacedText.replace(regex, replacements[findText]);
        });

        if (replacedText !== text) {
            if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
                target.value = replacedText;
            } else {
                target.innerText = replacedText;
            }
        }
    }
}

// Attach event listeners to replace text only in active input fields
document.addEventListener("input", replaceText);
document.addEventListener("keyup", replaceText);
