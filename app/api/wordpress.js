// https://bubblybeaks.com/wp-json/api/lists
//
export async function getData() {
  const wp_api_endpoint = await fetch(
    "https://bubblybeaks.com/wp-json/api/lists",
    { next: { revalidate: 1 } }
  );
  const res = await wp_api_endpoint.json();

  return res;
}
