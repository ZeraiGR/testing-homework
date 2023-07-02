const { el } = require('../getByTestIdHelper.js');

const BUG_ID = process.env.BUG_ID ? `?bug_id=${process.env.BUG_ID}` : "";
const baseurl = 'http://localhost:3000/hw/store';

function getUrl (page) {
  if (page) {
    return `${baseurl}/${page}/${BUG_ID}`;
  } else {
    return `${baseurl}/${BUG_ID}`;
  }
}

describe('Общие требования', function() {
    it('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', async function() {
        await this.browser.url(getUrl());
        await this.browser.assertView('plain', '.navbar');
    });

    it('Вёрстка должна адаптироваться под ширину экрана - главная', async function () {
      await this.browser.url(getUrl());
      await this.browser.assertView('desktope', 'body');
      await this.browser.setWindowSize(475, 1080);
      await this.browser.assertView('mobile', 'body');
    });

    it('Для каждого товара в каталоге отображается название, ' +
        'цена и ссылка на страницу с подробной информацией о товаре', async function () {
      await this.browser.url(getUrl('catalog'));

      const titleTag = await this.browser.$(el('card-title'));
      const priceTag = await this.browser.$(el('card-price'));
      const linkTag = await this.browser.$(el('card-link'));

      const titleText = await titleTag.getText();
      const priceText = await priceTag.getText();
      const linkText = await priceTag.getText();
      const linkTagName = await linkTag.getTagName();

      expect(titleTag.isDisplayed()).toBeTruthy();
      expect(priceTag.isDisplayed()).toBeTruthy();
      expect(linkTag.isDisplayed()).toBeTruthy();
      expect(linkTagName).toBe('a');

      expect(titleText).not.toHaveLength(0);
      expect(priceText).not.toHaveLength(0);
      expect(linkText).not.toHaveLength(0);
    });

    it('Вёрстка должна адаптироваться под ширину экрана - каталог', async function () {
        const mock = await this.browser.mock('http://localhost:3000/hw/store/api/products', {
            method: 'get'
        });
    
        mock.respondOnce([
            { "id": 0, "name": "Unbranded Shoes", "price": 70 },
            { "id": 1, "name": "Incredible Pizza", "price": 532 },
            { "id": 2, "name": "Rustic Car", "price": 313 },
            { "id": 4, "name": "Generic Pizza", "price": 665 }
        ], {
            statusCode: 200,
        });
    
        await this.browser.url(getUrl('catalog'));
        await this.browser.assertView('catalog-desktop', 'body');
        await this.browser.setWindowSize(475, 800);
        await this.browser.assertView('catalog-mobile', 'body');
    });

    it('Вёрстка должна адаптироваться под ширину экрана - страница товара', async function () {
        const mock = await this.browser.mock('http://localhost:3000/hw/store/api/products/0', {
            method: 'get'
        });
    
        mock.respondOnce({
              "id": 0,
              "name": "Unbranded Shoes",
              "description": "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
              "price": 70,
              "color": "lime",
              "material": "Fresh"
          }, {
            statusCode: 200,
        });
    
        await this.browser.url(getUrl('catalog/0'));
        await this.browser.assertView('catalog-desktop', 'body');
        await this.browser.setWindowSize(475, 1080);
        await this.browser.assertView('catalog-mobile', 'body');
    });

    it.only('Вёрстка должна адаптироваться под ширину экрана - рандомная страница товара', async function () {
        await this.browser.url(getUrl('catalog/1'));
        await this.browser.assertView('catalog-desktop', 'body', {
          ignoreElements: [
            '.ProductDetails-Name',
            '.ProductDetails-Description',
            '.ProductDetails-Price',
            '.ProductDetails-Color',
            '.ProductDetails-Material'
          ]
        });
    });

    it('Вёрстка должна адаптироваться под ширину экрана - доставка', async function () {
      await this.browser.url(getUrl('delivery'));
      await this.browser.assertView('desktope', 'body');
      await this.browser.setWindowSize(475, 1080);
      await this.browser.assertView('mobile', 'body');
    });

    it('Вёрстка должна адаптироваться под ширину экрана - контакты', async function () {
      await this.browser.url(getUrl('contacts'));
      await this.browser.assertView('desktope', 'body');
      await this.browser.setWindowSize(475, 1080);
      await this.browser.assertView('mobile', 'body');
    });

    it('Вёрстка должна адаптироваться под ширину экрана - пустая корзина', async function () {
      await this.browser.url(getUrl('cart'));
      await this.browser.assertView('desktope', 'body');
      await this.browser.setWindowSize(475, 1080);
      await this.browser.assertView('mobile', 'body');
    });
});

// describe("Конвертер валют", () => {

//   it("должен появиться на странице", async ({ browser }) => {
//     const puppeteer = await browser.getPuppeteer();
//     const [page] = await puppeteer.pages(); // нам нужна первая вкладка

//     await page.goto("https://ya.ru"); // переходим на данный урл во вкладке
//     await page.keyboard.type("курс доллара к рублю"); // в элемент, который в фокусе мы вводим текст
//     await page.keyboard.press("Enter"); // нажимаем enter

//     await page.waitForSelector(".Converter", { timeout: 5000 });
//     await browser.assertView("plain", ".Converter", {
//       ignoreElements: [
//          css selectors
//       ]
//     })
//   });

// });