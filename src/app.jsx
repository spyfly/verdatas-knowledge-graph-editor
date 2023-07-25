import { ReactSortable } from "react-sortablejs";
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import './app.css'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { KnowledgeGraphEditor } from './knowledgeGraphEditor';
import { Component } from 'preact';
import { KnowledgeGraphParser } from "./knowledgeGraphParser";
import { KnowledgeGraphObject } from "./knowledgeGraphObject";

export class App extends Component {
  constructor() {
    super();
    this.state = { knowledgeGraph: [] };
    this.pendingUploadGraph = [];
    this.knowledgeGraph = [];
    this.initKnowledgeGraph = [];

    this.initialList = [{
      title: "Test1",
      objectId: "test1"
    },
    {
      title: "Test2",
      objectId: "test2"
    },
    {
      title: "Test3",
      objectId: "test3"
    },
    {
      title: "Test4",
      objectId: "test4"
    },
    {
      title: "Test5",
      objectId: "test5"
    }];

    this.initItemList();
  }

  async initItemList() {
    const knowledgeGraphXmlReq = await fetch('./raw-knowledge-graph.xml');
    const knowledgeGraphXml = await knowledgeGraphXmlReq.text();
    const kgParser = new KnowledgeGraphParser(knowledgeGraphXml);
    const topicObjects = kgParser.extractTopicObjects();
    console.log(topicObjects)
    this.initialList = topicObjects;
    this.forceUpdate();
  }

  onChange = (newKnowledgeGraph) => {
    this.knowledgeGraph = newKnowledgeGraph;
  }

  exportJson = () => {
    // Convert JSON object to a string
    const jsonString = JSON.stringify(this.knowledgeGraph, null, 2);

    // Create a Blob with the JSON data
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Generate a unique filename for the export
    const filename = 'data.json';

    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;

    // Programmatically trigger a click on the anchor element to initiate download
    anchor.click();

    // Clean up by revoking the object URL after a short delay
    setTimeout(function () {
        URL.revokeObjectURL(anchor.href);
    }, 100);
  }

  uploadJson = (event) => {
    const file = event.target.files[0];
    const self = this;

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = function (readerEvent) {
      console.log("File loaded")
      try {
        const jsonData = JSON.parse(readerEvent.target.result);
        self.pendingUploadGraph = jsonData;
        console.log(jsonData);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };

    reader.readAsText(file);
  }

  importJson = () => {
    console.log(this.pendingUploadGraph)
    this.initKnowledgeGraph = this.pendingUploadGraph;
    this.forceUpdate();
  }

  render () {return (
    <>
      <Container>
        <Row className='pb-3'>
          <Col>
            <h1>verdatas preact knowledge graph editor</h1>
          </Col>
        </Row>
        <Row className="pb-3">
          <Col>
            <InputGroup class controlId="formFile">
              <Form.Control onChange={this.uploadJson} title="Import JSON" type="file" />
              <Button onClick={this.importJson}>Import JSON</Button>
            </InputGroup>
          </Col>
          <Col>
            <Button className='float-end' variant="success" onClick={this.exportJson}>Export JSON</Button>
          </Col>
        </Row>
        <Row>
          <Col lg={4} >
            <h2>Knowledge Graph Objects</h2>
            <ListGroup>
              <ReactSortable
                // here they are!
                list={this.initialList}
                setList={() => { }}
                group="knowledgePathEditor"
                animation={200}
                delayOnTouchStart={true}
                delay={2}
              >
                {this.initialList.map((item) => (
                  <KnowledgeGraphObject item={item} />
                ))}
              </ReactSortable>
            </ListGroup>
          </Col>
          <Col lg={8}>
            <h2>Learning Path</h2>
            <KnowledgeGraphEditor knowledgeGraph={this.initKnowledgeGraph} onChange={this.onChange} />
          </Col>
        </Row>
      </Container>
    </>
  )}
}