import { useRouter } from "next/router";
import React from "react";
import { useAlertContext } from "../../src/contexts/alert-context";
import { useLoading } from "../../src/contexts/loading-context";
import { CONSULTA, TypeClaimOrQuestion } from "../../src/interfaces/type-claim-or-question";
import fetchData from "../../src/utils/fetch";
import { validateSchema } from "../../src/utils/schema";
import PublicationAgentView from "./PublicationAgentView";
import { publicationAgentSchema } from "./schema";

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

type PublicationAgentProps = {
  enlace: string;
  llamado: string;
  tipo: TypeClaimOrQuestion;
};

const PublicationAgent = ({
  enlace,
  llamado,
  tipo,
}: PublicationAgentProps) => {
  const sourceUrl = tipo === CONSULTA ? 'questions/question': 'claims/claim'
  const shortUrl = `${FRONTEND_URL}/${sourceUrl}/?id=${enlace}`;
  const router = useRouter();
  const { setAlertMessage } = useAlertContext();
  const { setLoading, loading} = useLoading();
  const [form, setForm] = React.useState({
    tweet: "",
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function createTweet() {
    if (!validateSchema(publicationAgentSchema, form, setAlertMessage)) {
      return;
    }
    if(loading){
      return;
    }
    setLoading(true);
    try {
      const payload = {
        tweet: form.tweet,
        enlace,
        llamado,
        tipo
      };
      const res = await fetchData("createTweet", payload, "POST", true);
      if (res.error) {
        return setAlertMessage("Error: " + res.message);
      }else{
        setAlertMessage({message:"Tweet Publicado",severity:"success"});
      }
      console.log(res);
      setLoading(false);
      router.push(
        `/app/publicationFinishAgent?enlace=${enlace}&shortUrl=${encodeURIComponent(
          shortUrl
        )}&tweet=${encodeURIComponent(form.tweet)}&tipo=${encodeURIComponent(tipo)}`
      );
    } catch (err: any) {
      setAlertMessage("Error: " + err.message);
      console.error({ err });
    }
  }
  return (
    <PublicationAgentView
      enlace={enlace}
      sourceUrl={sourceUrl}
      tipo={tipo}
      onChange={onChange}
      onSubmit={createTweet}
      onCopy={()=>{navigator.clipboard.writeText(shortUrl); setAlertMessage({message:"Enlace copiado!",severity:"success"});}}
      form={form}
    />
  );
};

export default PublicationAgent;
