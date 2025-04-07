import scrapePage from "../services/scrape.service.js";

export const getHouseData = async (req, res) => {
    let url = req.body;
    if (url) {
        try {
            let houseData = await scrapePage(url);
            return res.status(200).send({ data: houseData })
        } catch (error) {
            return res.status(400).send({ error })
        }
    }
    return res.status(404).send({ "Url not valid or empty": url })
}