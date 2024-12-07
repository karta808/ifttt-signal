export const name = "IFTTT RGB Controller";
export const author = "Your Name";
export const version = "1.0.0";
export const description = "Fetches RGB values, maps them to commands, and triggers IFTTT webhooks.";
export const devices = ["all"];
export const updateRate = 1000; // Updates every second

// IFTTT Webhook Configuration
const webhookKey = "your_ifttt_key"; // Replace with your actual IFTTT Webhook Key
const eventName = "smart_led_control"; // Replace with your IFTTT Event Name

// RGB to Command Mapping
const rgbToCommand = {
    "#FF0000": "turn_red",   // Red
    "#00FF00": "turn_green", // Green
    "#0000FF": "turn_blue",  // Blue
    "#FFFFFF": "turn_white"  // White
};

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
            console.log(`IFTTT Triggered: ${command}`);
        } else {
            console.error(`Failed to trigger IFTTT: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error Sending to IFTTT: ${error}`);
    }
}

// Initialize the plugin
export function initialize() {
    console.log(`${name} Initialized`);
}

// Update logic runs at regular intervals
export function update() {
    try {
        // Fetch the current RGB values from Signal RGB (Example API)
        const device = SignalRgb.devices[0]; // Assuming the first device is active
        if (!device) {
            console.error("No device detected!");
            return;
        }

        const { red, green, blue } = device.ledColor; // Assuming `ledColor` fetches current RGB values
        const currentHex = rgbToHex(red, green, blue);

        console.log(`Current RGB Hex: ${currentHex}`);

        // Match RGB to a predefined command and send it to IFTTT
        const command = rgbToCommand[currentHex];
        if (command) {
            sendToIFTTT(command);
        } else {
            console.log(`No matching command for RGB: ${currentHex}`);
        }
    } catch (error) {
        console.error(`Error in update function: ${error.message}`);
    }
}

// Terminate the plugin
export function terminate() {
    console.log(`${name} Terminated`);
}
