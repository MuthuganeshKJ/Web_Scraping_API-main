import puppeteer from 'puppeteer';

const scraper = async (query)=>{

  const browser = await puppeteer.launch({headless:false});
 
  // Create a page
  const page = await browser.newPage();


  const wastedive_data = await wastedive_scraper(query, page);
  const green_biz_data = await green_biz_scraper(query, page);
  const plasticstoday_data = await plasticstoday_scraper(query, page);

  browser.close();

  return [wastedive_data, green_biz_data, plasticstoday_data];
}
const wastedive_scraper =  async (query, page)=> {
   // waste dive site link
   const waste_dive_link  = "https://www.wastedive.com/search/?q="
        
   // Launch the browser

 
   // Go to your site
   
   await page.goto(waste_dive_link+query);
 

   // This code is used to get the article links from the query search page
   const getLinks = await page.evaluate(()=>{
     const top_stories = document.querySelectorAll(".row.feed__item");
     
     return Array.from(top_stories).map((story)=>{
         const HTML = story.innerHTML;
         const anchor = story.querySelector('a');
         const url = anchor.href;
         const title = anchor.innerText;

         const authour_and_date = Array.from(story.querySelectorAll('.secondary-label')).map((items)=>{
           return items.innerText;
         })

         const authour = authour_and_date[0];
         const date = authour_and_date[1];
         return {title, url, authour, date};
     })
   })

   const next_page_link = await page.evaluate(()=>{
       const next_page = document.querySelector(".pagination a").href;
       return next_page;
   })
   
   console.log(next_page_link);
   console.log(getLinks)
   return getLinks;
  //  await browser.close();
} 

const green_biz_scraper =  async (query, page)=>{
        // waste dive site link
        const green_biz_link  = "https://www.greenbiz.com/search?search_api_fulltext="

        await page.goto(green_biz_link+query);
      

        // This code is used to get the article links from the query search page
        const getLinks = await page.evaluate(()=>{
          const top_stories = document.querySelectorAll(".views-row");
          
          return Array.from(top_stories).map((story)=>{
            // const HTML = story.innerHTML;
               const anchor = story.querySelector('.views-field.views-field-aggregated-field-1 a');
               const url = anchor.href;
               const title = anchor.innerText;
               const content = story.querySelector(".views-field.views-field-summary span").innerText;
            //   const title = anchor.innerText;
               const authour_div = story.querySelector(".views-field.views-field-created");
               const authour  = authour_div.querySelector("span").innerText;
              return {title, url, content, authour};
          })
        })

        console.log(getLinks)
        
        // await browser.close();
        return getLinks;
}

const plasticstoday_scraper = async (search, page) => {
  page.on('console', (msg) => console.log('Page Log:', msg.text()));

  await page.goto(`https://www.plasticstoday.com/search/node/${search}`);

  const articles = await page.evaluate(() => {
    const articleElements = document.querySelectorAll('.article-teaser__search.article-teaser.article-teaser__icon__article');
    const articlesArray = [];

    articleElements.forEach((article) => {
      console.log(article.innerHTML);
      const titleElement = article.querySelector('.title');
      const summaryElement = article.querySelector('.summary-wrapper');
      const imageElement = article.querySelector('.img-container img');
      const anchorElement = article.querySelector('.img-container a');
      const dateElement = article.querySelector('.date');

      const title = titleElement ? titleElement.innerText : null;
      const summary = summaryElement ? summaryElement.innerText : null;
      const imageUrl = imageElement ? imageElement.getAttribute('data-src') : null;
      const link = anchorElement ? 'https://www.plasticstoday.com' + anchorElement.getAttribute('href') : null;
      const date = dateElement ? dateElement.innerText : null;

      articlesArray.push({ title, summary, imageUrl, link, date });
    });

    return articlesArray;
  });

  return articles;
}


export default scraper;

