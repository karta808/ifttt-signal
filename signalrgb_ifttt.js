import tcp from "@SignalRGB/tcp";

export function Name() {
    return "IFTTT RGB Controller";
}

export function Version() {
    return "1.0.0";
}

export function Type() {
    return "network";
}

export function Publisher() {
    return "Your Name";
}

export function Size() {
    return [1, 1];
}

// RGB to Command Mapping
const rgbToCommand = {
    "#FF0000": "turn_red",   // Red
    "#00FF00": "turn_green", // Green
    "#0000FF": "turn_blue",  // Blue
    "#FFFFFF": "turn_white"  // White
};

// IFTTT Webhook Configuration
const webhookKey = "your_ifttt_key"; // Replace with your actual IFTTT Webhook Key
const eventName = "smart_led_control"; // Replace with your IFTTT Event Name

// Utility to convert RGB values to HEX
function rgbToHex(r, g, b) {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

// Function to send a command to IFTTT
async function sendToIFTTT(command) {
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
        } else {
            device.log(`Failed to trigger IFTTT: ${response.status}`);
        }
    } catch (error) {
        device.log(`Error Sending to IFTTT: ${error}`);
    }
}

export function Initialize() {
    device.setName("IFTTT RGB Controller");
    device.log("Plugin Initialized");
}

export function Render() {
    try {
        // Fetch the current RGB values from the device
        const { red, green, blue } = device.ledColor; // Assuming `ledColor` fetches current RGB values
        const currentHex = rgbToHex(red, green, blue);

        device.log(`Current RGB Hex: ${currentHex}`);

        // Match RGB to a predefined command and send it to IFTTT
        const command = rgbToCommand[currentHex];
        if (command) {
            sendToIFTTT(command);
        } else {
            device.log(`No matching command for RGB: ${currentHex}`);
        }
    } catch (error) {
        device.log(`Error in Render function: ${error.message}`);
    }
}

export function Shutdown() {
    device.log("Plugin Terminated");
}
