// export default  {
//     "$schema": "http://json-schema.org/draft-07/schema#",
//     "$ref": "#/definitions/MyBrowserContextOptions",
//     "definitions": {
//         "MyBrowserContextOptions": {
//             "$ref": "#/definitions/BrowserContextOptions"
//         },
//         "BrowserContextOptions": {
//             "type": "object",
//             "properties": {
//                 "acceptDownloads": {
//                     "type": "boolean"
//                 },
//                 "ignoreHTTPSErrors": {
//                     "type": "boolean"
//                 },
//                 "bypassCSP": {
//                     "type": "boolean"
//                 },
//                 "viewport": {
//                     "anyOf": [
//                         {
//                             "type": "null"
//                         },
//                         {
//                             "$ref": "#/definitions/ViewportSize"
//                         }
//                     ]
//                 },
//                 "userAgent": {
//                     "type": "string"
//                 },
//                 "deviceScaleFactor": {
//                     "type": "number"
//                 },
//                 "isMobile": {
//                     "type": "boolean"
//                 },
//                 "hasTouch": {
//                     "type": "boolean"
//                 },
//                 "javaScriptEnabled": {
//                     "type": "boolean"
//                 },
//                 "timezoneId": {
//                     "type": "string"
//                 },
//                 "geolocation": {
//                     "$ref": "#/definitions/Geolocation"
//                 },
//                 "locale": {
//                     "type": "string"
//                 },
//                 "permissions": {
//                     "type": "array",
//                     "items": {
//                         "type": "string"
//                     }
//                 },
//                 "extraHTTPHeaders": {
//                     "type": "object",
//                     "additionalProperties": {
//                         "type": "string"
//                     }
//                 },
//                 "offline": {
//                     "type": "boolean"
//                 },
//                 "httpCredentials": {
//                     "$ref": "#/definitions/HTTPCredentials"
//                 },
//                 "colorScheme": {
//                     "type": "string",
//                     "enum": [
//                         "dark",
//                         "light",
//                         "no-preference"
//                     ]
//                 },
//                 "logger": {
//                     "$ref": "#/definitions/Logger"
//                 }
//             },
//             "additionalProperties": false
//         },
//         "ViewportSize": {
//             "type": "object",
//             "properties": {
//                 "width": {
//                     "type": "number"
//                 },
//                 "height": {
//                     "type": "number"
//                 }
//             },
//             "required": [
//                 "width",
//                 "height"
//             ],
//             "additionalProperties": false
//         },
//         "Geolocation": {
//             "type": "object",
//             "properties": {
//                 "latitude": {
//                     "type": "number"
//                 },
//                 "longitude": {
//                     "type": "number"
//                 },
//                 "accuracy": {
//                     "type": "number"
//                 }
//             },
//             "required": [
//                 "latitude",
//                 "longitude"
//             ],
//             "additionalProperties": false
//         },
//         "HTTPCredentials": {
//             "type": "object",
//             "properties": {
//                 "username": {
//                     "type": "string"
//                 },
//                 "password": {
//                     "type": "string"
//                 }
//             },
//             "required": [
//                 "username",
//                 "password"
//             ],
//             "additionalProperties": false
//         },
//         "Logger": {
//             "type": "object",
//             "additionalProperties": false
//         }
//     }
// }
