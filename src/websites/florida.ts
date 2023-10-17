import { CheerioAPI, load } from "cheerio";
import { getBrowser } from "../libs/playwright";
import { Provider } from "../entities/Provider.entity";
import { getLatLong } from "src/libs/geo";

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
    const promises = [] as Promise<any>[];

    const table = $("#ctl00_mainContentPlaceHolder_dgFacilities");

    const rows = table.find("tr");

    rows.each((i, row) => {
      if (i === 0) {
        return;
      }

      const cells = $(row).find("td");

      const provider = {} as Provider;

      console.log(cells.length);
      const name = $(cells[0]).text()?.trim();

      if (name?.split("-")?.length > 1) {
        provider.name = name?.split("-")?.[0].trim();
        provider.code = Number(name?.split("-")?.[1].trim());
      } else {
        provider.name = name;
      }

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

      provider.link = `https://quality.healthfinder.fl.gov/facilitylocator/FacilityDetails.aspx?fid=${provider.code}`;

      if (provider.address && provider.city && provider.state) {
        promises.push(
          getLatLong(provider.address, provider.city, provider.state).then(
            (data) => {
              if (data) {
                provider.latitude = data.latitude;
                provider.longitude = data.longitude;
              }
            }
          )
        );
      }
      providers.push(provider);
    });

    await Promise.all(promises);

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
