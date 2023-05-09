import Products from './Products';

const wp_api_endpoint = 'https://bubblybeaks.com/wp-json/api/lists'; // this works on

async function getData() {
  const res = await fetch(wp_api_endpoint);
  return res.json();
}

const SavedPage = async () => {
  const products = await getData();

  return <Products products={products} />;
};

export default SavedPage;
