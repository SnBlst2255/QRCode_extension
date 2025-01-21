export default class Settings {
    async updateSettings(width, height, background, foreground) {
        try {
            await new Promise((resolve, reject) => {
                chrome.storage.local.set({ background, foreground, width, height }, () => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(`Error updating settings: ${chrome.runtime.lastError.message}`));
                        } else {
                            resolve();
                        }
                    }
                );
            });
        } catch (error) {
            throw new Error(`Unexpected error: ${error.message}`);
        }
    }

    async getSettings() {
        try {
            const result = await new Promise((resolve, reject) => {
                chrome.storage.local.get(null, (result) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(`Error getting settings: ${chrome.runtime.lastError.message}`));
                    } else {
                        resolve(result);
                    }
                });
            });

            if (Object.keys(result).length === 0) {
                const defaultSettings = { background: "#1C1C1E", foreground: "#FFFFFF", width: "256", height: "256" };
                await new Promise((resolve, reject) => {
                    chrome.storage.local.set(defaultSettings, () => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(`Error setting default settings: ${chrome.runtime.lastError.message}`));
                        } else {
                            resolve();
                        }
                    });
                });
                return defaultSettings;
            } else {
                return result;
            }
        } catch (error) {
            throw new Error(`Unexpected error: ${error.message}`);
        }
    }
}
