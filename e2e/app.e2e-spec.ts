import { EdotimePage } from './app.po';

describe('edotime App', function() {
  let page: EdotimePage;

  beforeEach(() => {
    page = new EdotimePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
