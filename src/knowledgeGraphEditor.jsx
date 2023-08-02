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
            console.log("OnChange Event!")
            nextProps.onChange(nextState.knowledgeGraph);
        }
    }

    countItemsWithObjectId = (objectId) => {
        const knowledgeGraph = this.state.knowledgeGraph;
        let count = 0;
        for (const item of knowledgeGraph) {
            if (item.objectId == objectId) {
              count++;
            }
        }
        return count;
    }
  
    rootSetter = (graph) => {
      let newGraph = [];
      for (const item of graph) {
        if (!item.uniqueId) {
          console.log("Generate new Unique ID!");
          let uniqueId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          let countId = this.countItemsWithObjectId(item.objectId) + 1;
          console.log(countId);
          let newItem = Object.assign({}, item);
          newItem.id = uniqueId;
          newItem.uniqueId = uniqueId;
          if (countId > 1) {
            if (newItem.title) {
              newItem.title = newItem.title + " " + '#'+countId+'';
            } else {
              newItem.name = newItem.name + " " + '#'+countId+'';
            }
          }

          newGraph.push(newItem);
        } else {
          newGraph.push(item);
        }
      }
      this.setState({ knowledgeGraph: newGraph });
      //console.log("RootSetter", graph);
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
  
    altPathSetter = (alternatives, id) => {
      //console.log("AltPathSetter OID", objectId)
      //console.log("AltPathSetter Alts", alternatives);
      var newKnowledgeGraph = this.state.knowledgeGraph;
      for (var i = 0; i < newKnowledgeGraph.length; i++) {
        if (newKnowledgeGraph[i].id == id) {
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