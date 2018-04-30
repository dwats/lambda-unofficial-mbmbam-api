
/**
 * Get `page` from `episodes` array with a length set by `perPage` global const.
 * @param {Array} episodes
 * @param {Number} page
 * @param {Number} perPage
 * @return {Array}
 */
function getPaginatedEpisodes (episodes, page = 1, perPage = 10) {
  if (page === null) page = 1
  if (!Array.isArray(episodes)) throw new TypeError('episodes must be an array')
  if (page < 1) return []

  const lastPage = Math.ceil(episodes.length / perPage)
  if (page > lastPage) return []

  const start = (perPage * page) - perPage
  const end = start + perPage

  return episodes.slice(start, end)
}

/**
 * Search episodes array and return episodes where titles include search term
 * @param {String} search - Search term
 * @param {Array} episodes - Array of episodes to search witin
 * @return {Array} Episodes that matched search term
 */
function getEpisodesBySearch (search, episodes) {
  if (!search || !episodes) return []
  const lowerSearch = search.toLowerCase()
  return episodes.filter((episode) => {
    const title = episode.title.toLowerCase()
    return title.indexOf(lowerSearch) > -1
  })
}

/**
 * Find episode at specific index and return
 *
 * While this technically finds the correct episode number, it may not match up with
 * the episode number in the title. For a more episode title accurate search use
 * the `search` query.
 * @param {Number} search
 * @param {Array} episodes
 * @return {Array}
 */
function getEpisodesByIndex (search, episodes) {
  const numSearch = Number(search)
  if (episodes.length < numSearch || numSearch < 0 || (numSearch !== 0 && !numSearch) || !episodes) return []
  return [episodes[numSearch]]
}

/**
 * Get simplified episode object
 * @param {Object} episode
 * @return {Object}
 */
function getEpisodeObj (episode) {
  if (!episode.title || !episode.description || !episode['itunes:duration'] || !episode.enclosure) {
    return {
      title: undefined,
      description: undefined,
      duration: undefined,
      url: undefined
    }
  }
  return {
    title: episode.title.text,
    description: episode.description.cdata,
    duration: episode['itunes:duration'].text,
    url: episode.enclosure.attributes.url
  }
}

/**
 * Parse raw rss object and return a simplified channel object
 *
 * @param {Object} rssObj
 * @return {Object}
 */
function getChannelObj (rssObj) {
  if (!rssObj || !rssObj.rss || !rssObj.rss.channel || !rssObj.rss.channel.item) {
    return {
      icon: undefined,
      channel: undefined,
      episodes: []
    }
  }
  const channel = rssObj.rss.channel.title
  const icon = rssObj.rss.channel.image.url.text
  const episodes = rssObj.rss.channel.item

  return {
    icon,
    channel: channel.text,
    episodes: episodes.map(getEpisodeObj)
  }
}

module.exports = {
  getEpisodeObj,
  getEpisodesByIndex,
  getEpisodesBySearch,
  getPaginatedEpisodes,
  getChannelObj
}
