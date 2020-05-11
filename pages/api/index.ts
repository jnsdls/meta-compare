import puppeteer from "puppeteer";
import { NextApiRequest, NextApiResponse } from "next";

const FBCrawlerUserAgent = "facebookexternalhit/1.1";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "pass at least 1 url= query param" });
  }
  if (!Array.isArray(url)) {
    url = [url];
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setUserAgent(FBCrawlerUserAgent);

  const metaTags = {};

  for (const u of url) {
    const urlMetatags = await getParsedMetaTags(page, u);
    metaTags[u] = urlMetatags;
  }

  res.statusCode = 200;
  res.json({ metaTags });
};

const getParsedMetaTags = async (page: puppeteer.Page, url: string) => {
  if (!url.startsWith("http")) {
    url = `http://${url}`;
  }
  await page.goto(url);
  const metaTags: TransformedMetaTag[] = await page.evaluate(() =>
    Array.from(document.getElementsByTagName("meta"), (tag) => {
      const parseAttributes = (attributes: NamedNodeMap) => {
        const attributeMap: TransformedAttributes = {};

        for (let i = 0; i < attributes.length; i++) {
          const attr = attributes.item(i);
          attributeMap[attr.name] = attr.value;
        }
        return attributeMap;
      };

      return {
        attributes: parseAttributes(tag.attributes),
        html: tag.outerHTML,
      };
    })
  );

  return { metatags: parseMeta(metaTags), url };
};

interface TransformedAttributes {
  name?: string;
  property?: string;
  content?: string;
}

interface TransformedMetaTag {
  attributes: TransformedAttributes;
  html: string;
}

type TagCollection = Array<{
  key: string;
  value: string | number | boolean;
  html: string;
}>;

const createOrUpdateMap = (
  map: TagCollection,
  key: string,
  value: TransformedMetaTag
) => {
  map.push({ key, value: value.attributes.content || "", html: value.html });
};

const parseMeta = (metaTags: TransformedMetaTag[]) => {
  const opengraph: TagCollection = [];
  const twitter: TagCollection = [];
  const applink: TagCollection = [];
  const other: TagCollection = [];
  metaTags.forEach((tag) => {
    const key = tag.attributes.name || tag.attributes.property;
    if (!key) {
      return;
    }
    const map = key.startsWith("og:")
      ? opengraph
      : key.startsWith("twitter:")
      ? twitter
      : key.startsWith("al:")
      ? applink
      : other;
    createOrUpdateMap(map, key, tag);
  });

  return {
    applink: sortByKey(applink),
    opengraph: sortByKey(opengraph),
    other: sortByKey(other),
    twitter: sortByKey(twitter),
  };
};

const sortByKey = (array) =>
  array.sort((a, b) => {
    if (a.key < b.key) {
      return -1;
    }
    if (a.key > b.key) {
      return 1;
    }
    return 0;
  });
