import { newE2EPage } from '@stencil/core/testing';

describe('accordion', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<accordion></accordion>');
    const element = await page.find('accordion');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
