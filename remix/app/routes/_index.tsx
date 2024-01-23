import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, BlockStack, Layout, Card, Button } from "@shopify/polaris";
import { getApi } from "../libs/api.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const api = await getApi(request);
  const host = process.env.HOST;
  const res = await api.get(`${host}/api/products`);

  console.log(res.data);

  return { products: res.data };
}

export default function MainPage() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <Page>
      <ui-title-bar title="Remix app template">Generate a product</ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <h2>Hello</h2>
              <Button>Hello</Button>
              <p>{JSON.stringify(products, null, 2)}</p>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
