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
import { KnowledgeGraphTree } from "./knowledgeGraphTree";
import { ButtonGroup, FormText } from "react-bootstrap";
import { KnowledgeGraphRequirements } from "./knowledgeGraphRequirements";
import { Trash } from "react-bootstrap-icons";

export class App extends Component {
  constructor() {
    super();
    this.state = { knowledgeGraph: [], collapsed: false, requirementsList: [] };
    this.pendingUploadGraph = null;
    this.knowledgeGraph = [];
    this.initKnowledgeGraph = [];
    this.initialList = [];
    //this.initItemList();
  }

  async initItemList(rawXml = null) {
    /*if (rawXml == null) {
      const knowledgeGraphXmlReq = await fetch('./raw-knowledge-graph.xml');
      rawXml = await knowledgeGraphXmlReq.text();
    }*/
    const kgParser = new KnowledgeGraphParser(rawXml);
    const topicObjects = kgParser.extractTopicObjects();
    console.log(topicObjects)
    this.initialList = topicObjects;
    this.forceUpdate();
  }

  onChange = (newKnowledgeGraph) => {
    if (newKnowledgeGraph != this.knowledgeGraph) {
      this.knowledgeGraph = newKnowledgeGraph;

      const requirementsList = this.getRequirementsList();
      console.log("Change detected!", requirementsList);
      this.setState({ requirementsList: requirementsList });
    }
  }

  getRequirementsList = () => {
    const knowledgeGraph = this.knowledgeGraph;
    let requirementsList = [];
    for (const item of knowledgeGraph) {
      requirementsList.push(item);
      for (const altElement of item.alternatives ?? []) {
        requirementsList.push(altElement);
      }
    }
    return requirementsList;
  }

  toggleCollapse = () => {
    this.setState({ collapsed: !this.state.collapsed });
    this.updateCollapsed(null, null, !this.state.collapsed);
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
        self.initItemList(readerEvent.target.result);
      }
    };

    reader.readAsText(file);
  }

  importJson = () => {
    console.log(this.pendingUploadGraph)
    if (this.pendingUploadGraph !== null) {
      this.initKnowledgeGraph = this.pendingUploadGraph;
      this.forceUpdate();
    } else {
      alert("Please select a file for import first!")
    }
  }

  updateCollapsed = (objectId, knowledgeGraphTree = null, force = null) => {
    console.log("updateCollapsed", objectId);
    let rootElement = false;
    if (knowledgeGraphTree == null) {
      knowledgeGraphTree = this.initialList;
      rootElement = true;
    }

    if (knowledgeGraphTree.objectId === objectId) {
      const oldCollapsed = knowledgeGraphTree.collapsed ?? false;
      console.log("oldCollapsed", oldCollapsed)
      knowledgeGraphTree.collapsed = !oldCollapsed;
    }

    if (force !== null) {
      knowledgeGraphTree.collapsed = force;
    }

    if (knowledgeGraphTree.childObjects) {
      let children = []
      for (const childObject of knowledgeGraphTree.childObjects) {
        const child = this.updateCollapsed(objectId, childObject, force);
        children.push(child);
      }
      knowledgeGraphTree.childObjects = children;
    }

    if (rootElement) {
      this.initialList = knowledgeGraphTree;
      this.forceUpdate();
    }
    return knowledgeGraphTree;
  }

  searchRequirements = (searchString) => {
    const requirementsList = this.state.requirementsList;
    for (const requirement of requirementsList) {
      const searchTarget = requirement.type + ' : ' + (requirement.title ?? requirement.name) + ' : ' + requirement.objectId;
      if (searchTarget.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())) {
        requirement.show = true;
      } else {
        requirement.show = false;
      }
    }
    this.setState({ requirementsList: requirementsList });
  }

  search = (searchString, knowledgeGraphTree = null) => {
    console.log("search", searchString);
    let rootElement = false;
    if (knowledgeGraphTree == null) {
      knowledgeGraphTree = this.initialList;
      rootElement = true;
    }

    const searchTarget = knowledgeGraphTree.type + ' : ' + (knowledgeGraphTree.title ?? knowledgeGraphTree.name) + ' : ' + knowledgeGraphTree.objectId;
    knowledgeGraphTree.collapsed = true;
    knowledgeGraphTree.show = false;
    if (searchTarget.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())) {
      knowledgeGraphTree.collapsed = false;
      knowledgeGraphTree.show = true;
    }


    if (knowledgeGraphTree.childObjects) {
      let children = []
      for (const childObject of knowledgeGraphTree.childObjects) {
        const child = this.search(searchString, childObject);
        children.push(child);
        if (!child.collapsed) {
          knowledgeGraphTree.collapsed = false;
        }
      }
      knowledgeGraphTree.childObjects = children;
    }

    if (rootElement) {
      this.initialList = knowledgeGraphTree;
      this.forceUpdate();
    }
    return knowledgeGraphTree;
  }

  render () {return (
    <>
      <Container fluid>
        <Row className='pb-3'>
          <Col>
            <h1>verdatas preact knowledge graph editor</h1>
          </Col>
        </Row>
        <Row className="pb-3">
          <Col>
            <InputGroup class controlId="formFile">
              <Form.Control onChange={this.uploadJson} title="Import JSON/XML" type="file" />
              <Button onClick={this.importJson}>Import JSON/XML</Button>
            </InputGroup>
          </Col>
          <Col>
            <Button className='float-end' variant="success" onClick={this.exportJson}>Export JSON</Button>
          </Col>
        </Row>
        <Row>
          <Col lg={4} >
            <h2>Learning Objects</h2>
            <InputGroup>
              <Button onClick={this.toggleCollapse} variant="primary">{this.state.collapsed ? 'Show' : 'Collapse'} all</Button>
              <Form.Control onChange={(input) => this.search(input.target.value)} placeholder="Search by type, name or objectId ..."></Form.Control>
            </InputGroup>
            <div className="overflow-scroll" style={{maxHeight: '75vh'}}>
            {this.initialList.length === 0 ? 
            <div className="p-3 mt-3 bg-danger bg-opacity-50">
            <h5>Please upload the knowledgeGraph XML File first</h5> 
            <p>The knowledge graph elements will appear here.</p>
            <p>Use the file picker above to select the knowledgeGraph XML file!</p>
            <p>Alternatively, <Button variant="link" onClick={
              async () =>{
                const knowledgeGraphXmlReq = await fetch('./raw-knowledge-graph.xml');
                const rawXml = await knowledgeGraphXmlReq.text();
                this.initItemList(rawXml);
              }
            }>use example XML</Button></p>
            </div>
            : 
            <KnowledgeGraphTree knowledgeGraphTree={this.initialList} updateCollapsed={this.updateCollapsed}/>}
            </div>
          </Col>
          <Col lg={3}>
            <h2>Requirements</h2>
            <Form.Control onChange={(input) => this.searchRequirements(input.target.value)} placeholder="Search by type, name or objectId ..."></Form.Control>
            <div className="overflow-scroll" style={{maxHeight: '75vh'}}>
              <KnowledgeGraphRequirements requirementsList={this.state.requirementsList}/>
            </div>
          </Col>
          <Col lg={5}>
            <h2>Learning Path</h2>
            <ReactSortable list={[]} setList={() => {}} group={{
              put: ['knowledgePathEditor', 'knowledgePathRequirements'],
            }} style="height: 38px;" className="w-100"
          >
              <div class="p-2 bg-secondary bg-opacity-50"><Trash></Trash> Papierkorb</div>
            </ReactSortable>
            <KnowledgeGraphEditor knowledgeGraph={this.initKnowledgeGraph} onChange={this.onChange} />
          </Col>
        </Row>
      </Container>
    </>
  )}
}
