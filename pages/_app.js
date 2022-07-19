import { Fragment } from "react";
import Head from "next/head";
import "../asset/css/globals.css";

function App({ Component, pageProps }) {
  return (
    <Fragment>
      <Head>
        <title>Kitalulus Test</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </Fragment>
  );
}

export default App;
