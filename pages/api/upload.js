const axios = require("axios");
const axiosRetry = require("axios-retry");
const FormData = require("form-data");

const JWT = `Bearer ${process.env.PINATA_JWT}`;

const pinFileToIPFS = async (img) => {
    const axiosInstance = axios.create();

    axiosRetry(axiosInstance, { retries: 5 });
    const data = new FormData();

    const response = await axiosInstance(img.replace(/^"|"$/g, ""), {
        method: "GET",
        responseType: "stream",
    });
    data.append(`file`, response.data);

    try {
        const res = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data,
            {
                maxBodyLength: "Infinity",
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                    Authorization: JWT,
                },
            }
        );
        console.log(res.data);
        return res.data
    } catch (error) {
        console.log(error);
    }
};

export default async function handler(req, res) {
    const response = await pinFileToIPFS(req.body);
    res.status(200).json(response);
}
