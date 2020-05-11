import React, { useMemo } from "react";
import { NextPage } from "next/types";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";

import { DiffView, MetaKey } from "../../../../components/DiffView";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

interface CompareTwoPageProps {}

const CompareTwo: NextPage<CompareTwoPageProps> = () => {
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
  const apiUrl = `/api?url=${queryOne}&url=${queryTwo}`;

  const { data, error } = useSWR(apiUrl, fetcher);

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

CompareTwo.getInitialProps = () => {
  return {};
};

export default CompareTwo;
