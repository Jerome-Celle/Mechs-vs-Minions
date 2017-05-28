import { MechsVsMinionsPage } from './app.po';

describe('mechs-vs-minions App', () => {
  let page: MechsVsMinionsPage;

  beforeEach(() => {
    page = new MechsVsMinionsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
