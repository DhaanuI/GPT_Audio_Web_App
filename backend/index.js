const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()
const cors = require("cors")
app.use(cors())
app.use(express.json())

const configuration = new Configuration({
    apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
    res.send("Homepage")
})

app.post('/process', async (req, res) => {
    try {

        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: req.body.text,
            max_tokens: 7,
            temperature: 0,
        });
        const result = response.data.choices[0].text == undefined ? "This is CHATGPT generated" : response.data.choices[0].text.trim().replace(/\n/g, '');
        res.send({ "message": result })
    }
    catch (err) {
        res.send({ "error": err })
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});


