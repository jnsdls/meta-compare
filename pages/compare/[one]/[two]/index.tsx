import React, { useMemo } from "react";
import { NextPage, NextApiRequest } from "next/types";
import { useRouter } from "next/router";
import useSWR from "swr";
import { DiffView, MetaKey } from "../../../../components/DiffView";
import { IncomingMessage } from "http";

const getHostName = (req?: IncomingMessage) => {
  if (!req?.headers?.host) {
    return "";
  }

  if (req.headers.host.startsWith("https")) {
    return req.headers.host;
  }

  return `http://${req.headers.host}`;
};

const getURL = (urlOne: string, urlTwo: string) => {
  return `/api?url=${urlOne}&url=${urlTwo}`;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

interface CompareTwoPageProps {
  initialData: any;
}

const CompareTwo: NextPage<CompareTwoPageProps> = ({ initialData }) => {
  const { query } = useRouter();

  const queryOne = useMemo(() => {
    if (Array.isArray(query.one)) {
      return query.one[0];
    }
    return query.one;
  }, [query]);

  const queryTwo = useMemo(() => {
    if (Array.isArray(query.two)) {
      return query.two[0];
    }
    return query.two;
  }, [query]);

  const url = getURL(queryOne, queryTwo);

  const { data, error } = useSWR(url, fetcher, {
    initialData,
  });

  const loading = !data && !error;

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <>
      <DiffView metaData={data.metaTags} metaKey={MetaKey.GENERAL} />
      <DiffView metaData={data.metaTags} metaKey={MetaKey.OG} />
      <DiffView metaData={data.metaTags} metaKey={MetaKey.TWITTER} />
      <DiffView metaData={data.metaTags} metaKey={MetaKey.JSONLD} />
    </>
  );
};

export async function getServerSideProps({ query, req }) {
  let { one, two } = query;
  if (Array.isArray(one)) {
    one = one[0];
  }
  if (Array.isArray(two)) {
    two = two[0];
  }

  const initialUrl = getURL(one, two);

  const data = await fetcher(getHostName(req) + initialUrl);

  return { props: { initialData: data } };
}

export default CompareTwo;
