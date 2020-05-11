import React, { useMemo } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer";

export enum MetaKey {
  OG = "openGraph",
  TWITTER = "twitter",
  APPLINK = "applink",
  GENERAL = "general",
  JSONLD = "jsonLd",
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
  [MetaKey.GENERAL]: "General",
  [MetaKey.JSONLD]: "JsonLD",
};

export const DiffView: React.FC<DiffViewProps> = ({ metaData, metaKey }) => {
  const metaDataKeys = Object.keys(metaData);
  const oldMeta = useMemo(() => {
    return JSON.stringify(metaData[metaDataKeys[0]][metaKey], null, 2);
  }, []);
  const newMeta = useMemo(() => {
    return JSON.stringify(metaData[metaDataKeys[1]][metaKey], null, 2);
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
          showDiffOnly={false}
          compareMethod={DiffMethod.LINES}
        />
      </div>
    </div>
  );
};
