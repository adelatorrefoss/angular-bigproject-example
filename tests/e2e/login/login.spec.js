// spec.js
describe('Login', function() {
  var email = element(by.id('email'));
  var password = element(by.id('password'));
  var errors = element(by.id('errors'));
  var submit = element(by.id('submit'));

  beforeEach(function() {
    browser.get('http://localhost:8080/login');
  });

  it('empty error', function() {
    submit.click();
    expect(errors.getText()).toEqual('{"password":{"message":"Can\'t be empty","code":"CANT_BE_EMPTY"},"email":{"message":"Not an email","code":"NOT_AN_EMAIL"}}');
  });

  it('ok', function() {
    email.sendKeys("jimena@test.com");
    password.sendKeys("abc12345");

    submit.click();

    // expect(errors.getText()).toEqual('{"password":{"message":"Can\'t be empty","code":"CANT_BE_EMPTY"},"email":{"message":"Not an email","code":"NOT_AN_EMAIL"}}');

  });

});
