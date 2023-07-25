import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

export class KnowledgeGraphParser {
    constructor(knowledgeGraphXml) {
        //console.log(knowledgeGraphXml);
        this.knowledgeGraph = this.parseXml(knowledgeGraphXml)
        //console.log(this.knowledgeGraph)
    }

    parseXml(rawXml) {
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "@_",
            attributesGroupName: "@_",
        };
        const parser = new XMLParser(options);
        let knowledgeGraph = parser.parse(rawXml);
        return knowledgeGraph
    }

    extractTopicObjects(topicRoot = null, type = "verDatAs:topic") {
        let topicObjects = [];
        if (topicRoot == null) {
            topicRoot = this.knowledgeGraph["verDatAs:definitions"]["verDatAs:knowledgeGraph"]["verDatAs:topic"];
        }
        for (const item in topicRoot) {
            //console.log(item);
            if (topicRoot[item].length) {
                for (const subItem in topicRoot[item]) {
                    console.log("SubItem:", subItem);
                    const newTopicObjects = this.extractTopicObjects(topicRoot[item][subItem], item)
                    topicObjects = newTopicObjects.concat(topicObjects)
                }
            } else {
                let subRoot = topicRoot[item];
                if (subRoot["@_"]) {
                    subRoot = subRoot["@_"];
                }
                if (item !== "@_") {
                    type = item;
                }
                console.log("Item", type, subRoot)
                subRoot["type"] = type.replace("verDatAs:", "");
                topicObjects.push(this.transformObject(subRoot));
            }
        }
        return topicObjects;
    }

    transformObject(object) {
        for (const [key, value] of Object.entries(object)) {
            if (key.startsWith("@_")) {
                object[key.replace("@_", "")] = value;
                delete object[key];
            }
        }
        return object;
    }
}