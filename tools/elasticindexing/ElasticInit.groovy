/**
 * Created by Theodor on 2015-10-28.
 */


static String initData ="""{
    "mappings": {
        "dataQuality": {
            "properties": {
                "qualityViolations.label": {
                    "type": "string",
                    "index": "not_analyzed"
                },
                 "qualityViolations.severity": {
                    "type": "integer"
                }

            }
        },
        "bibliometrician": {
            "properties": {
                "publicationStatus": {
                    "type": "string",
                    "index": "not_analyzed"
                }
            }
        }
    }
}"""