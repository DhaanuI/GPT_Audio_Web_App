
const texts = document.querySelector(".texts");

document.getElementById("click_to_record").addEventListener('click', function () {
    var speech = true;
    this.disabled = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    let silenceTimer;
    const silenceThreshold = 3000;

    recognition.addEventListener('result', e => {
        clearTimeout(silenceTimer);
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');

        silenceTimer = setTimeout(() => {
            recognition.stop();
            displayMessage("Me", transcript, true);

            fetch("https://lazy-erin-reindeer-tux.cyclic.app/process", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question: transcript }),
            })
                .then((response) => response.json())
                .then((data) => {

                    displayMessage("Bot", data.message, false);

                    const utterance = new SpeechSynthesisUtterance(data.message);
                    speechSynthesis.speak(utterance);
                })
                .catch((error) => {
                    console.log("Error:", error);
                });
        }, silenceThreshold);
    });

    function displayMessage(sender, message, val) {
        const textsContainer = document.querySelector('.texts');
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");
        const senderSpan = document.createElement("span");
        senderSpan.classList.add("sender");
        senderSpan.innerText = sender + ":";
        const messageSpan = document.createElement("span");
        messageSpan.classList.add("message");
        messageSpan.innerText = message;

        // to specify color between me and bot
        if (val) {
            messageContainer.classList.add("message-me");
        } else {
            messageContainer.classList.add("message-bot");
        }

        messageContainer.appendChild(senderSpan);
        messageContainer.appendChild(messageSpan);
        textsContainer.appendChild(messageContainer);
    }

    recognition.addEventListener("end", () => {
        recognition.start();
    });

    if (speech == true) {
        recognition.start();
    }
});



