const data = require('./instapostsImport.json') //with path
const https = require('https')
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const slugify = require('@sindresorhus/slugify');

module.exports = async () => {
  try {
    return prepareData(data)

  } catch (error) {
    console.error(error)
  }
}

const prepareData = (dataJSON) => {
  const dataArray = []
  dataJSON.forEach(data => {
    const cLength = data.caption.length
    let displayImageUrl
    if (data.displayUrl) {
      displayImageUrl = scrapeInstaImage(data.displayUrl)
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
        detailLink: (data.type.toLowerCase() === 'sidecar')
      })
    }
  })
  return dataArray.sort((a, b) => b.unixTimeStamp - a.unixTimeStamp)
}

const scrapeInstaImage = (imageUrl) => {
  const imgDir = 'src/imported/'
  if (!fs.existsSync(imgDir)) {
    fs.mkdirSync(imgDir, { recursive: true })
  }
  const imgHash = generateSHA256Hash(imageUrl)
  const outputPath = `${imgDir}${imgHash}.jpg`
  let imgLoaded = false
  if (!fileExists(outputPath)) {
    const file = fs.createWriteStream(outputPath)

    https.get(imageUrl, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        imgLoaded = true
        console.log('Image downloaded successfully.')
      })
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {
        console.error('Error downloading image:', err)
      })
    })
  } else {
    imgLoaded = true
  }
  return (imgLoaded) ? outputPath : ''
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
  caption = caption.replace(/(#[\wäöüß]+)/g, '<span class="hashtag">$1</span>')
  return caption
}

const makeSlug = (caption, id) => {
  let formatCaption = (caption.length > 0)?caption.slice(0,25) + '-' + id:id
  formatCaption = slugify(formatCaption)
  return formatCaption
}