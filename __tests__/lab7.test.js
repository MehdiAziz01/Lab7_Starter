describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // 1) Make sure 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');
    const numProducts = await page.$$eval('product-item', items => items.length);
    expect(numProducts).toBe(20);
  });

  // 2) Make sure each <product-item> is populated
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');
    const allData = await page.$$eval('product-item', items =>
      items.map(item => item.data)
    );
  
    for (let i = 0; i < allData.length; i++) {
      const { title, price, image } = allData[i];
  
      // title and image are strings, price is a number
      expect(title.length).toBeGreaterThan(0);
      expect(image.length).toBeGreaterThan(0);
  
      // for price, check numeric > 0
      expect(typeof price).toBe('number');
      expect(price).toBeGreaterThan(0);
    }
  }, 10000);

  // 3) Clicking "Add to Cart" on the first <product-item> should change its button text
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');
    const firstItem = (await page.$$('product-item'))[0];
    const shadow = await firstItem.getProperty('shadowRoot');
    const button = await shadow.$('button');
    await button.click();
    const btnText = await (await button.getProperty('innerText')).jsonValue();
    expect(btnText).toBe('Remove from Cart');
  }, 2500);

  // 4) Clicking "Add to Cart" on every <product-item> should update cart count to 20
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');
    // Click "Add to Cart" only on items not already in cart
    await page.$$eval('product-item', items => {
      items.forEach(item => {
        const btn = item.shadowRoot.querySelector('button');
        if (btn.innerText === 'Add to Cart') btn.click();
      });
    });
    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('20');
  }, 10000);

  // 5) After reload, cart should remember all items
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    const texts = await page.$$eval('product-item', items =>
      items.map(item => item.shadowRoot.querySelector('button').innerText)
    );
    texts.forEach(text => expect(text).toBe('Remove from Cart'));
    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('20');
  }, 10000);

  // 6) localStorage “cart” should be "[1,2,…,20]"
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage to make sure cart is correct...');
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe(
      '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]'
    );
  });

  // 7) Remove everything from cart and check count is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen after removing from cart...');
    await page.$$eval('product-item', items => {
      items.forEach(item => {
        const btn = item.shadowRoot.querySelector('button');
        if (btn.innerText === 'Remove from Cart') btn.click();
      });
    });
    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('0');
  }, 10000);

  // 8) After reload, all buttons should say "Add to Cart" and count stay 0
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');
    await page.reload();
    const texts = await page.$$eval('product-item', items =>
      items.map(item => item.shadowRoot.querySelector('button').innerText)
    );
    texts.forEach(text => expect(text).toBe('Add to Cart'));
    const count = await page.$eval('#cart-count', el => el.innerText);
    expect(count).toBe('0');
  }, 10000);

  // 9) localStorage “cart” should be "[]"
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage for an empty cart...');
    const cart = await page.evaluate(() => localStorage.getItem('cart'));
    expect(cart).toBe('[]');
  });
});
