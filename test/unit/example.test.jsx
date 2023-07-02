import React from 'react';
import { initStore } from "../../src/client/store";
import { Application } from '../../src/client/Application';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import {
    getByRole,
    getByTestId,
    findByTestId,
    render,
    screen,
    getByText,
    findByRole,
    findByText
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { FakeCartApi } from './fakeCartApi';
import { ExampleApi } from '../../src/client/api';

const basename = '/hw/store';

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

describe('Общие требования', () => {

    it('Название магазина в шапке должно быть ссылкой на главную страницу', () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();

        const store = initStore(api, cart);

        const application = (
          <BrowserRouter basename={basename}>
            <Provider store={store}>
              <Application />
            </Provider>
          </BrowserRouter>
        );

        const { getByText } = render(application);

        expect(getByText(/^Example store$/i)).toHaveAttribute('href', '/hw/store/');
    });

    it('На ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();
        const user = userEvent.setup();

        const store = initStore(api, cart);

        const application = (
          <BrowserRouter>
            <Provider store={store}>
              <Application />
            </Provider>
          </BrowserRouter>
        );

        const { getByLabelText, getByTestId } = render(application);

        const navbarToggler = getByLabelText(/Toggle navigation/i);
        const menu = getByTestId('menu');

        // expect(menu).toHaveClass('collapse');

        await user.click(navbarToggler);
        expect(menu).not.toHaveClass('collapse');
    });

    it('При выборе элемента из меню "гамбургера", меню должно закрываться', async () => {
        const user = userEvent.setup();
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();

        const store = initStore(api, cart);

        const application = (
          <BrowserRouter>
            <Provider store={store}>
              <Application />
            </Provider>
          </BrowserRouter>
        );

        const { getByLabelText, getByTestId, getByText } = render(application);

        const navbarToggler = getByLabelText(/Toggle navigation/i);
        const menu = getByTestId('menu');
        const link = getByText( /^Catalog$/i);

        await user.click(navbarToggler);
        // expect(menu).not.toHaveClass('collapse');
        await user.click(link);

        expect(menu).toHaveClass('collapse');
    });

    it('В каталоге должны отображаться товары, список которых приходит с сервера', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();

        const store = initStore(api, cart);

        const application = (
          <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
            <Provider store={store}>
              <Application />
            </Provider>
          </MemoryRouter>
        );

        const { findAllByTestId } = render(application);

        const products = await findAllByTestId(/[0-9]/i);

        expect(products).toHaveLength(4);
    });

    it('Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();

        const store = initStore(api, cart);

        const application = (
          <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
            <Provider store={store}>
              <Application />
            </Provider>
          </MemoryRouter>
        );

        const { findAllByTestId } = render(application);

        const products = await findAllByTestId(/[0-9]/i);
        const randomProduct = products[randomInteger(0, 3)];

        const title = getByRole(randomProduct, 'heading');
        const price = getByTestId(randomProduct,'card-price');
        const link = getByRole(randomProduct, 'link');

        expect(title).toBeInTheDocument();
        expect(link).toBeInTheDocument();
        expect(price).toBeInTheDocument();
    });

    it('На странице с подробной информацией отображаются: название товара, ' +
        'его описание, цена, цвет, материал и кнопка * * "добавить в корзину"', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/catalog/0"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findByTestId } = render(application);


        const title = await findByTestId('product-name');
        const description = await findByTestId( 'product-description');
        const price = await findByTestId( 'product-price');
        const color = await findByTestId( 'product-color');
        const material = await findByTestId( 'product-material');
        const cartBtn = await findByTestId( 'product-add-to-cart-btn');

        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
        expect(price).toBeInTheDocument();
        expect(color).toBeInTheDocument();
        expect(material).toBeInTheDocument();
        expect(cartBtn).toBeInTheDocument();
    });

    it('Если товар уже добавлен в корзину, в каталоге ' +
        'должно отображаться сообщение об этом', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/catalog"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findByText } = render(application);

        expect(await findByText(/item in cart/i)).toBeInTheDocument();
    });

    it('Если товар уже добавлен в корзину, то на странице товара ' +
        'должно отображаться сообщение об этом', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/catalog/0"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findByText } = render(application);

        expect(await findByText(/item in cart/i)).toBeInTheDocument();
    });

    it('Если товар уже добавлен в корзину, повторное нажатие кнопки ' +
        '"добавить в корзину" должно увеличивать его количество', async () => {
        const user = userEvent.setup();
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi();

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/catalog/0"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findByTestId } = render(application);

        const cartBtn = await findByTestId('product-add-to-cart-btn');

        expect(store.getState().cart[0].count).toBe(1);

        await user.click(cartBtn);

        expect(store.getState().cart[0].count).toBe(2);
    });

    it('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi({
            0: { name: "Incredible Fish", price: 445, count: 1 },
            2: { name: "Rustic Car", price: 313, count: 2 }
        });

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findByText } = render(application);

        expect(await findByText(/Cart \(2\)/i)).toBeInTheDocument();
    });

    it('Для каждого товара должны отображаться название, цена, количество , стоимость, ' +
        'а также должна отображаться общая сумма заказа', async () => {
        const api = new ExampleApi(basename);

        const cart = new FakeCartApi({
            0: { name: "Incredible Fish", price: 445, count: 1 },
            1: { name: "Incredible Pizza", price: 532, count: 5 },
            2: { name: "Rustic Car", price: 313, count: 2 }
        });

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findAllByTestId, container } = render(application);

        const tableRows = await findAllByTestId(/[0-9]/i);

        const randomRow = tableRows[randomInteger(0, 2)];

        const title = await findByTestId(randomRow,'cart-name');
        const price = await findByTestId(randomRow, 'cart-price');
        const count = await findByTestId(randomRow, 'cart-count');
        const sum = await findByTestId(randomRow, 'cart-sum');
        const total = await findByTestId(container, 'cart-total');

        expect(title).toBeInTheDocument();
        expect(price).toBeInTheDocument();
        expect(count).toBeInTheDocument();
        expect(sum).toBeInTheDocument();
        expect(total).toBeInTheDocument();
        expect(getByRole(container,'cell', { name: /\$3731/i })).toBeInTheDocument();
    });

    it('В корзине должна отображаться таблица с добавленными в нее товарами', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi({
            0: { name: "Incredible Fish", price: 445, count: 1 },
            1: { name: "Incredible Pizza", price: 532, count: 5 },
            2: { name: "Rustic Car", price: 313, count: 2 }
        });

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findAllByTestId } = render(application);

        const tableRows = await findAllByTestId(/[0-9]/i);

        expect(tableRows).toHaveLength(3);
    });

    it('В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
        const user = userEvent.setup();
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi({
            0: { name: "Incredible Fish", price: 445, count: 1 },
            1: { name: "Incredible Pizza", price: 532, count: 5 },
            2: { name: "Rustic Car", price: 313, count: 2 }
        });

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findByText, findByRole } = render(application);

        const clearBtn = await findByRole('button', { name: /clear shopping cart/i });

        await user.click(clearBtn);

        const noticeable = await findByText(/Cart is empty./i);

        expect(noticeable).toBeInTheDocument();
    });

    it('Если корзина пустая, должна отображаться ссылка на каталог товаров', async () => {
        const api = new ExampleApi(basename);
        const cart = new FakeCartApi({});

        const store = initStore(api, cart);

        const application = (
            <MemoryRouter initialEntries={["/cart"]} initialIndex={0}>
                <Provider store={store}>
                    <Application />
                </Provider>
            </MemoryRouter>
        );

        const { findByText, findAllByRole } = render(application);

        const noticeable = await findByText(/Cart is empty./i);
        const links = await findAllByRole('link', { name: /catalog/i })

        expect(noticeable).toBeInTheDocument();
        expect(links).toHaveLength(2);
        expect(links[1]).toHaveAttribute('href', '/catalog');
    });
});