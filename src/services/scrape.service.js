import { gotScraping } from "got-scraping";
import * as cheerio from "cheerio";
import houseSchema from "../schema/house.schema.js";

async function scrapePage(url, retries = 0) {

    try {
        const response = await gotScraping(url)
        const statusCode = response.statusCode;
        if (statusCode != 200) {
            console.log(statusCode)
            throw new Error(response)
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
        const completeAddress = $('div.section-location-property.section-location-property-classified h4').text().split(",")
        const address = completeAddress[0];
        const town = completeAddress[1];

        houseSchema.price = Number(finalPrice)
        houseSchema.expense = Number(expFinal)
        houseSchema.total = Number(finalPrice) + Number(expFinal)
        houseSchema.town = town
        houseSchema.m2 = Number(numberMetros)
        houseSchema.ppm2 = Math.floor((Number(finalPrice) + Number(expFinal)) / Number(numberMetros))
        houseSchema.address = address
        console.log(houseSchema)
        return houseSchema;
    } catch (error) {
        if (retries < 20) {
            return scrapePage(url, retries + 1)
        } else {
            return error;
        }
    }
}

scrapePage("https://www.zonaprop.com.ar/propiedades/clasificado/alclapin-departamento-en-alquiler-2-amb-caballito-55919390.html")
export default scrapePage