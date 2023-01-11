import type { NextPage } from "next";
import { useRouter } from "next/router";
import PublicationAgent from "../../components/publication-agent/PublicationAgent";
import Layout from "../../components/ui/Layout/Layout";
import { TypeClaimOrQuestion } from "../../src/interfaces/type-claim-or-question";

const AppPublicationAgent: NextPage = () => {
  const router = useRouter();
  const { enlace, llamado, tipo } = router.query;
  return (
    <Layout titleDescription="VigiA - Realizar Publicación">
      <PublicationAgent
        enlace={enlace as string}
        llamado={llamado as string}
        tipo={tipo as TypeClaimOrQuestion}
      />
    </Layout>
  );
};

export default AppPublicationAgent;
