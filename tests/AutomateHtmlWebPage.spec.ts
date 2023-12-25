import { chromium, test, expect} from "@playwright/test"
//importing the test data and locator values
import data from "../testdata/InputTextBox.json"
import selectors from "../testdata/LocatorValues.json"
import * as fs from 'fs'

test("Test Dynamic HTML Table", async () => {
    //launching the chromium browser in non headless mode
    const browser = await chromium.launch({headless:false});
    //creating new browser context and page
    const context = await browser.newContext();
    const page = await context.newPage();
    //navigating to the dynamic table web page
    await page.goto(selectors.url)
    //clicking on the table data element
    await page.click(selectors.tableData)
    //clearing the content of table data
    await page.locator(selectors.tableDataTextBox).clear()
    //converting input data to JSON ang logging it
    //convert the javascript object or value to a json string
    const jsonfile=JSON.stringify(data)
    console.log("input data to json",jsonfile)
    //filling the table data with specified with json data
    await page.fill(selectors.tableDataTextBox,jsonfile)
    //locating the refresh button element
    const elementHandle= page.locator(selectors.refreshButton)
    await elementHandle.scrollIntoViewIfNeeded()
    //clicking on teh refresh button
    elementHandle.click()
    await page.waitForTimeout(2000)
   //waiting for th dynamic table selector to be avaialble
    await page.waitForSelector('table#dynamictable tr')
    //evaluating and extracting data from the dynamic HTML table
    const tableData=await page.evaluate(()=>{
        const rows=Array.from(document.querySelectorAll('table#dynamictable tr'))
        //use map function to iterate over each row
        return rows.map((row)=>{
            //for each row select all the cells(td element)
            const columns=Array.from(row.querySelectorAll('td'))
            //same here also using map to iterate each cell and extract its trimemd text content
            return columns.map((column)=>column.textContent?.trim())
           })
         })
         //creating a final table data stucture to assert
      //slice(1) excludes the first row of tabledata it is common to have first row headers in html table 
    const FinalTableData=tableData.slice(1).map(([name, age, gender])=>({name,age:parseInt(age),gender}))
    console.log("expected data",FinalTableData)
    //specifying the json testdata path
    const jsonpathfile="C:/Users/dhanalakshmi.bandla/Documents/PlaywrightCawStudiosAssignement/testdata/InputTextBox.json"
    //parsing the json data from specified file
    //parse a json string and strores in javascript object
    const jsondata = JSON.parse(fs.readFileSync(jsonpathfile,'utf-8'))
   console.log("actual data",jsondata)
    //asserting dynamic webtable data and json test data 
    expect(FinalTableData).toEqual(jsondata)
   
})