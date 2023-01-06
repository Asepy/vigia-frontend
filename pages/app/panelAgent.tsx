import type { NextPage } from "next";
import Layout from "../../components/ui/Layout/Layout";
import Panel from "../../components/panel-agent/PanelAgent";

const PanelAgent: NextPage = () => {
  return (
    <Layout>
      <Panel />
    </Layout>
  );
};

export default PanelAgent;
