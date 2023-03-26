export default async function handler(req, res) {
    const response = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.PINATA_JWT}`
            },
            body: JSON.stringify(req.body),
        }
    );
    const data = await response.json();
    res.status(200).json(data);
}
