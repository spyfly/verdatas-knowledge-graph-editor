import { ReactSortable } from "react-sortablejs";
import ListGroup from 'react-bootstrap/ListGroup';
import { ListCheck, SignTurnRight } from 'react-bootstrap-icons';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Component } from 'preact';
import { KnowledgeGraphObject } from "./knowledgeGraphObject";

export class KnowledgeGraphEditor extends Component {
  constructor(props) {
    super();
    console.log(props)
    this.state = { knowledgeGraph: props.knowledgeGraph };
    this.initKnowledgeGraph = props.knowledgeGraph;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.knowledgeGraph !== this.initKnowledgeGraph) {
      this.initKnowledgeGraph = nextProps.knowledgeGraph;
      console.log("KnowledgeGraph Props Changed!")
      this.setState({ knowledgeGraph: nextProps.knowledgeGraph });
    } else {
      console.log("OnChange Event!", nextState.knowledgeGraph)
      nextProps.onChange(nextState.knowledgeGraph);
    }
  }

  countItemsWithObjectId = (objectId) => {
    const knowledgeGraph = this.state.knowledgeGraph;
    let countIds = [];
    for (const item of knowledgeGraph) {
      if (item.objectId == objectId) {
        countIds.push(item.countId);
      }

      for (const altElement of item.alternatives ?? []) {
        if (altElement.objectId == objectId) {
          countIds.push(altElement.countId);
        }
      }
    }
    
    if (countIds.length == 0) {
      return 0;
    } else {
      countIds.sort();
      console.log("Count IDs", countIds)
      for (var i = 0; i < countIds.length; i++) {
        if (countIds[i] + 1 === countIds[i + 1]) {
          continue;
        } else {
          return countIds[i];
        }
      }
    }
  }

  generateUniqueItemInstance = (item) => {
    console.log("Generate new Unique ID!");
    let uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let countId = this.countItemsWithObjectId(item.objectId) + 1;
    console.log(countId);
    let newItem = Object.assign({}, item);
    newItem.id = uniqueId;
    newItem.uniqueId = uniqueId;
    if (countId > 1) {
      if (newItem.title) {
        newItem.title = newItem.title + " " + '#' + countId + '';
      } else {
        newItem.name = newItem.name + " " + '#' + countId + '';
      }
    }
    newItem.countId = countId;
    return newItem;
  }

  rootSetter = (graph) => {
    for (var i = 0; i < graph.length; i++) {
      const item = graph[i];
      if (!item.uniqueId) {
        const newItem = this.generateUniqueItemInstance(item);
        graph[i] = newItem;
      }
    }
    this.setState({ knowledgeGraph: graph });
    console.log("RootSetter", graph);
  }

  requirementSetter = (requirements, id) => {
    //console.log("RequirementSetter OID", objectId)
    //console.log("RequirementSetter Reqs", requirements);
    var newKnowledgeGraph = this.state.knowledgeGraph;
    for (var i = 0; i < newKnowledgeGraph.length; i++) {
      if (newKnowledgeGraph[i].id == id) {
        newKnowledgeGraph[i].requirements = requirements;
      }
    }
    //console.log("New KG", newKnowledgeGraph)
    this.setState({ knowledgeGraph: newKnowledgeGraph });
  }

  altPathSetter = async (alternatives, id) => {
    if (alternatives.length == 0) {
      // Wait for 1ms to allow the rootSetter to run first
      await new Promise(r => setTimeout(r, 1));
    }
    console.log("AltPathSetter ID | Alts", id, alternatives, this.state.knowledgeGraph)
    var newKnowledgeGraph = this.state.knowledgeGraph;
    for (var i = 0; i < newKnowledgeGraph.length; i++) {
      if (newKnowledgeGraph[i].id == id) {
        for (var j = 0; j < alternatives.length; j++) {
          const item = alternatives[j];
          if (!item.uniqueId) {
            const newItem = this.generateUniqueItemInstance(item);
            alternatives[j] = newItem;
          }
        }
        newKnowledgeGraph[i].alternatives = alternatives;
      }
    }
    //console.log("New KG", newKnowledgeGraph)
    this.setState({ knowledgeGraph: newKnowledgeGraph });
  }

  render() {
    const knowledgeGraph = this.state.knowledgeGraph;
    const self = this;
    return <ListGroup className="h-100 w-100">
      <ReactSortable className="h-100 w-100"
        // here they are!
        list={knowledgeGraph}
        setList={self.rootSetter}
        group="knowledgePathEditor"
        animation={200}
        delayOnTouchStart={true}
        delay={2}
      >
        {knowledgeGraph.map((item) => (
          <KnowledgeGraphObject item={item}>
            <Row>
              <Col className="d-flex flex-row justify-content-between">
                <ListCheck title="Requirements" className="p-1" color="red" size={24} />
                <ListGroup title="Requirements" className="bg-danger-subtle h-100 w-100">
                  <ReactSortable className="h-100 w-100"
                    list={item.requirements ?? []}
                    setList={(requirementList) => {
                      self.requirementSetter(requirementList, item.id);
                    }}
                    group="knowledgePathRequirements">
                    {item.requirements && item.requirements.map((requirement) => (
                      <KnowledgeGraphObject variant="danger" item={requirement} />
                    ))}
                  </ReactSortable>
                </ListGroup>
              </Col>
              <Col className="d-flex flex-row justify-content-between">
                <SignTurnRight title="Alternative Path" className="p-1" color="green" size={24} />
                <ListGroup title="Alternative Path" className="bg-success-subtle h-100 w-100">
                  <ReactSortable className="h-100 w-100"
                    list={item.alternatives ?? []}
                    setList={(alternativePath) => {
                      self.altPathSetter(alternativePath, item.id);
                    }}
                    group="knowledgePathEditor">
                    {item.alternatives && item.alternatives.map((alternative) => (
                      <KnowledgeGraphObject variant="success" item={alternative} />
                    ))}
                  </ReactSortable>
                </ListGroup>
              </Col>
            </Row>
          </KnowledgeGraphObject>
        ))}
      </ReactSortable>
    </ListGroup>
  }
}