import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';
import { KnowledgeGraphObject } from './knowledgeGraphObject';
import { ReactSortable } from "react-sortablejs";

export function KnowledgeGraphTree(props) {
    const knowledgeGraphTree = props.knowledgeGraphTree;
    const collapsed = props.collapsed;
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
                <Accordion.Header>
                    <KnowledgeGraphObject item={knowledgeGraphTree} />
                </Accordion.Header>
                </ReactSortable>

                <Accordion.Body className='p-0 ps-2'>
                    {knowledgeGraphTree.childObjects && knowledgeGraphTree.childObjects.map((item) => <KnowledgeGraphTree knowledgeGraphTree={item} collapsed={collapsed} />)}
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