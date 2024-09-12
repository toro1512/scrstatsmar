import express from 'express'
import { chromium} from  'playwright'
import fs from 'fs';

const app = express();
let browser, context, page;
const COOKIES_PATH = 'cookies.json';

// Configuración de tiempos de espera
const NAVIGATION_TIMEOUT = 30000; // 30 segundos
const ELEMENT_TIMEOUT = 10000; // 10 segundos

async function initializeBrowser() {
  if (!browser) {
    browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();
    if (fs.existsSync(COOKIES_PATH)===false){
        await authenticate();
        console.log("se autentica")
    }
    await loadCookies(context);
    console.log("carga los cookies")
    
  }else{
    console.log("browser ya inicializado")
  }
}

async function authenticate() {
  try {
    console.log("autenticando")
    // await page.goto('https://smarthand.pro/ps/#LLinusLLove')
         //   await page.getByRole('textbox',{name:"Login"}).fill('toro1512')
           // await page.getByRole('textbox',{name:"Password"}).fill('A12345')
           // await page.getByRole('button',{name:"Sign In"}).click()
    await page.goto('https://smarthand.pro/en');
    await page.getByRole('link', { name: "CONTROL PANEL" }).click();
    await page.getByRole('textbox', { name: "Login" }).fill('vaneraraAA');
    await page.getByRole('textbox', { name: "Password" }).fill('A12345');
    await Promise.all([
      page.waitForNavigation({ timeout: NAVIGATION_TIMEOUT }),
      page.getByRole('button', { name: "Sign In" }).click({ timeout: ELEMENT_TIMEOUT })
    ]);
    await saveCookies(context);
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
}
app.get("/",(req,res) =>{
    console.log("home")
    res.json({
        message: "evitar",
        vector: ["35","53","15","53","54(2)","45","50"],
        fecha: new Date().toLocaleDateString(),
        
    });

})

app.get("/cas", async (req, res) => {
  const url = "xxxxxxxxxx";
  if (!url) {
    return res.status(400).send('URL is required');
  }

  try {
    
    await initializeBrowser();
    
    console.log("Navigating to URL");
    const response = await page.goto('https://smarthand.pro/ps/#LLinusLLove', { 
      waitUntil: 'networkidle', 
      timeout: NAVIGATION_TIMEOUT 
    });

    if (!response.ok()) {
      throw new Error(`HTTP error! status: ${response.status()}`);
    }

    const html = await page.content();
    res.send(html);
  } catch (error) {
    console.error('Error fetching the URL:', error);
    if (error.name === 'TimeoutError') {
      res.status(504).send('Timeout error: The page took too long to respond');
    } else {
      res.status(500).send(`Error fetching the URL: ${error.message}`);
    }
  }
});

// Función para cerrar el navegador al cerrar el servidor
async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
    context = null;
    page = null;
  }
}

// Manejo de cierre del servidor
process.on('SIGINT', async () => {
  await closeBrowser();
  process.exit();
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Funciones de manejo de cookies (debes implementarlas)
async function loadCookies(context) {
    if (fs.existsSync(COOKIES_PATH)) {
        const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
        await context.addCookies(cookies);
    }
}

async function saveCookies(context) {
    const cookies = await context.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
}