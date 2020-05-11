import React, { useMemo } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

export enum MetaKey {
  OG = "opengraph",
  TWITTER = "twitter",
  APPLINK = "applink",
  OTHER = "other",
}

interface MetaData {
  [key: string]: {
    metatags: Array<Record<MetaKey, {}>>;
  };
}

interface DiffViewProps {
  metaData: MetaData;
  metaKey: MetaKey;
}

const TITLES = {
  [MetaKey.OG]: "OpenGraph",
  [MetaKey.TWITTER]: "Twitter",
  [MetaKey.APPLINK]: "AppLink",
  [MetaKey.OTHER]: "Other",
};

export const DiffView: React.FC<DiffViewProps> = ({ metaData, metaKey }) => {
  const metaDataKeys = Object.keys(metaData);
  const oldMeta = useMemo(() => {
    return metaData[metaDataKeys[0]].metatags[metaKey]
      .map((tag) => `${tag.key}: ${tag.value}`)
      .join("\n");
  }, []);
  const newMeta = useMemo(() => {
    return metaData[metaDataKeys[1]].metatags[metaKey]
      .map((tag) => `${tag.key}: ${tag.value}`)
      .join("\n");
  }, []);

  return (
    <div className="grid grid-cols-1 gap-1">
      <div className="p-2">
        <h2 className="text-l font-semibold">{TITLES[metaKey]}</h2>
      </div>
      <div className="text-xs font-mono">
        <ReactDiffViewer
          oldValue={oldMeta}
          newValue={newMeta}
          splitView
          compareMethod={DiffMethod.WORDS}
        />
      </div>
    </div>
  );
};
