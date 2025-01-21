//Generation

import QRCodeGen from "./generator.js";
import Settings from "./settings.js";

const generator = new QRCodeGen();
const settings = new Settings();

async function drawQR(data, isDefault) {
    document.getElementById("qrcode").innerHTML = "";

    const settingsObj = await settings.getSettings();

    if (isDefault) {
        generator.makeQR(document.getElementById("qrcode"), 256, 256, data, settingsObj);
    } else if (settingsObj.height <= 256 || settingsObj.width <= 256) {
        generator.makeQR(document.getElementById("qrcode"), parseInt(settingsObj.width), parseInt(settingsObj.height), data, settingsObj);
    } else if (settingsObj.height > 256 || settingsObj.width > 256) {
        const qr_div = document.createElement("div");
        generator.makeQR(qr_div, parseInt(settingsObj.width), parseInt(settingsObj.height), data, settingsObj);

        chrome.tabs.create({ url: "../new_tab/new.html" }, function (tab) {
            chrome.tabs.onUpdated.addListener(function (tabId, info) {
                if (tabId === tab.id && info.status === 'complete') {
                    chrome.tabs.sendMessage(tab.id, { qrHTML: qr_div.innerHTML });
                }
            });
        });
    }
}

window.onload = function () {
    drawQR("Check my other projects: https://github.com/SnBlst2255", true);
};

document.getElementById("generate-btn").addEventListener("click", function () {
    const data = document.getElementById("url-input").value;
    if (!data) return;
    drawQR(data);
});

document.getElementById("url-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        drawQR(this.value);
    }
});

//settings

async function openSettings() {
    try {
        const settingsObj = await settings.getSettings();
        
        document.getElementById("background").value = settingsObj.background;
        document.getElementById("foreground").value = settingsObj.foreground;
        document.getElementById("width").value = settingsObj.width;
        document.getElementById("height").value = settingsObj.height;

        document.getElementById("settings-modal").style.display = "flex";
    } catch (error) {
        console.error("Error opening settings:", error);
        alert("Failed to load settings. Please try again.");
    }
}

async function closeSettings() {
    try {
        const background = document.getElementById("background").value;
        const foreground = document.getElementById("foreground").value;
        const width = document.getElementById("width").value;
        const height = document.getElementById("height").value;

        if (!background || !foreground || !width || !height) {
            alert("All fields must be filled out.");
            return false;
        }

        if (width <= 0 || height <= 0) {
            alert("Width and height must be positive values.");
            return false;
        }

        await settings.updateSettings(width, height, background, foreground);
        document.getElementById("settings-modal").style.display = "none";
    } catch (error) {
        console.error("Error closing settings:", error);
        alert("Failed to save settings. Please try again.");
    }
}

document.getElementById("settings-btn").addEventListener("click", async function () {
    openSettings();
});

document.getElementById("apply-btn").addEventListener("click", async function () {
    closeSettings();
});

document.getElementById("reset").addEventListener("click", function () {
    document.getElementById("height").value = 256;
    document.getElementById("width").value = 256;

    document.getElementById("background").value = "#1C1C1E";
    document.getElementById("foreground").value = "#FFFFFF";
});

//links
document.getElementById("qrcodejs").addEventListener("click", function () {
    chrome.tabs.create({ url: "https://davidshimjs.github.io/qrcodejs/" });
});