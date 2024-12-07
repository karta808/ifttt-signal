export function Name() {
    return "IFTTT RGB Controller";
}

export function Version() {
    return "1.0.0";
}

export function Type() {
    return "addon"; // This will make it appear under Addons.
}

export function Publisher() {
    return "Your Name";
}

let webhookKey = "";
let eventName = "";
let logs = "";

export function Initialize() {
    device.setName("IFTTT RGB Controller");
    device.log("Addon Initialized");
    logs += "Addon Initialized\n";
}

export function Render() {
    try {
        const { red, green, blue } = device.ledColor;
        const currentHex = rgbToHex(red, green, blue);

        device.log(`Current RGB Hex: ${currentHex}`);
        logs += `RGB Color: ${currentHex}\n`;

        if (webhookKey && eventName) {
            const command = `send_color_${currentHex.replace("#", "")}`;
            sendToIFTTT(command);
        } else {
            device.log("Webhook Key or Event Name not set.");
            logs += "Webhook Key or Event Name missing.\n";
        }
    } catch (error) {
        device.log(`Render Error: ${error.message}`);
        logs += `Render Error: ${error.message}\n`;
    }
}

export function Shutdown() {
    device.log("Addon Terminated");
    logs += "Addon Terminated\n";
}

// Helper: Convert RGB to Hex
function rgbToHex(r, g, b) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

// Helper: Send a Command to IFTTT
async function sendToIFTTT(command) {
    if (!webhookKey || !eventName) {
        return;
    }

    const url = `https://maker.ifttt.com/trigger/${eventName}/with/key/${webhookKey}`;
    const payload = { value1: command };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            device.log(`IFTTT Triggered: ${command}`);
            logs += `IFTTT Triggered: ${command}\n`;
        } else {
            device.log(`Failed to trigger IFTTT: ${response.status}`);
            logs += `Failed to trigger IFTTT: ${response.status}\n`;
        }
    } catch (error) {
        device.log(`IFTTT Error: ${error.message}`);
        logs += `IFTTT Error: ${error.message}\n`;
    }
}

// Functions for UI Integration
export function setWebhookKey(key) {
    webhookKey = key;
    device.log(`Webhook Key Set: ${key}`);
    logs += `Webhook Key Set\n`;
}

export function setEventName(event) {
    eventName = event;
    device.log(`Event Name Set: ${event}`);
    logs += `Event Name Set\n`;
}

export function clearLogs() {
    logs = "";
    device.log("Logs Cleared");
}

export function getLogs() {
    return logs;
}
