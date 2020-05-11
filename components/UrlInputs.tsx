import React, { useMemo, useCallback, useState } from "react";
import Router, { useRouter } from "next/router";

export const UrlInputs: React.FC = () => {
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

  const [firstUrl, setFirstUrl] = useState<string>(queryOne || "");
  const [secondUrl, setSecondUrl] = useState<string>(queryTwo || "");

  const onCompare = useCallback(() => {
    Router.push(
      `/compare/[one]/[two]`,
      `/compare/${encodeURIComponent(firstUrl)}/${encodeURIComponent(
        secondUrl
      )}`
    );
  }, [firstUrl, secondUrl]);
  return (
    <div className="grid grid-cols-3 gap1 p-2">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="urlOne"
        >
          First Url
        </label>
        <input
          required
          type="url"
          pattern="https://.*"
          value={firstUrl}
          onChange={(e) => setFirstUrl(e.target.value)}
          className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="urlOne"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="urlTwo"
        >
          Second Url
        </label>
        <input
          required
          type="url"
          pattern="https://.*"
          value={secondUrl}
          onChange={(e) => setSecondUrl(e.target.value)}
          className="shadow appearance-none border rounded w-3/4 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="urlTwo"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={onCompare}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Compare
        </button>
      </div>
    </div>
  );
};
