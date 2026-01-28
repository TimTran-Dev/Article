export const environment = {
  production: false,
  clearkKey: 'pk_test_Ym9zcy1jaG93LTI0LmNsZXJrLmFjY291bnRzLmRldiQ',
  useLocal: true,
  localUrl: 'https://localhost:44345/api',
  productionUrl: 'https://newsappapi-a8vf.onrender.com/api',

  get apiUrl(): string {
    return this.useLocal ? this.localUrl : this.productionUrl;
  },
};
