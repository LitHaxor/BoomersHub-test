import { CheerioAPI, load } from "cheerio";
import { getBrowser } from "../libs/playwright";
import { Provider } from "../entities/Provider.entity";

export class Florida {
  static instance: Florida;
  static getInstance() {
    if (!Florida.instance) {
      Florida.instance = new Florida();
    }
    return Florida.instance;
  }

  async search(query: string) {
    const $ = await this.loadHtml(query);

    const providers = await this.scrapeProviders($);

    console.log(providers);

    return providers;
  }

  async scrapeProviders($: CheerioAPI) {
    const providers = [] as Provider[];

    const table = $("#ctl00_mainContentPlaceHolder_dgFacilities");

    const rows = table.find("tr");

    rows.each((i, row) => {
      if (i === 0) {
        return;
      }

      const cells = $(row).find("td");

      const provider = {} as Provider;

      console.log(cells.length);

      provider.name = $(cells[0]).text()?.trim();

      provider.type = $(cells[1]).text();

      provider.address = $(cells[2]).text();

      provider.city = $(cells[3]).text();

      provider.state = $(cells[4]).text();

      provider.zip = $(cells[5]).text();

      provider.phone = $(cells[6]).text();
      provider.phone = provider.phone.replace(/\D/g, "");
      provider.phone = provider.phone.replace(
        /(\d{3})(\d{3})(\d{4})/,
        "$1-$2-$3"
      );

      provider.capacity = Number($(cells[7]).text() || 0);

      providers.push(provider);
    });

    return providers;
  }

  async loadHtml(query: string) {
    const browser = await getBrowser();

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto(
      "https://quality.healthfinder.fl.gov/facilitylocator/FacilitySearch.aspx"
    );

    await page.fill("#ctl00_mainContentPlaceHolder_FacilityName", query);

    await page.selectOption(
      "#ctl00_mainContentPlaceHolder_FacilityType",
      "ALL"
    );

    await page.click("#ctl00_mainContentPlaceHolder_SearchButton");

    await page.waitForSelector("#ctl00_mainContentPlaceHolder_dgFacilities");

    const html = await page.content();

    await browser.close();

    return load(html);
  }
}
