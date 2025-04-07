import express from 'express';
import { gotScraping } from "got-scraping";
import scrapeRouter from './routes/scrape.router.js'


const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json())

app.use("/api", scrapeRouter)
app.get("/", (req, res) => {
    return res.send({ "status": "ok" })
})

app.listen(PORT, () => {
    console.log("http://localhost:8080")
})