// //const DeepSpeech = require('deepspeech');
// const Translate = require("@vitalets/google-translate-api");
// const { exec } = require("child_process");
// const axios = require("axios");
// const path = require('path')

// class ZoomBot {
//     constructor(params) {
//         this.apiKey = params.apiKey,
//         this.apiSecret = params.apiSecret,
//         // this.modelPath = {
//         //     model: path.join(__dirname, 'deepspeech-model', 'deepspeech-0.9.3-models.pbmm'),
//         //     scorer: path.join(__dirname, 'deepspeech-model', 'deepspeech-0.9.3-models.scorer')
//         // };
//         // this.gptApiKey = params.gptApiKey;
//         // this.model = new DeepSpeech.Model(this.modelPath.model);
//         // this.model.enableExternalScorer(this.modelPath.scorer);
//         this.googleTranslate = Translate;
//     }

//     async start(accessToken, meetingLink) {
//         try {
//             // Join the Zoom meeting using the access token and meeting link
//             const joinMeetingResponse = await this.joinMeeting(accessToken, meetingLink);
//             console.log("Joined meeting:", joinMeetingResponse.join_url);

//             // Subscribe to Zoom audio stream for speech recognition
//             this.zoomClient.stream.on("audio", (audioBuffer) => {
//                 this.transcribeSpeech(audioBuffer);
//             });
//         } catch (error) {
//             console.error("Error starting Zoom bot:", error);
//         }
//     }

//     async joinMeeting(accessToken, meetingLink) {
//         try {
//             const response = await axios.post(
//                 'https://api.zoom.us/v2/users/me/meetings', {
//                 data: {
//                     topic: "Joining meeting via bot",
//                     type: 1,
//                     settings: {
//                         join_before_host: true,
//                         mute_upon_entry: true,
//                         meeting_authentication: true,
//                     },
//                     start_url: meetingLink,
//                 },
//                 headers: {
//                     "Authorization": `Bearer ${accessToken}`,
//                 },
//             });

//             return response.data;
//         } catch (error) {
//             throw new Error("Error joining meeting:", error);
//         }
//     }

//     async transcribeSpeech(audioBuffer) {
//         const audioData = new Int16Array(audioBuffer.buffer);
//         const sampleRate = 16000;
//         const text = this.model.stt(audioData, sampleRate);
//         console.log("Transcription:", text);

//         // Pass the transcription to GPT for further processing
//         const gptResponse = await this.processTextWithGPT(text);
//         const generatedText = gptResponse.choices[0].text.trim();
//         console.log("Generated Text:", generatedText);

//         // Convert generated text to speech
//         const outputFile = "./output.mp3";
//         await this.textToSpeech(generatedText, outputFile);

//         // Play the generated speech audio through Zoom
//         this.playAudioThroughZoom(outputFile);
//     }

//     async processTextWithGPT(text) {
//         const url = "https://api.openai.com/v1/engines/davinci-codex/completions";
//         const headers = {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${this.gptApiKey}`,
//         };
//         const body = JSON.stringify({
//             prompt: text,
//             max_tokens: 100,
//             temperature: 0.7,
//         });

//         try {
//             const response = await fetch(url, {
//                 method: "POST",
//                 headers,
//                 body,
//             });
//             const data = await response.json();
//             return data;
//         } catch (error) {
//             throw new Error("Error processing text with GPT:", error);
//         }
//     }

//     async textToSpeech(text, outputFile) {
//         try {
//             const translation = await this.googleTranslate(text, { to: "en" });
//             const { text: translatedText } = translation;
//             const translateResponse = await this.googleTranslate(translation.text, { from: "en", to: "en", client: "gtx" });
//             const { tts } = translateResponse;

//             const audioResponse = await fetch(tts, { method: "GET" });
//             const audioBuffer = await audioResponse.buffer();

//             // Save the audio buffer to a file
//             fs.writeFileSync(outputFile, audioBuffer);
//         } catch (error) {
//             throw new Error("Error converting text to speech:", error);
//         }
//     }

//     playAudioThroughZoom(audioFile) {
//         const platform = process.platform;
//         let command;

//         if (platform === "darwin") {
//             // macOS
//             command = `afplay ${audioFile}`;
//         } else if (platform === "win32") {
//             // Windows
//             command = `powershell -c (New-Object Media.SoundPlayer "${audioFile}").PlaySync()`;
//         } else if (platform === "linux") {
//             // Linux
//             command = `aplay ${audioFile}`;
//         } else {
//             console.error("Unsupported operating system:", platform);
//             return;
//         }

//         exec(command, (error) => {
//             if (error) {
//                 console.error("Error playing audio through Zoom:", error);
//             }
//         });
//     }
// }

// module.exports = ZoomBot;


// app.get("/oauth/callback", async (req, res) => {

//     try {
//         // Extract the authorization code from the query parameters
//         const { code } = req.query;

//         // Exchange the authorization code for an access token
//         const tokenUrl = "https://zoom.us/oauth/token";
//         const data = new URLSearchParams({
//             grant_type: "authorization_code",
//             code,
//             redirect_uri: process.env.Redirect_URI,
//         });

//         const clientId = process.env.ZOOM_CLIENT_ID;
//         const clientSecret = process.env.ZOOM_CLIENT_SECRET;
//         const credentials = `${clientId}:${clientSecret}`;
//         const encodedCredentials = btoa(credentials);

//         const response = await fetch(tokenUrl, {
//             method: 'POST',
//             body: data,
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Authorization': `Basic ${encodedCredentials}`,
//             },
//         });

//         const responseData = await response.json();
//         const accessToken = responseData.access_token;

//         // Join the meeting
//         const meetingUrl = obj.meetingLink;

//         const meetingId = meetingUrl.substring(meetingUrl.lastIndexOf("/") + 1);

//         const joinMeetingOptions = {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         };

//         const meetingResponse = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, joinMeetingOptions);
//         const meetingData = await meetingResponse.json();

//         if (meetingData.start_url) {
//             const startUrl = meetingData.start_url;

//             const websocketUrl = `wss://zoom.us/zoomapi/ws/transcription?meeting.uuid=${meetingData.uuid}`;

//             // Connect to the WebSocket

           

//         } else {
//             console.error('Unable to retrieve meeting start URL');
//             res.status(500).send('Error joining the meeting');
//         }

//     } catch (error) {
//         console.error("Error during OAuth token exchange:", error);
//         res.status(500).send("OAuth token exchange failed.");
//     }
// });

// const express = require("express");
// const bodyParser = require("body-parser");
// const session = require('express-session');
// const ZoomBot = require("./zoom");
// const axios = require("axios");
// require('dotenv').config()

// const zoomBot = new ZoomBot({
//     apiKey: process.env.Zoom_Client_ID,
//     apiSecret: process.env.Zoom_Client_secret,
//     gptApiKey: process.env.Gpt_API_key,
// });

// const cors = require("cors")

// const app = express();
// app.use(cors())

// app.use(session({
//     secret: 'secret-key',
//     resave: false,
//     saveUninitialized: false,
// }));


// app.use(bodyParser.json());

// app.get("/", (req, res) => {
//     res.send("Homepage")
// })

// const redirectURL = "http://localhost:8080/"

// // Route to initiate the OAuth flow and start the bot
// app.post("/start-bot", async (req, res) => {
//     const meetingLink = req.body.input;
//     try {
//         // Store the meeting link in session for later use
//         req.session.meetingLink = meetingLink;

//         // Step 1: Redirect the user to the Zoom OAuth authorization URL
//         const authorizeURL = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.Zoom_Client_ID}&redirect_uri=${redirectURL}`;
//         res.send("hi");
//     } catch (error) {
//         console.error("Error starting the bot:", error);
//         res.status(500).send("Error starting the bot");
//     }
// });

// // Callback route to handle the OAuth callback
// app.get("/oauth/callback", async (req, res) => {
//     const { code } = req.query;
//     const meetingLink = req.session.meetingLink;
//     try {
//         // Step 2: Exchange the authorization code for an access token
//         const tokenResponse = await axios.post("https://zoom.us/oauth/token", {
//             code,
//             grant_type: "authorization_code",
//             redirect_uri: redirectURL,
//         }, {
//             auth: {
//                 username: clientID,
//                 password: clientSecret,
//             },
//         });

//         const accessToken = tokenResponse.data.access_token;

//         // Step 3: Start the Zoom bot with the obtained access token and meeting link
//         await zoomBot.start(accessToken, meetingLink);

//         res.sendStatus(200);
//     } catch (error) {
//         console.error("Error during OAuth callback:", error);
//         res.status(500).send("Error during OAuth callback");
//     }
// });




// app.listen(process.env.port, () => {
//     console.log(`Server is running on port ${process.env.port}`);
// });
