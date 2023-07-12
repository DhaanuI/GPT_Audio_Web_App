const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()
const cors = require("cors")
app.use(cors())
app.use(express.json())


async function generateCompletion(prompt) {
    try {
        const configuration = new Configuration({
            apiKey: process.env.GPT_API_KEY,
        });

        const openai = new OpenAIApi(configuration);

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 500,
            n: 1
        });

        const { choices } = response.data;
        if (choices && choices.length > 0) {
            const completion = choices[0].text.trim();
            return completion;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


app.get("/", (req, res) => {
    res.send("Homepage")
})

app.post('/process', async (req, res) => {
    const { question } = req.body
    try {
        prompt = question;
        const response = await generateCompletion(prompt);
        console.log(response)
        res.json({ response });
    }
    catch (err) {
        res.send({ "error": err })
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});


