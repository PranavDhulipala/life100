import { test, expect, type Page } from '@playwright/test'
async function openView(page:Page,name:string){const target=page.getByRole('button',{name,exact:true});if(!await target.isVisible()){await page.getByRole('button',{name:'More',exact:true}).click()}await target.click()}
test('notes survive reload, and workspace search finds them', async ({page}) => {
  await page.goto('./')
  await expect(page.getByRole('heading', {name:'Today',exact:true})).toBeVisible()
  await page.getByRole('button', {name:'Notes',exact:true}).click()
  await page.getByRole('button', {name:'New',exact:true}).click()
  await page.getByLabel('Title', {exact:true}).fill('Robotics reading')
  await page.getByLabel('Markdown', {exact:true}).fill('State estimation and sensor fusion')
  await expect(page.getByText('State estimation and sensor fusion', {exact:true}).last()).toBeVisible()
  await page.reload()
  await openView(page,'Search')
  await page.getByRole('searchbox').or(page.getByRole('textbox', {name:'Search',exact:true})).fill('Robotics reading')
  await expect(page.getByRole('button', {name:/Robotics reading/})).toBeVisible()
  await page.getByRole('button', {name:/Robotics reading/}).click()
  await expect(page.getByLabel('Title', {exact:true})).toHaveValue('Robotics reading')
})
test('AI can be opened without credentials', async ({page}) => {
  await page.goto('./')
  await page.getByRole('button', {name:'AI Studio',exact:true}).click()
  await expect(page.getByRole('button', {name:'OpenAI',exact:true})).toBeVisible()
  await expect(page.getByRole('button', {name:'Claude',exact:true})).toBeVisible()
})

test('workspace stays inside viewport and has accessible navigation', async ({page})=>{for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});await page.goto('./');await expect(page.getByRole('heading',{name:'Today',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);await page.screenshot({path:test.info().outputPath('today-'+width+'.png'),fullPage:true});await openView(page,'Goals');await expect(page.getByRole('heading',{name:'Goals',exact:true})).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+1);await openView(page,'Today')}})
