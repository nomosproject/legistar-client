const fs = require('fs')
const path = require('path')
const md5 = require('blueimp-md5')

function removeHash (url) {
  return url.replace(/#.*$/, '')
}

function filenameForUrl (url) {
  // console.warn(url, md5(url), md5(removeHash(url)))
  return md5(url)
}

function retrieveFromCache (cacheDir, url) {
  const filename = path.join(cacheDir, filenameForUrl(url))

  // const withoutHashFile = path.join(cacheDir, filenameForUrl(removeHash(url)))
  // if (!fs.existsSync(withoutHashFile)) {
  //   console.warn('base does not exist, creating file', withoutHashFile)
  //   fs.writeFileSync(withoutHashFile, fs.readFileSync(filename))
  // } else {
  //   console.warn('base exists', withoutHashFile)
  // }

  if (fs.existsSync(filename)) { // TODO: existsSync is deprecated
    const response = fs.readFileSync(filename, 'utf8')
    return response
  } else {
    return false
  }
}

function addToCache (cacheDir, url, response) {
  const filename = path.join(cacheDir, filenameForUrl(url))
  return fs.writeFileSync(filename, response)
}

function clearFilesystemCache ({ directory }) {
  if (fs.existsSync(directory)) { // TODO: existsSync is deprecated
    fs.readdirSync(directory).forEach(file => {
      const filename = `${directory}/${file}`
      fs.unlinkSync(filename)
    })
  }
}

function useFilesystemCache ({ directory }) {
  if (!fs.existsSync(directory)) { fs.mkdirSync(directory) }

  return async (ctx, next) => {
    const cachedCopy = retrieveFromCache(directory, ctx.url)
    if (cachedCopy) {
      ctx.cached = true
      ctx.response = cachedCopy
    } else {
      ctx.cached = false
      ctx = await next(ctx)
      addToCache(directory, ctx.url, ctx.response)
    }

    return ctx
  }
}

module.exports = { useFilesystemCache, clearFilesystemCache }
