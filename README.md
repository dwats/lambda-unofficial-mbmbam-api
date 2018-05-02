[![Build Status](https://travis-ci.org/dwats/lambda-unofficial-mbmbam-api.svg?branch=master)](https://travis-ci.org/dwats/lambda-unofficial-mbmbam-api)
[![Coverage Status](https://coveralls.io/repos/github/dwats/lambda-unofficial-mbmbam-api/badge.svg?branch=master)](https://coveralls.io/github/dwats/lambda-unofficial-mbmbam-api?branch=master)

# Purpose
todo

# Setup
todo

# Usage
todo

# API Spec

### /dev/episodes
---
##### ***GET***
**Summary:** Podcast channel information and paginated episodes array

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| search | query | Search episode titles for matches via `String.prototype.indexOf()` | No | string |
| page | query | Set current page in paginated results | No | integer |
| number | query | Go to specific index in episodes array. Does not align 1-to-1 with episode numbers | No | integer |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | ok | [/dev/episodes 200 response](#episodes_200_response) |

### /dev/episodes/latest
---
##### ***GET***
**Summary:** Podcast channel and latest episode information

**Parameters**

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

**Responses**

| Code | Description | Schema |
| ---- | ----------- | ------ |
| 200 | ok | [/dev/episodes/latest 200 response](#episodes_latest_200_response) |

### Models
---

### episodes_200_response

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| icon | string | Podcast icon | No |
| channel | string | Podcast channel name | No |
| episodes | [ [episode array item](#episode_array_item) ] | paginated list of episodes | No |
| page | integer | current page | No |
| pages | integer | total page count | No |
| searchTerm | string | term used with `?search=` or `?number=` parameters | No |

### episodes_latest_200_response

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| icon | string | Podcast icon | No |
| channel | string | Podcast channel name | No |
| episodes | [ [episode array item](#episode_array_item) ] | paginated list of episodes | No |

### episode_array_item

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| title | string | episode title | No |
| description | string | episode description | No |
| duration | string | episode duration | No |
| url | string | episode url | No |
