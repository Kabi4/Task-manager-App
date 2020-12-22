const { fahrenheitToCelsius, celsiusToFahrenheit } = require('./math');

test('Fathrenite to Celcius', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
});

test('Celcius to Fathernite', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
});

test('Async Test Case', (done) => {
    setTimeout(() => {
        expect(1).toBe(1);
        done();
    }, 2000);
});

test('Async Test Case', async () => {
    const num = await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 2000);
    });
    expect(num).toBe(1);
});
