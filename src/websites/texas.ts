import { CheerioAPI, load } from "cheerio";
import { Property } from "../entities/Property.entity";
import { loadHtml } from "../libs/scraper";

export class TexasLTC {
  baseUrl = "https://apps.hhs.texas.gov/LTCSearch";

  static instance: TexasLTC;

  static getInstance() {
    if (!TexasLTC.instance) {
      TexasLTC.instance = new TexasLTC();
    }
    return TexasLTC.instance;
  }

  private async searchRequest(query: string) {
    try {
      const res = await fetch(`${this.baseUrl}/namesearch.cfm`, {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language":
            "en-GB,en;q=0.9,en-US;q=0.8,bn;q=0.7,fr;q=0.6,co;q=0.5",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
        referrer: "https://apps.hhs.texas.gov/LTCSearch/namesearch.cfm",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `searchterm=${query.replace(" ", "+")}&factype=all%2Call`,
        method: "POST",
        mode: "cors",
        credentials: "include",
      });

      return load(await res.text());
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async search(query: string) {
    const $ = await this.searchRequest(query);

    if (!$) {
      return [];
    }

    return await this.scrapeBasePage($);
  }

  async scrapeBasePage($: CheerioAPI) {
    const properties = [] as Property[];

    const table = $("table.sortabletable");
    const rows = table.find("tr");

    // Define an array to store promises for both scrapeDetailsPage and getLatLong
    const promises = [] as Promise<any>[];

    rows.each((_, row) => {
      const columns = $(row).find("td");
      const property = {} as Property;

      if (columns.length < 6) {
        return;
      }

      property.name = $(columns[0]).text();
      property.address = $(columns[1]).text();
      property.city = $(columns[2]).text();
      property.zip = $(columns[3]).text();
      property.country = $(columns[4]).text();
      property.type = $(columns[5]).text();
      const url = this.baseUrl + "/" + $(columns[0]).find("a").attr("href");

      if (url) {
        // Push the promise returned by scrapeDetailsPage into the promises array
        promises.push(
          this.scrapeDetailsPage(url).then((data) => {
            if (data && data?.capacity) {
              property.capacity = data.capacity;
              property.images = data.images;
              property.phone = data.phone;
            }
          })
        );
      }

      // Push the promise returned by getLatLong into the promises array
      promises.push(
        this.getLatLong(property.address).then((data) => {
          if (data) {
            property.latitude = data.latitude;
            property.longitude = data.longitude;
          }
        })
      );

      properties.push(property);
    });

    // Wait for all promises to resolve before continuing
    await Promise.all(promises);

    return properties;
  }

  async scrapeDetailsPage(url: string) {
    const $ = await loadHtml({
      url,
      method: "GET",
    });
    if (!$) {
      return null;
    }

    const lists = $("ul").find("li");

    const additionalInfo = {
      capacity: 0,
      images: "",
      phone: "",
    };

    lists.each((_, list) => {
      const text = $(list).text();
      if (text.includes("Total Bed Count")) {
        additionalInfo.capacity = Number(
          text?.match(/Total Bed Count: (\d+)/)?.[1] ?? 0
        );
      }
    });

    const phoneRegex = /\b\d{3}-\d{3}-\d{4}\b/;

    const phoneMatches = $(".main-content").html()?.match(phoneRegex);

    if (phoneMatches) {
      const phoneNumber = phoneMatches[0];
      additionalInfo.phone = phoneNumber;
    } else {
      console.log("Phone number not found in the HTML.");
    }

    return additionalInfo;
  }

  async getLatLong(address: string) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q="${address}"&format=json`
      );
      const data = await res?.json();

      if (data?.[0]?.lat && data?.[0]?.lon) {
        return {
          latitude: Number(data[0].lat),
          longitude: Number(data[0].lon),
        };
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
