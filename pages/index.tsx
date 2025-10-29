import * as React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import Layout from "../components/ui/Layout/Layout";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CountUp from "react-countup";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../src/contexts/auth-context";
import { getNumber } from "../components/imports/Functions";
import fetchData from "../src/utils/fetch";

const Home: NextPage = () => {
  const { user } = useAuth();
  const { isReady } = useRouter();
  const [totalClaims, setTotalClaims] = React.useState(0);
  const [totalQuestions, setTotalQuestions] = React.useState(0);
  const [totalRequest, setTotalRequests] = React.useState(0);
  const [totalFind, setTotalFind] = React.useState(0);
  totalClaims;
  totalQuestions;
  totalRequest;
  totalFind;
  React.useEffect(() => {
    if (isReady) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, user]);
  React.useEffect(() => {
    if (isReady) {
      //getFetchGetCountRequestIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  async function getFetchGetCountRequestIndex() {
    try {
      let data: any = await fetchData("getCountRequestIndex",{ },"POST",false);

      setTotalClaims(getNumber(data?.reclamos_resueltos));
      setTotalQuestions(getNumber(data?.consultas_resueltas));
      setTotalRequests(getNumber(data?.solicitudes_en_proceso));
      setTotalFind(getNumber(data?.oportunidades_encontradas))
    } catch (e) {}
  }
  getFetchGetCountRequestIndex;

  return (
    <>
      <Layout>
        <Head>
          <title>VigiA</title>
          <meta name="description" content="VigiA Inicio" />
          <link rel="icon" href="/favicon.ico" />
          
        </Head>

        <Box
          className={styles.BackgroundPrincipal}
          sx={{
            minHeight: { sm: "unset", md: "calc( 100vh - 64px)" },
            //remove-counters  minHeight: { sm: "unset", md: "calc( 100vh - 114px - 150px)" },
          }}
        >
          <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} sx={{}}>
              <Box sx={{ padding: "2rem" , paddingTop: { md:"6rem"}
                //remove-counter
               }}>
                <img
                  src="/images/logos/vigia_texto_blanco.svg"
                  alt="VigiA"
                  style={{ width: "45%" }}
                />
                <img
                  src="/images/logos/vigia_texto_descripcion.svg"
                  alt="VigiA"
                  style={{ width: "45%", display: "block" }}
                />
                {/*<h2 className={styles.FontPrincipalSize}>Plataforma <br/>de Monitoreo</h2>*/}
                <Box className={styles.SecondaryTitle_1}>
                  Encuentra oportunidades de vender al estado y en el proceso
                  ayudanos a mejorar las compras públicas de Paraguay
                </Box>
                <Box className={styles.SecondaryTitle_2}>
                  Este portal te ayuda a generar consultas o reclamos
                  relacionados a procesos de contratación en los que tengas
                  dudas u observaciones sobre posibles irregularidades, al mismo
                  tiempo que te permite encontrar llamados de los que puedas
                  participar.
                </Box>
                <Box sx={{ paddingTop: "30px", textAlign: "center" }}>
                  <Link href="/opportunities">
                    <a>
                      <Button
                        title="Encuentra Oportunidades"
                        variant="contained"
                        disableElevation
                        className={
                          styles.ButtonPrincipal +
                          " " +
                          styles.ButtonPrincipalBanner +
                          " " +
                          styles.BigButton +
                          " " +
                          styles.ButtonContrast
                        }
                      >
                        {" "}
                        Oportunidades
                      </Button>
                    </a>
                  </Link>
                </Box>
                <Box
                  sx={{
                    textAlign: "center",
                    fontSize: "1.2rem",
                    marginTop: "0.6rem",
                  }}
                >
                  <Link href="/claims" className={styles.ButtonText}>
                    <a>
                      <span className={styles.ButtonText}>Reclamar</span>
                    </a>
                  </Link>

                  <span className={styles.ButtonText}>·</span>

                  <Link href="/questions">
                    <a>
                      {" "}
                      <span className={styles.ButtonText}>Consultar</span>
                    </a>
                  </Link>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              className={styles.BackgroundPrincipalVector}
              sx={{
                minHeight: { sm: "unset", md: "calc( 100vh - 64px )" 
                  //remove-counter md: "calc( 100vh - 114px - 150px)" 
                },
                flexDirection: "row",
                display: "flex",
                alignItems: "flex-end",
              }}
            >
              <img
                src="/images/principal_landing.svg"
                alt=""
                style={{
                  width: "80%",
                  maxWidth: "100%",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </Grid>
          </Grid>
        </Box>
{/*INICIO CONTADORES */}
      {/*  <Box
          className={styles.BackgroundCounters}
          sx={{ padding: "20px 0 20px 0" }}
        >
          <Grid container>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Grid container>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <img
                    src="/images/reclamos_resueltos.svg"
                    alt=""
                    style={{
                      width: "80%",
                      maxWidth: "150px",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  className={styles.CounterContainer}
                >
                  <Box
                    className={styles.CounterNumber}
                    sx={{ textAlign: { xs: "center", sm: "left" } }}
                  >
                    <CountUp
                      start={0}
                      end={totalClaims}
                      duration={1}
                      separator=","
                    />
                  </Box>
                  <Box
                    className={styles.CounterDescription}
                    sx={{ textAlign: { xs: "center", sm: "left" } }}
                  >
                    Reclamos Resueltos
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Grid container>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <img
                    src="/images/consultas.svg"
                    alt=""
                    style={{
                      width: "80%",
                      maxWidth: "150px",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  className={styles.CounterContainer}
                >
                  <Box
                    className={styles.CounterNumber}
                    sx={{ textAlign: { xs: "center", sm: "left" } }}
                  >
                    <CountUp
                      start={0}
                      end={totalQuestions}
                      duration={1}
                      separator=","
                    />
                  </Box>
                  <Box
                    className={styles.CounterDescription}
                    sx={{ textAlign: { xs: "center", sm: "left" } }}
                  >
                    Consultas Aclaradas
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Grid container>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <img
                    src="/images/en_proceso.svg"
                    alt=""
                    style={{
                      width: "80%",
                      maxWidth: "150px",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  className={styles.CounterContainer}
                >
                  <Box
                    className={styles.CounterNumber}
                    sx={{ textAlign: { xs: "center", sm: "left" } }}
                  >
                    <CountUp
                      start={0}
                      end={totalRequest}
                      duration={1}
                      separator=","
                    />
                  </Box>
                  <Box
                    className={styles.CounterDescription}
                    sx={{ textAlign: { xs: "center", sm: "left" } }}
                  >
                    Gestiones en Proceso
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <Grid container>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                  <img
                    src="/images/busquedas.svg"
                    alt=""
                    style={{
                      width: "80%",
                      maxWidth: "150px",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  className={styles.CounterContainer}
                >
                  <Box
                    className={styles.CounterNumber}
                    sx={{ textAlign: { xs: "center", sm: "left" } }}
                  >
                    <CountUp
                      start={0}
                      end={totalFind}
                      duration={1}
                      separator=","
                    />
                  </Box>
                  <Box
                    className={styles.CounterDescription}
                    sx={{ textAlign: { xs: "center", sm: "left" } }}
                  >
                    Oportunidades Descubiertas
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box className={styles.LightBackground}>
          <img
            src="/images/wave_1.svg"
            alt="wave"
            style={{ width: "100%", display: "block" }}
          />
        </Box>
        *}
        {/*FIN CONTADORES */}

        <Box className={styles.LightBackground}>
          <Container>
            {/*INICIO ITEM */}
            <Grid container>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ marginTop: { xs: "4rem", sm: "6rem" } }}
              >
                <Box className={styles.BackgroundItem + " " + styles.Item1}>
                  <Box className={styles.ItemTitle}>
                    ¿Quieres encontrar <br />
                    una oportunidad?
                  </Box>
                  <br />
                  <img
                    src="/images/icons/oportunidad.svg"
                    style={{
                      width: "80%",
                      maxWidth: "170px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ marginTop: { xs: "1rem", sm: "6rem" } }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexFlow: "wrap",
                  }}
                >
                  <Box
                    sx={{ width: "10%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                  <Box
                    sx={{ width: "30%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                  <Box
                    sx={{ width: "10%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                </Box>
                <Box className={styles.ItemDescription}>
                  Puedes encontrar llamados de los que puedes participar como
                  proveedor.
                </Box>
                <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
                  <Link href="/opportunities">
                    <a>
                      <Button
                        variant="contained"
                        disableElevation
                        className={
                          styles.ButtonPrincipal +
                          " " +
                          styles.ButtonPrincipalBanner +
                          " " +
                          styles.BigButton
                        }
                      >
                        {" "}
                        Encontrar
                      </Button>
                    </a>
                  </Link>
                </Box>
              </Grid>
            </Grid>
            {/*INICIO ITEM */}
            {/*INICIO ITEM <img src="/images/logos/vigia_icono_primario.svg" style={{width:'80%',maxWidth:"50px",display:"block",margin:"0 auto"}}/>
             */}
            <Grid container>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ marginTop: { xs: "1rem", sm: "6rem" } }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexFlow: "wrap",
                  }}
                >
                  <Box
                    sx={{ width: "10%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                  <Box
                    sx={{ width: "30%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                  <Box
                    sx={{ width: "10%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                </Box>
                <Box className={styles.ItemDescription}>
                  Si quieres realizar una consulta sobre un llamado con el que
                  tengas una duda, puedes preguntar a los entes encargados.
                </Box>
                <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
                  <Link href="/questions">
                    <a>
                      <Button
                        variant="contained"
                        disableElevation
                        className={
                          styles.ButtonPrincipal +
                          " " +
                          styles.ButtonPrincipalBanner +
                          " " +
                          styles.BigButton
                        }
                      >
                        {" "}
                        Consultar
                      </Button>
                    </a>
                  </Link>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ marginTop: { xs: "1rem", sm: "6rem" } }}
              >
                <Box className={styles.BackgroundItem + " " + styles.Item2}>
                  <Box className={styles.ItemTitle}>¿Tienes alguna duda?</Box>
                  <br />
                  <img
                    src="/images/icons/consultas.svg"
                    style={{
                      width: "80%",
                      maxWidth: "165px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            {/*INICIO ITEM */}

            {/*INICIO ITEM */}
            <Grid container>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ marginTop: { xs: "3rem", sm: "6rem" } }}
              >
                <Box className={styles.BackgroundItem + " " + styles.Item3}>
                  <Box className={styles.ItemTitle}>
                    ¿Ves que algo no esta bien?
                  </Box>
                  <br />
                  <img
                    src="/images/icons/reclamos.svg"
                    style={{
                      width: "80%",
                      maxWidth: "165px",
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
                sx={{ marginTop: { xs: "1rem", sm: "6rem" } }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    flexFlow: "wrap",
                  }}
                >
                  <Box
                    sx={{ width: "10%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                  <Box
                    sx={{ width: "30%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                  <Box
                    sx={{ width: "10%" }}
                    className={styles.ItemDivisor}
                  ></Box>
                </Box>
                <Box className={styles.ItemDescription}>
                  Si ya identificaste una irregularidad, puedes ayudar actuando
                  a tiempo para que sea verificada y corregida lo más pronto
                  posible.
                </Box>
                <Box sx={{ paddingTop: "20px", textAlign: "center" }}>
                  <Link href="/claims">
                    <a>
                      <Button
                        variant="contained"
                        disableElevation
                        className={
                          styles.ButtonPrincipal +
                          " " +
                          styles.ButtonPrincipalBanner +
                          " " +
                          styles.BigButton
                        }
                      >
                        {" "}
                        Reclamar
                      </Button>
                    </a>
                  </Link>
                </Box>
              </Grid>
            </Grid>
            {/*INICIO ITEM */}
          </Container>
        </Box>
        {/*FIN ITEMS */}
        <Box className={styles.LightBackground}>
          <img
            src="/images/text_divisor_1.svg"
            alt="wave"
            style={{ width: "100%", display: "block" }}
          />
        </Box>
        <Box
          className={styles.BackgroundCounters + " " + styles.BackgroundText_1}
        >
          <Container>
            <Box
              className={styles.InfoTitle + " " + styles.TextColorSecondary}
              sx={{
                padding: {
                  xs: "40px 10px 10px 10px",
                  sm: "10px 70px 10px 70px",
                },
              }}
            >
              ¿Quiénes Somos?
            </Box>
            <Box
              className={
                styles.InfoDescription + " " + styles.TextColorSecondary
              }
              sx={{
                padding: {
                  xs: "20px 10px 60px 10px",
                  sm: "20px 70px 40px 70px",
                },
              }}
            >
              Somos una comunidad de monitoreo cívico que busca mejorar los
              procesos de compras públicas en Paraguay, con la participación de
              emprendedores, activistas y organizaciones de la sociedad civil.{" "}
              <br />
              <br />
              Esta plataforma permite identificar y monitorear fácilmente
              procesos de compras públicas a través de consultas y reclamos, que
              ayuden a generar una mayor transparencia en los llamados. <br />
              <br />
              Las consultas y/o reclamos son manejados de forma 100%
              confidencial y puedes hacerlo de manera anónima o crearte un
              usuario para que puedas vincular tus llamados de interés y darles
              seguimiento, así como también acceder a un historial de tus
              consultas, reclamos, tus postulaciones y adjudicaciones como
              proveedor.
            </Box>
          </Container>
        </Box>

        <Box className={styles.BackgroundCounters}>
          <img
            src="/images/text_divisor_2.svg"
            alt="wave"
            style={{ width: "100%", display: "block" }}
          />
        </Box>
        <Box
          className={styles.BackgroundPrincipal + " " + styles.BackgroundText_2}
        >
          <Container>
            <Box
              className={styles.InfoTitle}
              sx={{
                padding: {
                  xs: "40px 10px 10px 10px",
                  sm: "10px 70px 10px 70px",
                },
              }}
            >
              ¿Cómo funciona?
            </Box>
            <Box
              className={styles.InfoDescription}
              sx={{
                padding: {
                  xs: "20px 10px 60px 10px",
                  sm: "20px 70px 60px 70px",
                },
              }}
            >
              Tus consultas y/o reclamos son revisados por una comunidad de
              monitoreo conformada por emprendedores, activistas y
              organizaciones, que con su experiencia y conocimiento decidirán
              cómo ayudarte de la mejor manera, poniéndose en contacto con las
              entidades responsables según el caso, para que tu gestión tenga
              una mayor probabilidad de éxito.
            </Box>
          </Container>
        </Box>
      </Layout>
    </>
  );
};

//width='40vw'
//     height="40vw"
//sizes='40vw'
export default Home;
