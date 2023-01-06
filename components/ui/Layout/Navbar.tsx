import type { NextPage } from "next";
import Image from "next/image";
import styles from "../../../styles/Navbar.module.scss";
import Container from "@mui/material/Container";
import Head from "next/head";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { Auth } from "aws-amplify";
import { useAuth } from "../../../src/contexts/auth-context";

/*
const Navbar: NextPage = () => {
  return (
    <>
     <Container maxWidth="sm">
        <div></div>
      </Container>
    </>
  )
}
*/

const theme = createTheme({
  components: {
    // Name of the component
    MuiMenu: {
      styleOverrides: {
        // Name of the slot
        root: {
          ".MuiMenu-paper": {
            marginTop: "0.5rem",

            backgroundColor: "#FFA300",
            borderRadius: "20px",
          },
          ".MuiMenu-paper li": {
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});

const PersonalizedUserMenu = createTheme({
  components: {
    // Name of the component
    MuiMenu: {
      styleOverrides: {
        // Name of the slot
        root: {
          ".MuiMenu-paper": {
            marginTop: "0.5rem",
            marginRight: "0.5rem",
            backgroundColor: "#FFA300",
            borderRadius: "20px",
          },
          ".MuiMenu-paper li": {
            paddingLeft: "2rem",
            paddingRight: "2rem",
          },
          // Some CSS
        },
      },
      defaultProps: {},
    },
  },
});

const Pages = [
  { name: "Oportunidades", route: "/opportunities" },
  { name: "Consultar", route: "/questions" },
  { name: "Reclamar", route: "/claims" },
  { name: "Publicaciones", route: "/posts" },
  { name: "UOCs", route: "/uocs" },
  { name: "Buscar", route: "/search" },
];
const PagesUser = [
  { name: "Panel", route: "/app/panel", roles: [] },
  {
    name: "Panel Agente",
    route: "/app/panelAgent",
    roles: ["SUPER", "ASEPY", "SUPERASEPY"],
  },
  {
    name: "Administración",
    route: "/app/panelAdmin",
    roles: ["SUPER"],
  },
];

const Navbar: NextPage = () => {
  const router = useRouter();
  const noRoutesLogo: string[] = ["/"];
  
  const [signedInUser, setSignedInUser] = React.useState<boolean>(false);
  const { user, signOut } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  React.useEffect(() => {
    setSignedInUser(user != null);
  }, [user]);

  async function closeSessionMenu() {
    handleCloseUserMenu();
    logout();
  }
  async function logout() {
    try {
      await Auth.signOut();/*{ global: true }*/
      signOut();
      router.push("/");
    } catch (error) {
      signOut();
      router.push("/");
      console.log("error signing out: ", error);
    }
  }
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  //disableGutters
  return (
    <>
      <Head>{}</Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" className={styles.NavbarBackground}>
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: { md: "flex", lg: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <ThemeProvider theme={theme}>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { md: "block", lg: "none" },
                  }}
                  className="PrincipalMenu"
                >
                  {Pages.map((page) => (
                    <Link href={page.route} key={page.name}>
                      <a>
                        <MenuItem onClick={handleCloseNavMenu}>
                          <Typography
                            textAlign="center"
                            className={styles.ItemMenu}
                          >
                            {page.name}
                          </Typography>
                        </MenuItem>
                      </a>
                    </Link>
                  ))}
                </Menu>
              </ThemeProvider>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              {noRoutesLogo.includes(router.pathname) ? (
                <></>
              ) : (
                <Link href={"/"}>
                  <a>
                    <img
                      src="/images/logos/vigia_icono_blanco.svg"
                      alt="vigia"
                      className={styles.NavbarLogoIcon}
                    />
                    <img
                      src="/images/logos/vigia_texto_blanco.svg"
                      alt="vigia"
                      className={styles.NavbarLogoText}
                    />
                  </a>
                </Link>
              )}
            </Box>

            {Pages.map((page) => (
              <Link href={page.route} key={page.name}>
                <Button
                  color="inherit"
                  className={styles.Font + " " + styles.FontNavbar}
                  sx={{
                    display: {
                      xs: "none",
                      sm: "none",
                      md: "none",
                      lg: "block",
                    },
                  }}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
            {signedInUser ? (
              <Button
                color="inherit"
                className={
                  styles.Font +
                  " " +
                  styles.FontNavbar +
                  " " +
                  styles.FontNavbarButton
                }
                onClick={handleOpenUserMenu}
              >
                {user?.given_name}
              </Button>
            ) : (
              <Link href={"/login"}>
                <Button
                  color="inherit"
                  className={
                    styles.Font +
                    " " +
                    styles.FontNavbar +
                    " " +
                    styles.FontNavbarButton
                  }
                >
                  Entrar
                </Button>
              </Link>
            )}

            {/*
              <Link href={'/login'}>
                  <Button color="inherit" className={styles.Font+' '+styles.FontNavbar+' '+styles.FontNavbarButton}
                  onMouseOver={handleOpenUserMenu}
                  >Entrar</Button>
                </Link>*/}
          </Toolbar>
        </AppBar>
        <ThemeProvider theme={PersonalizedUserMenu}>
          <Menu
            id="menu-userappbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            sx={{
              display: { md: "block" },
            }}
            className="PrincipalMenu"
            disableScrollLock={true}
          >
            {PagesUser.filter((data) => {
              return (
                data.roles.length == 0 ||
                data.roles.some((rol) => {
                  if((!user?.roles?.includes)){
                    return false;
                  }
                  return user?.roles?.includes(rol);
                })
              );
            }).map((page) => (
              <Link href={page.route} key={page.name}>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" className={styles.ItemMenu2}>
                    {page.name}
                  </Typography>
                </MenuItem>
              </Link>
            ))}

            {
              /*<MenuItem  onClick={handleCloseUserMenu}>

                        <Typography textAlign="center" className={styles.ItemMenu2}>

                          </Typography>
                        </MenuItem>
*/
              signedInUser ? (
                <MenuItem onClick={closeSessionMenu}>
                  <Typography textAlign="center" className={styles.ItemMenu2}>
                    Cerrar Sesión
                  </Typography>
                </MenuItem>
              ) : null
            }
          </Menu>
        </ThemeProvider>
      </Box>
    </>
  );
};
export default Navbar;
