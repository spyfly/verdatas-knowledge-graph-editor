import { ListGroup } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";
import { KnowledgeGraphObject } from "./knowledgeGraphObject";

export function KnowledgeGraphRequirements(props) {
    return <ListGroup className="h-100 w-100">
      <ReactSortable className="h-100 w-100"
        // here they are!
        list={props.requirementsList}
        setList={() => {}}
        group="knowledgePathRequirements"
        animation={200}
        delayOnTouchStart={true}
        delay={2}
      >
        {props.requirementsList.map((item) => (
          <KnowledgeGraphObject show={(item.show ?? true)} variant="danger" item={item}></KnowledgeGraphObject>
        ))}
      </ReactSortable>
    </ListGroup>
}