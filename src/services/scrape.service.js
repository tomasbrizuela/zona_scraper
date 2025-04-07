import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import houseSchema from "../schema/house.schema.js";

async function scrapePage(url) {
    const response = await gotScraping(url)
    const statusCode = response.statusCode;

    if (statusCode != 200) {
        console.log("error status code!")
    }

    const $ = cheerio.load(response.body);
    const price = $(`span:contains("  $ ")`).text().split("$ ")[1]
    const expenses = $(`span:contains("Expensas")`).text().split("$ ")[1]
    const expensasPrice = expenses.split("\n")
    const expFinal = expensasPrice[0].replace(".", "")
    const priceText = price.split("\n")
    const finalPrice = priceText[0].replace(".", "")
    const metrosCuadrados = $(`h2:contains("m²")`).text().split("m²")[0];
    const numberMetros = metrosCuadrados.split("· ")[1];
    const addressComplete = $(`h4:contains("Capital Federal")`).text().split(",");
    const address = $(`h4:contains("Capital Federal")`).text().split(",")[0];
    const town = $(`h4:contains("Capital Federal")`).text().split(",")[1];

    houseSchema.price = Number(finalPrice)
    houseSchema.expense = Number(expFinal)
    houseSchema.total = Number(finalPrice) + Number(expFinal)
    houseSchema.town = town
    houseSchema.m2 = Number(numberMetros)
    houseSchema.ppm2 = Math.floor((Number(finalPrice) + Number(expFinal)) / Number(numberMetros))
    houseSchema.address = address
    console.log(houseSchema)
    return houseSchema;
}
export default scrapePage