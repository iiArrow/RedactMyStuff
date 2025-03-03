document.getElementById("saveRule").addEventListener("click", () => {
    let findText = document.getElementById("findText").value.trim();
    let replaceText = document.getElementById("replaceText").value.trim();

    if (findText && replaceText) {
        chrome.storage.sync.get({ replacements: {} }, (data) => {
            let replacements = data.replacements;
            replacements[findText] = replaceText;

            chrome.storage.sync.set({ replacements }, () => {
                updateUI(replacements);
                notifyCurrentTabToUpdate();
            });
        });
    }
});

// Function to update the UI and add delete buttons
function updateUI(replacements) {
    let list = document.getElementById("replacementList");
    list.innerHTML = "";
    
    Object.keys(replacements).forEach((key) => {
        let li = document.createElement("li");

        let textSpan = document.createElement("span");
        textSpan.textContent = `"${key}" → "${replacements[key]}"`;

        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.innerHTML = "✖";
        deleteBtn.setAttribute("data-key", key);
        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            deleteRule(key);
        });

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

// Function to delete a replacement rule AND UPDATE ONLY THE CURRENT TAB
function deleteRule(key) {
    chrome.storage.sync.get({ replacements: {} }, (data) => {
        let replacements = data.replacements;
        delete replacements[key]; // Remove the key from the storage

        chrome.storage.sync.set({ replacements }, () => {
            updateUI(replacements);
            notifyCurrentTabToUpdate(); // 🔥 Force content script to update
        });
    });
}

// 🔥 Function to notify only the active tab to refresh replacements
function notifyCurrentTabToUpdate() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => {
                    chrome.runtime.sendMessage({ action: "updateReplacements" });
                }
            });
        }
    });
}


// Load replacements when the popup opens
chrome.storage.sync.get({ replacements: {} }, (data) => {
    updateUI(data.replacements);
});
