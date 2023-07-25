import { ReactSortable } from "react-sortablejs";
import ListGroup from 'react-bootstrap/ListGroup';
import { ListCheck, SignTurnRight } from 'react-bootstrap-icons';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Component } from 'preact';

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
  
    rootSetter = (graph) => {
      this.setState({ knowledgeGraph: graph });
      //console.log("RootSetter", graph);
    }
  
    requirementSetter = (requirements, objectId) => {
      //console.log("RequirementSetter OID", objectId)
      //console.log("RequirementSetter Reqs", requirements);
      var newKnowledgeGraph = this.state.knowledgeGraph;
      for (var i = 0; i < newKnowledgeGraph.length; i++) {
        if (newKnowledgeGraph[i].objectId == objectId) {
          newKnowledgeGraph[i].requirements = requirements;
        }
      }
      //console.log("New KG", newKnowledgeGraph)
      this.setState({ knowledgeGraph: newKnowledgeGraph });
    }
  
    altPathSetter = (alternatives, objectId) => {
      //console.log("AltPathSetter OID", objectId)
      //console.log("AltPathSetter Alts", alternatives);
      var newKnowledgeGraph = this.state.knowledgeGraph;
      for (var i = 0; i < newKnowledgeGraph.length; i++) {
        if (newKnowledgeGraph[i].objectId == objectId) {
          newKnowledgeGraph[i].alternatives = alternatives;
        }
      }
      //console.log("New KG", newKnowledgeGraph)
      this.setState({ knowledgeGraph: newKnowledgeGraph });
    }
  
    render() {
      const knowledgeGraph = this.state.knowledgeGraph;
      const self = this;
      return <ListGroup>
        <ReactSortable
          // here they are!
          list={knowledgeGraph}
          setList={self.rootSetter}
          group="knowledgePathEditor"
          animation={200}
          delayOnTouchStart={true}
          delay={2}
        >
          {knowledgeGraph.map((item) => (
            <ListGroup.Item key={item.objectId}>{item.title}
              <Row>
                <Col className="d-flex flex-row justify-content-between">
                  <ListCheck title="Requirements" className="p-1" color="red" size={24} />
                  <ListGroup title="Requirements" className="bg-danger-subtle h-100 w-100">
                    <ReactSortable className="h-100 w-100"
                      list={item.requirements ?? []}
                      setList={(requirementList) => {
                        self.requirementSetter(requirementList, item.objectId);
                      }}
                      group="knowledgePathEditor">
                      {item.requirements && item.requirements.map((requirement) => (
                        <ListGroup.Item variant="danger" key={requirement.objectId}>{requirement.title}</ListGroup.Item>
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
                        self.altPathSetter(alternativePath, item.objectId);
                      }}
                      group="knowledgePathEditor">
                      {item.alternatives && item.alternatives.map((alternative) => (
                        <ListGroup.Item variant="success" key={alternative.objectId}>{alternative.title}</ListGroup.Item>
                      ))}
                    </ReactSortable>
                  </ListGroup>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ReactSortable>
      </ListGroup>
    }
  }