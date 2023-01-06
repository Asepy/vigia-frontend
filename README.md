# A. Requisitos
## I. Tener [NodeJs](https://nodejs.org/es/) Intalado preferible 16 <

## II. Instalar Amplify CLI
```sh
npm install -g @aws-amplify/cli
```

## III. Instalar las dependencias
```sh
npm install 
```
## IV. Crear un usuario IAM en la consola de AWS con los permisos suficientes para utilizar los siguientes servicios:
> CloudWatch, EventBridge, Lambda, Api Gateway, CloudFormation, Amplify, Cognito, SES o bien un usuario IAM con la politica de servicios de AdministratorAccess

### Se debe crear una cuenta en la [consola de AWS](https://aws.amazon.com/es/)

1. Ingresar al servicio IAM
2. Ingresar Administración del acceso > Usuarios > Agregar Usuario
3. Ingresar el nombre de Usuario y marcar la casilla Clave de acceso: acceso mediante programación
4. Asociar la politica por ejemplo  (AdministratorAccess) y Finalizar descargando el archivo CSV con las credenciales.  

## V. Configurar Cognito, por primera vez
1. Inicializar Amplify
```sh
amplify init
```
2. Ingresar el nombre del proyecto en la consola: Ejemplo VigiACognito
```console
Enter a name for the proyect VigiACognito
```
3. Seleccionar la configuracion por defecto
```console
Initialize the proyect with above configuration? Yes
```
4. Seleccionar el metodo de autenticacion para inicializar el servicio con las credenciales del usuario IAM, y seleeccionar la region mas conveniente del listado https://aws.amazon.com/es/about-aws/global-infrastructure/regions_az , por ejemplo sa-east-1 para Sao Paolo
```console
Select the authentication method you want to use: AWS access keys
```
5. Añadir el servicio de cognito al finalizar
```sh
amplify add auth
```
6. Seleccionar la configuracion por defecto
```console
Do you want to use the default authentication and security configuration? Default configuration
```
7. Seleccionar el metodo de login por Correo Electronico
```console
How do you want users to be able to sign in ? Email
```
8. Seleccionar que no deseamos configurar opciones avanzadas
```console
Do you want to configure advanced settings? No, I am done
```

9. Aplicar la configuracion y seleccionar continuar
```sh
amplify push
```
## VI. Variables de entorno
1. Crear el archivo .env 
```sh
touch .env
```
2. Definir las siguientes variables de entorno requeridas:
```env
# Url del Backend
NEXT_PUBLIC_BACKEND_URL="https://www.backend.com"

# Url del Frontend
NEXT_PUBLIC_FRONTEND_URL="https://www.frontend.com"

# Nombre de Usuario de la cuenta twitter
NEXT_PUBLIC_TWITTER_USER="UserPost"

# Estos valores se pueden encontrar en el archivo /src/aws-exports.js generado:

# Id de clente web de cognito
NEXT_PUBLIC_COGNITO_CLIENT_ID=""

# Id de la pool de usuarios de cognito
NEXT_PUBLIC_COGNITO_USER_POOL_ID=""

# Id de la region
NEXT_PUBLIC_COGNITO_REGION=""

# Id del identity pool de cognito
NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID=""
```
## VII. Correr el proyecto
```sh
npm run dev
```