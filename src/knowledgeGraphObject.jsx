import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

export function KnowledgeGraphObject(props) {
    const item = props.item;
    return <ListGroup.Item style="cursor: grab;" variant={props.variant} key={item.objectId}><Badge bg="primary">{item.type}</Badge> {item.title ?? item.name} {props.children}</ListGroup.Item>
}