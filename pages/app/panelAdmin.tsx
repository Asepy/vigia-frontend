import type { NextPage } from "next";
import Layout from "../../components/ui/Layout/Layout";
import Panel from "../../components/panel-admin/PanelAdmin";

const PanelAgent: NextPage = () => {
  return (
    <Layout titleDescription="VigiA - Administración">
      <Panel />
    </Layout>
  );
};

export default PanelAgent;
