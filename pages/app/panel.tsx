import type { NextPage } from "next";
import Panl from "../../components/panel/Panel";
import Layout from "../../components/ui/Layout/Layout";

const Panel: NextPage = () => {
  return (
    <Layout>
      <Panl />
    </Layout>
  );
};

//export default withAuthenticator(Panel)
export default Panel;
