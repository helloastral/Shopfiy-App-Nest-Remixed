import { useEffect, useState } from "react";
import { Banner, Layout, Page, Spinner } from "@shopify/polaris";
import { useSearchParams } from "@remix-run/react";

export default function ExitIframe() {
  const [search] = useSearchParams();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (search) {
      const redirectUri = search.get("redirectUri") as string;
      const url = new URL(decodeURIComponent(redirectUri));

      if (
        [location.hostname, "admin.shopify.com"].includes(url.hostname) ||
        url.hostname.endsWith(".myshopify.com")
      ) {
        const url = decodeURIComponent(redirectUri);
        window.open(url, "_top");
      } else {
        setShowWarning(true);
      }
    }
  }, [search, setShowWarning]);

  return showWarning ? (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <div style={{ marginTop: "100px" }}>
            <Banner title="Redirecting outside of Shopify" tone="warning">
              Apps can only use /exitiframe to reach Shopify or the app itself.
            </Banner>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  ) : (
    <div style={{display:"grid", placeItems:"center",height:"100dvh"}}>
      <Spinner />
      </div>
  );
}
