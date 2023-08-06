import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

export function KnowledgeGraphObject(props) {
    const item = props.item;
    const show = props.show ?? true;
    return <ListGroup.Item className={show ? '' : 'd-none'} style="cursor: grab;" variant={props.variant} key={item.objectId}><Badge bg="primary">{item.type}</Badge> {item.title ?? item.name} {props.children}</ListGroup.Item>
}