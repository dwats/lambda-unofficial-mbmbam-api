const { getChannelObj } = require('../utils/episodes')

module.exports = function handleGetLatestEpisode (cache) {
  if (!cache) return { message: 'cache error' }
  const channel = getChannelObj(cache)
  channel.episodes = [channel.episodes.pop()]
  return channel
}
