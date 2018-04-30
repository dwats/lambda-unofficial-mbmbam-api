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
| 200 | ok | [inline_response_200](#inline_response_200) |

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
| 200 | ok | [inline_response_200_1](#inline_response_200_1) |

### Models
---

### inline_response_200_episodes

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| title | string | episode title | No |
| description | string | episode description | No |
| duration | string | episode duration | No |
| url | string | episode url | No |

### inline_response_200_1

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| icon | string | Podcast icon | No |
| channel | string | Podcast channel name | No |
| episodes | [ [inline_response_200_episodes](#inline_response_200_episodes) ] | paginated list of episodes | No |

### inline_response_200

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| icon | string | Podcast icon | No |
| channel | string | Podcast channel name | No |
| episodes | [ [inline_response_200_episodes](#inline_response_200_episodes) ] | paginated list of episodes | No |
| page | integer | current page | No |
| pages | integer | total page count | No |
| searchTerm | string | term used with `?search=` or `?number=` parameters | No |
