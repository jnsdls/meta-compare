import React from "react";
import App from "next/app";
import "../css/tailwind.css";
import { UrlInputs } from "../components/UrlInputs";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div className="grid grid-cols-1 gap-1">
        <header>
          <h1 className="text-3xl font-bold p-2">Meta Compare</h1>
          <UrlInputs />
        </header>
        <div>
          <Component {...pageProps} />
        </div>
      </div>
    );
  }
}

export default MyApp;
