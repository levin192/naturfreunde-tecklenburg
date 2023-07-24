require('dotenv').config()

// ToDo: Remove Images if they expired or check img hash if theyre the same?

const https = require('https')
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const util = require('util')
const slugify = require('@sindresorhus/slugify')
const { ApifyClient } = require('apify-client')

const cacheDir = 'src/json-cache/'

module.exports = async () => {

  const data = await getScrapedData()
  try {
    return await prepareData(data)
  } catch (error) {
    console.error(error)
  }
}

const prepareData = async (dataJSON) => {
  const dataArray = []
  for (const data of dataJSON) {
    const cLength = data.caption.length
    let displayImageUrl
    let imagesUrls
    if (data.displayUrl) {
      const result = await scrapeInstaImage(data.displayUrl, data.images)
      // Deconstruct instead
      displayImageUrl = result.displayImage
      imagesUrls = result.images.map(img=> path.relative('src/aktuelles/aktuelles', img))
    }
    if (cLength > 0 && displayImageUrl.length > 0) {
      const {
        unixTimeStamp: unixTimeStamp,
        germanDate: dateString,
      } = formatDate(data.timestamp)
      dataArray.push({
        unixTimeStamp,
        dateString,
        location: (Object.hasOwn(data, 'locationName'))
          ? data.locationName
          : '',
        type: data.type,
        caption: formatCaption(data.caption),
        displayImage: path.relative('src/aktuelles', displayImageUrl),
        slug: makeSlug(data.caption, data.id),
        detailLink: (imagesUrls.length > 0),
        images: imagesUrls
      })
    }
  }
  return dataArray.sort((a, b) => b.unixTimeStamp - a.unixTimeStamp)
}

const scrapeInstaImage = async (imageUrl, imagesArray) => {
  const imgDir = 'src/imported/'
  const images = []
  const imgHash = generateSHA256Hash(imageUrl)
  const outputPath = `${imgDir}${imgHash}.jpg`
  let imgLoaded = false
  checkDir(imgDir)
  if (!fileExists(outputPath)) {
    try {
      await downloadImage(imageUrl, outputPath)
      imgLoaded = true
    } catch (err) {
      console.error('Error downloading image:', imgHash, err)
    }
  } else {
    imgLoaded = true
  }
  imagesArray = imagesArray.filter(img => img !== imageUrl)
  if (imagesArray.length > 0) {
    const subDir = `${imgDir}/${imgHash}/`
    checkDir(subDir)
    for (const subImg of imagesArray) {
      const subHash = generateSHA256Hash(subImg)
      const subOutputPath = `${subDir}${subHash}.jpg`
      let success = false
      if (!fileExists(subOutputPath)) {
        try {
          await downloadImage(subImg, subOutputPath)
          success = true
        } catch (err) {
          console.error('Error downloading image:', subHash, err)
        }
      } else {
        success = true
      }
      if (success) {
        images.push(subOutputPath)
      }
    }
  }
  return (imgLoaded) ? {
    displayImage: outputPath,
    images,
  } : {
    displayImage: '',
    images: [],
  }
}

const generateSHA256Hash = (input) => {
  const hash = crypto.createHash('sha256')
  hash.update(input)
  return hash.digest('hex')
}

const fileExists = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK)
    return true // File exists
  } catch (err) {
    return false // File doesn't exist
  }
}

const formatDate = (dateString) => {
  const dateObj = new Date(dateString)
  const unixTimeStamp = dateObj.getTime() / 1000
  const germanDate = dateObj.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  return {
    unixTimeStamp,
    germanDate,
  }
}

const formatCaption = (caption) => {
  caption = caption.replace(/(# +)/g, '#')
  caption = caption.replace(/(#[\wäöüß]+)/g, '<span class="hashtag">$1</span>')
  return caption
}

const makeSlug = (caption, id) => {
  let formatCaption = (caption.length > 0)
    ? caption.slice(0, 25) + '-' + id
    : id
  formatCaption = slugify(formatCaption)
  return formatCaption
}

const checkDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const downloadImage = util.promisify((imageUrl, outputPath, callback) => {
  const file = fs.createWriteStream(outputPath)
  https.get(imageUrl, (response) => {
    response.pipe(file)
    file.on('finish', () => {
      file.close()
      callback()
    })
  }).on('error', (err) => {
    fs.unlink(outputPath, () => {
      console.error('Error downloading image:', err)
      callback(err)
    })
  })
})

async function getScrapedData () {
  console.info('Getting scraped data')
  let data = []
  const dataInCache = await getDataFromCache()
  const cachedDataFile = 'instaposts.json'
  const cachedDataFilePath = cacheDir + cachedDataFile
  if (!dataInCache) {
    console.info('No scraped data found, running Apify Actor')
    // Initialize the ApifyClient with API token
    const client = new ApifyClient({
      token: process.env.APIFY_TOKEN,
    })

// Prepare Actor input
    const input = {
      'username': [
        'naturfreunde.tecklenburg'],
      'resultsLimit': 999,
    }

    await (async () => {
      // Run the Actor and wait for it to finish
      const run = await client.actor('apify~instagram-post-scraper').call(input)
      // Fetch actor results from the run's dataset (if any)
      const { items } = await client.dataset(run.defaultDatasetId).listItems()
      items.forEach((item) => {
        data.push(item)
      })
      await writeFileAsync(cachedDataFilePath, JSON.stringify(data))
    })()
  } else {
    console.info('Scraped data found, loading from local JSON file')
    data = await loadDataFromJSON(cachedDataFilePath)
  }
  return data
}

const getDataFromCache = async () => {
  const timeCacheFile = 'timestamp.json'
  const timeCacheFilePath = cacheDir + timeCacheFile
  const timeStampNow = Math.floor(Date.now() / 1000)
  checkDir(cacheDir)
  if (!fileExists(timeCacheFilePath)) {
    const timeStampJSON = JSON.stringify(timeStampNow)
    await writeFileAsync(timeCacheFilePath, timeStampJSON)
    return false
  } else {
    const threeDaysInSeconds = 3 * 24 * Math.pow(60, 2)
    const cachedTimeStampJSON = await loadDataFromJSON(timeCacheFilePath)
    const cachedTimeStamp = parseInt(cachedTimeStampJSON)
    // Returns TRUE if timestamp is not older than 3 days
    return (timeStampNow - cachedTimeStamp) <= threeDaysInSeconds
  }
}

const writeFileAsync = (filePath, data) => {
  console.info('Writing data to: ', filePath)
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function loadDataFromJSON (path) {
  try {
    const data = await fs.promises.readFile(path, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    console.error('An error occurred while reading the file:', err)
    throw err
  }
}