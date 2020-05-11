import { NextApiRequest, NextApiResponse } from "next";
import scrape from "html-metadata";
import sortobject from "deep-sort-object";

const FBCrawlerUserAgent = "facebookexternalhit/1.1";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "pass at least 1 url= query param" });
  }
  if (!Array.isArray(url)) {
    url = [url];
  }

  const metaTags = {};

  for (const u of url) {
    var options = {
      url: u,
      headers: {
        "User-Agent": FBCrawlerUserAgent,
      },
    };
    const urlMetatags = await scrape(options);
    metaTags[u] = sortobject(urlMetatags);
  }

  res.statusCode = 200;
  res.json({ metaTags });
};
