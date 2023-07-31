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
        let topicObject = null
        let childObjects = [];
        //let childObjects = [];
        if (topicRoot == null) {
            topicRoot = this.knowledgeGraph["verDatAs:definitions"]["verDatAs:knowledgeGraph"]["verDatAs:topic"];
        }
        for (const item in topicRoot) {
            //console.log(item);
            if (topicRoot[item].length) {
                for (const subItem in topicRoot[item]) {
                    //console.log("SubItem:", subItem);
                    const newTopicObjects = this.extractTopicObjects(topicRoot[item][subItem], item)
                    childObjects.push(newTopicObjects);
                }
            } else if (item === "@_") {
                let subRoot = topicRoot[item];
                if (subRoot["@_"]) {
                    subRoot = subRoot["@_"];
                }
                if (item !== "@_") {
                    //type = item;
                }
                //console.log("Item", type, subRoot)
                subRoot["type"] = type.replace("verDatAs:", "");
                if (topicObject === null) {
                    topicObject = this.transformObject(subRoot);
                } else {
                    console.log("More than one topicobject found!")
                }
            } else {
                let subRoot = topicRoot[item];
                if (subRoot["@_"]) {
                    subRoot = subRoot["@_"];
                }
                //console.log("Item", type, subRoot)
                subRoot["type"] = item.replace("verDatAs:", "");
                childObjects.push(this.transformObject(subRoot));
            }
        }
        if (childObjects.length > 0) {
            topicObject["childObjects"] = childObjects;
        }
        //console.log(topicObject)
        return topicObject;
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