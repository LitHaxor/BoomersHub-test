import axios from "axios";
import { PROXY_API } from "../../configs";

export async function loadHtmlProxy(url: string) {
  try {
    const { data } = await axios({
      url: "https://api.zenrows.com/v1/",
      method: "GET",
      params: {
        url: url,
        apikey: PROXY_API,
        js_render: "true",
        antibot: "true",
        premium_proxy: "true",
        proxy_country: "us",
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}
