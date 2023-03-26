import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    try {
        const response = await openai.createImage({
            prompt: req.body.prompt,
            n: 5,
            size: "256x256",
        });
        console.log(response.data.data[0]);
        res.status(200).json(response.data.data);
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}
