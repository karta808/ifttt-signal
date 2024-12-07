import QtQuick 2.12
import QtQuick.Layouts 1.3

Item {
    anchors.fill: parent

    Column {
        width: parent.width
        spacing: 10
        padding: 10

        // Header
        Text {
            text: "IFTTT RGB Controller"
            color: "white"
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        // Webhook Key Input
        Text {
            text: "Webhook Key:"
            color: "white"
            font.pixelSize: 14
        }
        TextField {
            id: webhookKeyField
            placeholderText: "Enter your IFTTT Webhook Key"
            onTextChanged: plugin.setWebhookKey(text)
            background: Rectangle {
                color: "#222"
                radius: 4
            }
            color: "white"
        }

        // Event Name Input
        Text {
            text: "Event Name:"
            color: "white"
            font.pixelSize: 14
        }
        TextField {
            id: eventNameField
            placeholderText: "Enter the IFTTT Event Name"
            onTextChanged: plugin.setEventName(text)
            background: Rectangle {
                color: "#222"
                radius: 4
            }
            color: "white"
        }

        // Log Box
        Rectangle {
            id: logBox
            width: parent.width
            height: 150
            color: "#333"
            radius: 4

            ScrollView {
                anchors.fill: parent
                Text {
                    id: logText
                    text: plugin.getLogs()
                    color: "white"
                    wrapMode: Text.Wrap
                }
            }
        }

        // Buttons
        Row {
            spacing: 10

            Button {
                text: "Clear Logs"
                onClicked: {
                    plugin.clearLogs();
                    logText.text = "Logs cleared.";
                }
            }
        }
    }
}
