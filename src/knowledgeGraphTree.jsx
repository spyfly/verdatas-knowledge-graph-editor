import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import AccordionHeader from 'react-bootstrap/esm/AccordionHeader';
import Badge from 'react-bootstrap/Badge';
import { KnowledgeGraphObject } from './knowledgeGraphObject';
import { ReactSortable } from "react-sortablejs";

export function KnowledgeGraphTree(props) {
    const knowledgeGraphTree = props.knowledgeGraphTree;
    let collapsed = knowledgeGraphTree.collapsed ?? false;
    console.log("Collapsed",collapsed);
    console.log(knowledgeGraphTree.childObjects)
    return knowledgeGraphTree.childObjects ? <Accordion activeKey={collapsed ? [] : [knowledgeGraphTree.objectId]} className="border" flush>
            <Accordion.Item eventKey={knowledgeGraphTree.objectId}>
            <ReactSortable
            // here they are!
            list={[knowledgeGraphTree]}
            setList={() => { }}
            group="knowledgePathEditor"
            animation={200}
            delayOnTouchStart={true}
            delay={2}
        >
                <AccordionHeader onClick={() => props.updateCollapsed(knowledgeGraphTree.objectId)}>
                    <KnowledgeGraphObject item={knowledgeGraphTree} />
                </AccordionHeader>
                </ReactSortable>

                <Accordion.Body className='p-0 ps-2'>
                    {knowledgeGraphTree.childObjects && knowledgeGraphTree.childObjects.map((item) => <KnowledgeGraphTree updateCollapsed={props.updateCollapsed} knowledgeGraphTree={item}/>)}
                </Accordion.Body>
            </Accordion.Item>
    </Accordion> : <ListGroup>
        <ReactSortable
        // here they are!
        list={[knowledgeGraphTree]}
        setList={() => { }}
        group="knowledgePathEditor"
        animation={200}
        delayOnTouchStart={true}
        delay={2}
    >
            <KnowledgeGraphObject item={knowledgeGraphTree} />
        </ReactSortable>
    </ListGroup>
}